import { BackendDocumentDTO, DocumentsResponseDTO } from "../../../types/api/documents";
import { DocumentData, DocumentStatus, DocumentType } from "../../dashboard/constants/recentDocumentsData";

export const documentAdapter = {
  adaptDocumentList(response: DocumentsResponseDTO): DocumentData[] {
    const backendDocs = response.items || (Array.isArray(response.data) ? response.data : response.data?.items) || [];
    
    return backendDocs.map(d => {
      const isCompleted = (d.status || "").toLowerCase() === "completed";
      
      return {
        id: d.id,
        // Backend mapping
        title: d.file_name || d.filename || "Untitled Document",
        fileName: d.file_name || d.filename || "document.pdf",
        documentType: (d.classification || "Report") as DocumentType,
        status: (d.status || "Completed") as DocumentStatus,
        uploadedAt: d.created_at || new Date().toISOString(),
        confidence: Math.round((d.classification_confidence || d.confidence_score || (isCompleted ? 0.95 : 0)) * 100),
        
        // --- PLACEHOLDERS for future backend additions ---
        // asset: Backend currently does not attach documents to assets. 
        //        Future endpoint: /api/v1/documents/:id/metadata
        asset: "General", 
        // uploadedBy: Backend field currently unused or unreliable in this struct.
        //        Future endpoint enhancement needed on GET /api/v1/documents/
        uploadedBy: "System",
        lastModified: d.created_at || new Date().toISOString(),
        // version: Backend does not support versioning yet. 
        //        Future endpoint: /api/v1/documents/:id/versions
        version: "v1.0",
        // fileSize: Backend does not return file size in the list endpoint.
        fileSize: "Unknown",
        // pages: Backend does not return page count natively yet.
        pages: 1,
        // tags: Categorization tagging system not yet implemented.
        tags: [],
        summary: "No summary available.",
        keyHighlights: [],
        // revisionHistory: Awaiting versioning endpoint.
        revisionHistory: [],
        // relatedEntities: Awaiting Knowledge Graph link endpoint.
        relatedEntities: [],
        complianceReferences: [],
        processingTimeline: (d.processing_events || []).map(evt => ({ timestamp: new Date().toISOString(), action: evt })),
        aiInsights: [],
        suggestedActions: [],
        owner: "System",
        department: "General",
        approvalStatus: "Approved"
      };
    });
  }
};
