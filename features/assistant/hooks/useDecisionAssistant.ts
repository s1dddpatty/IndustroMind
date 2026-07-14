import { useState, useCallback, useEffect } from "react";
import { decisionService } from "../services/decisionService";
import { ChatConversation } from "../constants/assistantData";
import { AssistantContext } from "../pages/DecisionAssistantPage";

export function useDecisionAssistant(context: AssistantContext) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Initialize from service
  useEffect(() => {
    setConversations(decisionService.getConversations());
  }, []);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const handleNewConversation = useCallback(() => {
    const newConv = decisionService.createConversation();
    setActiveConversationId(newConv.id);
    setConversations(decisionService.getConversations());
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const sendMessage = useCallback((text: string) => {
    let targetConvId = activeConversationId;
    if (!targetConvId) {
      const newConv = decisionService.createConversation();
      targetConvId = newConv.id;
      setActiveConversationId(newConv.id);
      // Important: Add it to state so the map function below can find it and it renders
      setConversations(decisionService.getConversations());
    }

    // Call service. It will emit updates via the callback
    decisionService.sendMessage(targetConvId, text, context, (updatedConv) => {
      setConversations(prev => prev.map(c => c.id === updatedConv.id ? updatedConv : c));
    });
  }, [activeConversationId, context]);

  const retryLastMessage = useCallback((messageId: string) => {
    if (!activeConversationId) return;
    decisionService.retryMessage(activeConversationId, messageId, context, (updatedConv) => {
      setConversations(prev => prev.map(c => c.id === updatedConv.id ? updatedConv : c));
    });
  }, [activeConversationId, context]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    sendMessage,
    handleNewConversation,
    selectConversation,
    retryLastMessage,
  };
}
