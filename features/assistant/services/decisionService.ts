import { decisionRepository } from "../repositories/decisionRepository";
import { decisionAdapter } from "../adapters/decisionAdapter";
import { ChatConversation, ChatMessage, MOCK_CONVERSATIONS } from "../constants/assistantData";
import { AssistantContext } from "../pages/DecisionAssistantPage";
import { APP_MODE, getDemoLatency } from "@/features/shared/config/appMode";

class DecisionService {
  private activeConversations: Map<string, ChatConversation> = new Map();
  private abortControllers: Map<string, AbortController> = new Map();

  constructor() {
    // Seed with mock data for display purposes
    MOCK_CONVERSATIONS.forEach(conv => this.activeConversations.set(conv.id, { ...conv }));
  }

  getConversations(): ChatConversation[] {
    return Array.from(this.activeConversations.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getConversation(id: string): ChatConversation | undefined {
    return this.activeConversations.get(id);
  }

  createConversation(department: "Maintenance" | "Operations" | "Compliance" | "Engineering" | "Safety" = "Operations"): ChatConversation {
    const newConv: ChatConversation = {
      id: `conv-${Date.now()}`,
      title: "New Conversation",
      department,
      timestamp: new Date().toISOString(),
      pinned: false,
      status: "active",
      messages: []
    };
    this.activeConversations.set(newConv.id, newConv);
    return newConv;
  }

  /**
   * Orchestrates sending a message. Handles optimistic UI, aborts previous requests, 
   * manages lifecycle states (pending -> receiving -> completed/error), and injects context automatically.
   */
  async sendMessage(
    conversationId: string, 
    content: string, 
    context: AssistantContext, 
    onUpdate: (conv: ChatConversation) => void
  ): Promise<void> {
    
    // 1. Abort any running request for this conversation
    if (this.abortControllers.has(conversationId)) {
      this.abortControllers.get(conversationId)?.abort();
      this.abortControllers.delete(conversationId);
    }

    const conv = this.activeConversations.get(conversationId);
    if (!conv) throw new Error("Conversation not found");

    // 2. Add optimistic User message
    const userMsgId = `msg-usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      status: "completed"
    };

    // 3. Add placeholder Assistant message (Pending State)
    const assistantMsgId = `msg-ast-${Date.now()}`;
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "Analyzing your request...",
      timestamp: new Date().toISOString(),
      status: "pending"
    };

    conv.messages.push(userMsg, assistantMsg);
    conv.timestamp = new Date().toISOString();
    
    // Auto-update title if it's the first message
    if (conv.messages.length === 2) {
      conv.title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
    }
    
    onUpdate({ ...conv }); // Emit optimistic state

    // 4. Create Abort Controller and Context Payload
    const controller = new AbortController();
    this.abortControllers.set(conversationId, controller);

    try {
      // Simulate transition to receiving/streaming
      setTimeout(() => {
        const currentMsg = conv.messages.find(m => m.id === assistantMsgId);
        if (currentMsg && currentMsg.status === "pending") {
          currentMsg.status = "receiving";
          currentMsg.content = "Querying Knowledge Graph...";
          onUpdate({ ...conv });
        }
      }, 300);

      // Build payload automatically weaving in the context banner details
      const payloadContextDetails = [
        context.sourceModule ? `Source: ${context.sourceModule}` : '',
        context.selectedAsset ? `Asset: ${context.selectedAsset}` : '',
        context.selectedDocument ? `Document: ${context.selectedDocument}` : '',
        context.selectedComplianceRule ? `Compliance Rule: ${context.selectedComplianceRule}` : '',
        context.selectedReport ? `Report: ${context.selectedReport}` : '',
        context.selectedGraphNode ? `Node: ${context.selectedGraphNode}` : ''
      ].filter(Boolean).join(" | ");

      const enhancedQuery = payloadContextDetails 
        ? `[Context: ${payloadContextDetails}] \n${content}`
        : content;

      let finalMsg: ChatMessage;

      if (APP_MODE === "DEMO") {
        await getDemoLatency(800, 1500);
        // Fallback mock logic for presentation
        const isRestart = content.toLowerCase().includes("restart");
        finalMsg = isRestart ? MOCK_CONVERSATIONS[0].messages[1] : MOCK_CONVERSATIONS[1].messages[1];
        finalMsg = { ...finalMsg, id: assistantMsgId, timestamp: Date.now().toString() };
      } else {
        try {
          const res = await decisionRepository.queryAssistant({ query: enhancedQuery }, controller.signal);
          finalMsg = decisionAdapter.adaptDecisionBriefToMessage(res.data, assistantMsgId, Date.now().toString());
        } catch (error: any) {
          if (APP_MODE === "AUTO" && error.name !== "CanceledError" && error.name !== "AbortError") {
            console.warn("Backend unreachable, falling back to DEMO mode for assistant.");
            const isRestart = content.toLowerCase().includes("restart");
            finalMsg = isRestart ? MOCK_CONVERSATIONS[0].messages[1] : MOCK_CONVERSATIONS[1].messages[1];
            finalMsg = { ...finalMsg, id: assistantMsgId, timestamp: Date.now().toString() };
          } else {
            throw error;
          }
        }
      }
      
      // Replace placeholder
      const idx = conv.messages.findIndex(m => m.id === assistantMsgId);
      if (idx !== -1) {
        conv.messages[idx] = finalMsg;
      }
      
      onUpdate({ ...conv });
    } catch (error: any) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        // Ignored, user sent another message
        return;
      }
      
      // 6. Handle Error
      const idx = conv.messages.findIndex(m => m.id === assistantMsgId);
      if (idx !== -1) {
        conv.messages[idx].status = "error";
        conv.messages[idx].content = "Failed to process request.";
        conv.messages[idx].errorDetail = error.message || "Unknown backend error";
      }
      
      onUpdate({ ...conv });
    } finally {
      this.abortControllers.delete(conversationId);
    }
  }

  /**
   * Retries a failed message by replacing the assistant response cleanly.
   */
  async retryMessage(conversationId: string, assistantMsgId: string, context: AssistantContext, onUpdate: (conv: ChatConversation) => void) {
    const conv = this.activeConversations.get(conversationId);
    if (!conv) return;

    const msgIdx = conv.messages.findIndex(m => m.id === assistantMsgId);
    if (msgIdx <= 0) return; // Must exist and have a preceding user message

    const userMsg = conv.messages[msgIdx - 1];
    if (userMsg.role !== "user") return;

    // Reset status to pending
    conv.messages[msgIdx] = {
      id: assistantMsgId,
      role: "assistant",
      content: "Retrying request...",
      timestamp: new Date().toISOString(),
      status: "pending"
    };
    
    onUpdate({ ...conv });

    // We can't reuse the exact flow above without duplication, so we manually call repo here
    // In a real refactor, we would extract the core request logic.
    const controller = new AbortController();
    this.abortControllers.set(conversationId, controller);

    try {
      const payloadContextDetails = [
        context.sourceModule ? `Source: ${context.sourceModule}` : '',
        context.selectedAsset ? `Asset: ${context.selectedAsset}` : ''
      ].filter(Boolean).join(" | ");

      const enhancedQuery = payloadContextDetails 
        ? `[Context: ${payloadContextDetails}] \n${userMsg.content}`
        : userMsg.content;

      let finalMsg: ChatMessage;
      
      if (APP_MODE === "DEMO") {
        await getDemoLatency(800, 1500);
        const isRestart = userMsg.content.toLowerCase().includes("restart");
        finalMsg = isRestart ? MOCK_CONVERSATIONS[0].messages[1] : MOCK_CONVERSATIONS[1].messages[1];
        finalMsg = { ...finalMsg, id: assistantMsgId, timestamp: Date.now().toString() };
      } else {
        try {
          const res = await decisionRepository.queryAssistant({ query: enhancedQuery }, controller.signal);
          finalMsg = decisionAdapter.adaptDecisionBriefToMessage(res.data, assistantMsgId, Date.now().toString());
        } catch (error: any) {
          if (APP_MODE === "AUTO" && error.name !== "CanceledError" && error.name !== "AbortError") {
            const isRestart = userMsg.content.toLowerCase().includes("restart");
            finalMsg = isRestart ? MOCK_CONVERSATIONS[0].messages[1] : MOCK_CONVERSATIONS[1].messages[1];
            finalMsg = { ...finalMsg, id: assistantMsgId, timestamp: Date.now().toString() };
          } else {
            throw error;
          }
        }
      }
      
      conv.messages[msgIdx] = finalMsg;
      onUpdate({ ...conv });
    } catch (error: any) {
      if (error.name === "CanceledError" || error.name === "AbortError") return;
      conv.messages[msgIdx].status = "error";
      conv.messages[msgIdx].content = "Failed to process request.";
      conv.messages[msgIdx].errorDetail = error.message || "Unknown error";
      onUpdate({ ...conv });
    } finally {
      this.abortControllers.delete(conversationId);
    }
  }
}

export const decisionService = new DecisionService();
