export interface DemoQuery {
  id: string;
  query: string;
  timeAgo: string;
}

export const demoQueries: DemoQuery[] = [
  {
    id: "q1",
    query: "Is Pump P-201 safe to restart?",
    timeAgo: "30 min ago"
  },
  {
    id: "q2",
    query: "Show me all SOP conflicts",
    timeAgo: "2h ago"
  },
  {
    id: "q3",
    query: "What inspections are due this week?",
    timeAgo: "5h ago"
  },
  {
    id: "q4",
    query: "Generate compliance report",
    timeAgo: "1d ago"
  }
];
