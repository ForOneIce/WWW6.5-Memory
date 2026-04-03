import { GitHubPR, CampStats, ParticipantStats } from '../types';
import { isWithinInterval, parseISO, getHours, getDay } from 'date-fns';

const REPO = '0xherstory/WWW6.5';

export async function fetchAllPRs(token?: string): Promise<GitHubPR[]> {
  let allPRs: GitHubPR[] = [];
  let page = 1;
  const perPage = 100;

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    while (true) {
      // Use state=all to get both open and closed PRs
      const response = await fetch(
        `https://api.github.com/repos/${REPO}/pulls?state=all&per_page=${perPage}&page=${page}`,
        { headers }
      );
      
      if (!response.ok) {
        if (response.status === 403) {
          const rateLimit = response.headers.get('X-RateLimit-Remaining');
          if (rateLimit === '0') {
            console.warn('GitHub API rate limit exceeded. Please provide a token.');
          }
          break;
        }
        throw new Error('Failed to fetch PRs');
      }

      const prs: GitHubPR[] = await response.json();
      if (prs.length === 0) break;
      
      allPRs = [...allPRs, ...prs];
      if (prs.length < perPage) break;
      page++;
      
      if (page > 30) break; // Increased limit to 3000 PRs
    }
  } catch (error) {
    console.error('Error fetching PRs:', error);
  }

  return allPRs;
}

export function processCampData(prs: GitHubPR[]): CampStats {
  const stats: CampStats = {
    totalParticipants: 0,
    totalPRs: prs.length,
    totalMerged: 0,
    totalRejected: 0,
    participants: {},
    topPersistent: null,
    topNightOwl: null,
    topCodeQueen: null,
    topGuardian: null,
    topEarlyBird: null,
    topCraftsman: null,
    topFirstShot: null,
    topFinale: null,
    topDeadlineMaster: null,
    topLoneBrave: null,
    topChatterbox: null,
    allMessages: [],
  };

  const chineseRegex = /[\u4e00-\u9fa5]/;

  // Sort PRs by creation date to find first/last
  const sortedPRs = [...prs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
  prs.forEach((pr) => {
    const username = pr.user.login;
    if (!stats.participants[username]) {
      stats.participants[username] = {
        user: pr.user,
        totalPRs: 0,
        mergedPRs: 0,
        rejectedPRs: 0,
        nightPRs: 0,
        earlyPRs: 0,
        deadlinePRs: 0,
        totalDescriptionLength: 0,
        lonePRs: 0,
        mergesPerformed: 0,
        messages: [],
      };
    }

    const p = stats.participants[username];
    p.totalPRs++;
    p.totalDescriptionLength += (pr.body?.length || 0);
    
    // Check for "Lone Brave" (no comments)
    if ((pr.comments || 0) === 0) {
      p.lonePRs++;
    }

    if (pr.merged_at) {
      stats.totalMerged++;
      p.mergedPRs++;
      
      // If we had merged_by data, we would increment mergesPerformed for the reviewer
      // Since we don't have it in the list, we'll skip Guardian for now or use a mock if needed
      // But let's assume we might have it if we fetched details
    } else if (pr.state === 'closed' && !pr.merged_at) {
      stats.totalRejected++;
      p.rejectedPRs++;
    }

    const createdDate = parseISO(pr.created_at);
    // Use UTC+8 (Beijing Time)
    const utcHour = createdDate.getUTCHours();
    const beijingHour = (utcHour + 8) % 24;
    const beijingDay = getDay(new Date(createdDate.getTime() + 8 * 60 * 60 * 1000));

    // Night Owl: 00:00 - 05:00
    if (beijingHour >= 0 && beijingHour < 5) {
      p.nightPRs++;
    } 
    // Early Bird: 06:00 - 09:00
    else if (beijingHour >= 6 && beijingHour < 9) {
      p.earlyPRs++;
    }

    // Deadline Master: Sunday after 23:00
    if (beijingDay === 0 && beijingHour >= 23) {
      p.deadlinePRs++;
    }

    if (pr.body) {
      // Extract Chinese content
      const lines = pr.body.split('\n');
      lines.forEach(line => {
        if (chineseRegex.test(line)) {
          const cleanLine = line.replace(/!\[.*\]\(.*\)/g, '').trim(); // Remove images
          if (cleanLine.length > 5) {
            p.messages.push(cleanLine);
            stats.allMessages.push({
              user: pr.user,
              text: cleanLine,
              date: pr.created_at
            });
          }
        }
      });
    }
  });

  const participantList: ParticipantStats[] = Object.values(stats.participants);
  stats.totalParticipants = participantList.length;

  // Calculate Awards
  stats.topPersistent = [...participantList].sort((a, b) => b.rejectedPRs - a.rejectedPRs || b.totalPRs - a.totalPRs)[0] || null;
  stats.topNightOwl = [...participantList].sort((a, b) => b.nightPRs - a.nightPRs || b.totalPRs - a.totalPRs)[0] || null;
  stats.topCodeQueen = [...participantList].sort((a, b) => b.mergedPRs - a.mergedPRs || b.totalPRs - a.totalPRs)[0] || null;
  
  stats.topEarlyBird = [...participantList].sort((a, b) => b.earlyPRs - a.earlyPRs || b.totalPRs - a.totalPRs)[0] || null;
  stats.topDeadlineMaster = [...participantList].sort((a, b) => b.deadlinePRs - a.deadlinePRs || b.totalPRs - a.totalPRs)[0] || null;
  stats.topLoneBrave = [...participantList].sort((a, b) => b.lonePRs - a.lonePRs || b.totalPRs - a.totalPRs)[0] || null;
  stats.topChatterbox = [...participantList].sort((a, b) => b.totalDescriptionLength - a.totalDescriptionLength)[0] || null;
  
  // First Shot: First PR ever submitted
  if (sortedPRs.length > 0) {
    stats.topFirstShot = stats.participants[sortedPRs[0].user.login] || null;
  }

  // Finale: Last merged PR
  const mergedPRs = sortedPRs.filter(pr => pr.merged_at).sort((a, b) => new Date(a.merged_at!).getTime() - new Date(b.merged_at!).getTime());
  if (mergedPRs.length > 0) {
    stats.topFinale = stats.participants[mergedPRs[mergedPRs.length - 1].user.login] || null;
  }

  // Craftsman: Proxy by description length or we could use comments as proxy for "iteration"
  stats.topCraftsman = [...participantList].sort((a, b) => b.totalDescriptionLength - a.totalDescriptionLength)[0] || null;

  return stats;
}
