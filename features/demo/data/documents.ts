export interface DemoDocument {
  id: string;
  title: string;
  type: string;
  context: string;
  timeAgo: string;
  status: "Processed" | "Processing" | "Failed";
}

export const demoDocuments: DemoDocument[] = [
  {
    id: "doc-1",
    title: "SOP-MAINT-P201.pdf",
    type: "Maintenance SOP",
    context: "Pump P-201",
    timeAgo: "2h ago",
    status: "Processed"
  },
  {
    id: "doc-2",
    title: "OISD-GDN-116.pdf",
    type: "Inspection Guideline",
    context: "OISD",
    timeAgo: "5h ago",
    status: "Processed"
  },
  {
    id: "doc-3",
    title: "Pump_P-201_Datasheet.pdf",
    type: "Equipment Datasheet",
    context: "Pump P-201",
    timeAgo: "1d ago",
    status: "Processed"
  }
];
