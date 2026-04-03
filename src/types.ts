export interface GitHubUser {
  login: string;
  avatar_url: string;
}

export interface GitHubPR {
  id: number;
  number: number;
  state: string;
  title: string;
  body: string | null;
  user: GitHubUser;
  created_at: string;
  merged_at: string | null;
  closed_at: string | null;
  html_url: string;
  comments?: number;
  merged_by?: GitHubUser;
}

export interface ParticipantStats {
  user: GitHubUser;
  totalPRs: number;
  mergedPRs: number;
  rejectedPRs: number;
  nightPRs: number; // 00:00 - 05:00
  earlyPRs: number; // 06:00 - 09:00
  deadlinePRs: number; // Sunday after 23:00
  totalDescriptionLength: number;
  lonePRs: number; // No comments/interaction
  mergesPerformed: number; // For PR Guardian
  messages: string[];
}

export interface CampStats {
  totalParticipants: number;
  totalPRs: number;
  totalMerged: number;
  totalRejected: number;
  participants: Record<string, ParticipantStats>;
  // Awards
  topPersistent: ParticipantStats | null;
  topNightOwl: ParticipantStats | null;
  topCodeQueen: ParticipantStats | null;
  topGuardian: ParticipantStats | null;
  topEarlyBird: ParticipantStats | null;
  topCraftsman: ParticipantStats | null; // Placeholder for now or based on description
  topFirstShot: ParticipantStats | null;
  topFinale: ParticipantStats | null;
  topDeadlineMaster: ParticipantStats | null;
  topLoneBrave: ParticipantStats | null;
  topChatterbox: ParticipantStats | null;
  allMessages: { user: GitHubUser; text: string; date: string }[];
}
