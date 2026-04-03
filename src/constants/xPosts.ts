export interface XPost {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  date: string;
  content: string;
  stats: {
    likes: number;
    retweets: number;
    views: number;
  };
  url: string;
}

export const X_POSTS: XPost[] = [
  {
    id: '1',
    user: {
      name: 'woshiniranjie',
      handle: '@woshiniranjie',
      avatar: 'https://pbs.twimg.com/profile_images/1776845295940427776/mI33Gcqi.jpg',
    },
    date: '3月31日',
    content: 'Day29 in becoming a Solidity developer\n今天学习了交易所… 有点像工厂模式。明天开始黑客松！ #BuildInPublic #solidity',
    stats: { likes: 3, retweets: 0, views: 51 },
    url: 'https://x.com/woshiniranjie/status/2039024607802294297',
  },
  {
    id: '2',
    user: {
      name: 'richCillian',
      handle: '@richCillian',
      avatar: 'https://pbs.twimg.com/profile_images/2030651687996948480/MXHIzInu.jpg',
    },
    date: '3月31日',
    content: 'solidity30天挑战完成… 在herstory社群中我学习到了很多东西，感受到了全女学习营的互助、鼓舞氛围，感受到了女性力量，不止代码。',
    stats: { likes: 0, retweets: 0, views: 17 },
    url: 'https://x.com/richCillian/status/2038979545928527900',
  },
  {
    id: '3',
    user: {
      name: 'tendo20960529',
      handle: '@tendo20960529',
      avatar: 'https://pbs.twimg.com/profile_images/1859512168053690368/aIKP1dis.jpg',
    },
    date: '3月31日',
    content: '最后两天很舍不得0xHerstory! day29,day30 透过构建超额抵押稳定币… 代码虽短，DeFi世界的大门才刚刚打开。',
    stats: { likes: 2, retweets: 0, views: 60 },
    url: 'https://x.com/tendo20960529/status/2038962376645783875',
  },
  {
    id: '4',
    user: {
      name: 'scout0451',
      handle: '@scout0451',
      avatar: 'https://pbs.twimg.com/profile_images/2027612871845416963/rLVtfgNY.jpg',
    },
    date: '3月31日',
    content: 'Day 30 in becoming a Solidity developer 终于到了最后一天，学完了去中心化交易所合约… 小小的里程碑还是值得庆祝一下。',
    stats: { likes: 5, retweets: 1, views: 42 },
    url: 'https://x.com/scout0451/status/2038959528381927915',
  },
  {
    id: '5',
    user: {
      name: 'ShiAnnona',
      handle: '@ShiAnnona',
      avatar: 'https://pbs.twimg.com/profile_images/2027564754915721217/q1jOR2FT.png',
    },
    date: '3月31日',
    content: 'Day {30} … Have the "Solidity muscle" for developing complex systems #BuildinPublic',
    stats: { likes: 8, retweets: 2, views: 88 },
    url: 'https://x.com/ShiAnnona/status/2038965959688696073',
  },
  {
    id: '6',
    user: {
      name: 'PotatoMa798',
      handle: '@PotatoMa798',
      avatar: 'https://pbs.twimg.com/profile_images/1980641051237908480/CUFypijE.jpg',
    },
    date: '3月30日',
    content: 'Day {30} 进入紧张刺激的 demo 环节… 希望最后都能落地并拿奖嘿嘿！ #HerstoryWeb3',
    stats: { likes: 4, retweets: 0, views: 35 },
    url: 'https://x.com/PotatoMa798/status/2038764266128560563',
  },
];

export const X_STATS = {
  totalTweets: "28+",
  totalViews: "2,800+",
  metrics: [
    { label: "最高单篇曝光", value: "535 views" },
    { label: "平均单篇曝光", value: "85 views" },
  ],
  highlights: [
    { label: "最勤奋 Builder", value: "@woshiniranjie", detail: "连续 Day29-30 多篇" },
    { label: "最鼓舞人心", value: "@richCillian", detail: "「女性力量，不止代码」" },
    { label: "最完整 30 天", value: "@ShiAnnona & @tendo20960529", detail: "完成 MiniDEX" },
    { label: "最活跃一天", value: "3月31日", detail: "结业日" },
  ],
  stories: [
    {
      text: "多位姐妹在最后两天发文「好舍不得0xHerstory！」",
      author: "@tendo20960529"
    },
    {
      text: "从「一窍不通」到「不再害怕长代码」",
      author: "@Pengpeng879 重学第一周"
    }
  ]
};

export const X_REVIEW = [
  {
    period: "第1-10天",
    title: "基础打底 + 工具上手",
    description: "Notion、GitHub、Remix、第一个 counter 合约…姐妹们从零开始，第一次在 X 上分享「今天学会了什么」。"
  },
  {
    period: "第11-20天",
    title: "进阶合约 + 真实 DeFi 逻辑",
    description: "升级合约、代理模式、NFT、ERC721… 每天的 #BuildInPublic 成为习惯，也成为彼此鼓励的动力。"
  },
  {
    period: "第21-30天",
    title: "DeFi 核心 + Hackathon 准备",
    description: "AMM、稳定币、DAO、Mini DEX… 3月31日多位姐妹发文「终于完成30天！」Pink HerSolidity Hackathon 即将登場。"
  }
];
