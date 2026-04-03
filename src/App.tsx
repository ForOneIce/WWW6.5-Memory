/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Moon, 
  Sun, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Github, 
  Heart,
  Sparkles,
  ChevronRight,
  Quote,
  Key,
  X as CloseIcon,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Twitter,
  ExternalLink,
  Eye,
  Repeat2,
  Hammer,
  Target,
  Flag,
  Clock,
  User
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchAllPRs, processCampData } from './services/githubService';
import { CampStats, ParticipantStats } from './types';
import { cn } from './lib/utils';
import { X_POSTS, X_STATS, X_REVIEW } from './constants/xPosts';

const COLORS = ['#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function App() {
  const [stats, setStats] = useState<CampStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'photo' | 'stats' | 'gallery' | 'messages'>('photo');
  const [githubToken, setGithubToken] = useState<string>(() => localStorage.getItem('github_token') || '');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (token?: string) => {
    setIsRefreshing(true);
    const prs = await fetchAllPRs(token);
    const processed = processCampData(prs);
    setStats(processed);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData(githubToken);
  }, []);

  const handleSaveToken = () => {
    localStorage.setItem('github_token', tempToken);
    setGithubToken(tempToken);
    setShowTokenModal(false);
    fetchData(tempToken);
  };

  const handleClearToken = () => {
    localStorage.removeItem('github_token');
    setGithubToken('');
    setTempToken('');
    fetchData('');
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#c026d3', '#a78bfa', '#ec4899']
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <Sparkles className="w-12 h-12 text-purple-500" />
        </motion.div>
        <h2 className="text-2xl font-serif italic mb-2">正在筹备毕业典礼...</h2>
        <p className="text-slate-400 animate-pulse">回顾 0xherstory Solidity 共学营的点洞</p>
      </div>
    );
  }

  if (!stats) return null;

  const chartData = [
    { name: '已合并', value: stats.totalMerged },
    { name: '待改进/关闭', value: stats.totalRejected },
  ];

  const topParticipants = Object.values(stats.participants)
    .sort((a, b) => b.totalPRs - a.totalPRs)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Navigation / Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-end items-center pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={() => {
              setTempToken(githubToken);
              setShowTokenModal(true);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md border",
              githubToken 
                ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20" 
                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800"
            )}
          >
            {githubToken ? <CheckCircle2 className="w-4 h-4" /> : <Key className="w-4 h-4" />}
            {githubToken ? "Token 已设置" : "设置 GitHub Token"}
          </button>
        </div>
      </nav>

      {/* Token Modal */}
      <AnimatePresence>
        {showTokenModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTokenModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowTokenModal(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold">GitHub Token</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    提供 Personal Access Token (classic) 以绕过 GitHub API 的访问限制，获取更完整的共学数据。
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={tempToken}
                      onChange={(e) => setTempToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>Token 仅保存在本地浏览器缓存中，不会上传到任何服务器。</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveToken}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-600/20"
                  >
                    保存并刷新
                  </button>
                  {githubToken && (
                    <button
                      onClick={handleClearToken}
                      className="px-4 py-3 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl transition-all"
                    >
                      清除
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>2026.03 Solidity 共学营 · 结营庆典</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            代码织就的<br />璀璨星河
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            在这个三月，我们共同见证了每一位姐妹的成长。<br />
            从第一个 PR 的忐忑，到代码逻辑的严丝合缝，<br />
            每一行注释都记录着我们对 Web3 世界的探索与热爱。
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setActiveTab('photo')}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
                activeTab === 'photo' ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "bg-slate-900 border border-slate-800 hover:border-slate-700"
              )}
            >
              <Users className="w-5 h-5" />
              毕业合影
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
                activeTab === 'stats' ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "bg-slate-900 border border-slate-800 hover:border-slate-700"
              )}
            >
              <BarChart3 className="w-5 h-5" />
              共学看板
            </button>
            <button 
              onClick={() => setActiveTab('gallery')}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
                activeTab === 'gallery' ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "bg-slate-900 border border-slate-800 hover:border-slate-700"
              )}
            >
              <Twitter className="w-5 h-5" />
              Build in Public
            </button>
            <button 
              onClick={launchConfetti}
              className="px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-pink-500/50 text-pink-300"
            >
              <GraduationCap className="w-5 h-5" />
              抛帽庆祝！
            </button>
          </div>

          <div className="flex justify-center gap-12 mt-16 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400">{stats.totalParticipants}</div>
              <div className="text-slate-400 text-sm">位姐妹参与</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">{X_STATS.totalTweets}</div>
              <div className="text-slate-400 text-sm">篇公开推文</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">3.31</div>
              <div className="text-slate-400 text-sm">最后一天高潮</div>
            </div>
          </div>
        </motion.div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%` 
              }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{ 
                duration: 2 + Math.random() * 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
          
          {/* Larger glowing stars */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`glow-${i}`}
              className="absolute w-2 h-2 bg-purple-400 rounded-full blur-[2px]"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%` 
              }}
              animate={{ 
                scale: [1, 2, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{ 
                duration: 4 + Math.random() * 6, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-8 py-4">
          <TabButton active={activeTab === 'photo'} onClick={() => setActiveTab('photo')} icon={<Users className="w-4 h-4" />} label="毕业合影" />
          <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<BarChart3 className="w-4 h-4" />} label="共学看板" />
          <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<Twitter className="w-4 h-4" />} label="Build in Public" />
          <TabButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<MessageSquare className="w-4 h-4" />} label="姐妹留言板" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20 relative">
        {isRefreshing && (
          <div className="absolute inset-0 z-10 bg-slate-950/20 backdrop-blur-[2px] flex justify-center pt-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'photo' && (
            <motion.div
              key="photo"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">毕业合影</h2>
                <p className="text-pink-300">汇聚了 {stats.totalParticipants} 位参与共学的姐妹</p>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {Object.values(stats.participants).map((p, i) => (
                  <motion.div
                    key={p.user.login}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="group relative flex flex-col items-center"
                  >
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-slate-800 group-hover:border-pink-500 transition-all duration-300 shadow-lg shadow-black/20 group-hover:shadow-pink-500/20">
                      <img 
                        src={p.user.avatar_url} 
                        alt={p.user.login} 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.div 
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </motion.div>
                    </div>
                    <span className="mt-2 text-xs text-slate-400 group-hover:text-white truncate w-full text-center">
                      {p.user.login}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Users className="text-blue-400" />} label="共学人数" value={stats.totalParticipants} />
                <StatCard icon={<Github className="text-purple-400" />} label="总提交 PR" value={stats.totalPRs} />
                <StatCard icon={<Heart className="text-pink-400" />} label="已合并 PR" value={stats.totalMerged} />
                <StatCard icon={<Sparkles className="text-amber-400" />} label="成功率" value={`${Math.round((stats.totalMerged / stats.totalPRs) * 100)}%`} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Trophy className="text-amber-400 w-5 h-5" />
                    活跃度 Top 5
                  </h3>
                  <div className="h-[300px] w-full min-h-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={topParticipants}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="user.login" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                          itemStyle={{ color: '#8b5cf6' }}
                        />
                        <Bar dataKey="totalPRs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <PieChart className="text-pink-400 w-5 h-5" />
                    合并情况分布
                  </h3>
                  <div className="h-[300px] w-full min-h-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <h3 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">共学之最 · 荣誉殿堂</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AwardCard 
                    icon={<Trophy className="w-8 h-8 text-amber-400" />}
                    title="最有毅力奖"
                    description="被拒绝次数最多，但从未放弃尝试"
                    awardText="羊村最强韧性"
                    participant={stats.topPersistent}
                    metricLabel="被拒次数"
                    metricValue={stats.topPersistent?.rejectedPRs || 0}
                  />
                  <AwardCard 
                    icon={<Moon className="w-8 h-8 text-indigo-400" />}
                    title="最强夜猫子"
                    description="深夜 0-5 点提交代码最多的姐妹"
                    awardText="星光下的守望者"
                    participant={stats.topNightOwl}
                    metricLabel="深夜提交"
                    metricValue={stats.topNightOwl?.nightPRs || 0}
                  />
                  <AwardCard 
                    icon={<Sparkles className="w-8 h-8 text-pink-400" />}
                    title="代码女王"
                    description="成功合并 PR 次数最多的姐妹"
                    awardText="逻辑与美的缔造者"
                    participant={stats.topCodeQueen}
                    metricLabel="合并次数"
                    metricValue={stats.topCodeQueen?.mergedPRs || 0}
                  />
                  <AwardCard 
                    icon={<Sun className="w-8 h-8 text-orange-400" />}
                    title="早鸟勋章"
                    description="清晨 6-9 点提交代码最多的姐妹"
                    awardText="晨光里的第一行代码，开启无限可能"
                    participant={stats.topEarlyBird}
                    metricLabel="清晨提交"
                    metricValue={stats.topEarlyBird?.earlyPRs || 0}
                  />
                  <AwardCard 
                    icon={<Target className="w-8 h-8 text-red-400" />}
                    title="首枪勋章"
                    description="营期内第一个提交 PR 的姐妹"
                    awardText="勇敢的开路者，点燃所有人的信心"
                    participant={stats.topFirstShot}
                    metricLabel="提交顺序"
                    metricValue="No.1"
                  />
                  <AwardCard 
                    icon={<Flag className="w-8 h-8 text-emerald-400" />}
                    title="压轴勋章"
                    description="最后一个提交 PR 并成功合并的姐妹"
                    awardText="坚持到最后，完美收官"
                    participant={stats.topFinale}
                    metricLabel="收官之作"
                    metricValue="Final"
                  />
                  <AwardCard 
                    icon={<Clock className="w-8 h-8 text-blue-400" />}
                    title="卡点大师"
                    description="周日晚上 11 点后提交最多的姐妹"
                    awardText="压力是最好的催化剂"
                    participant={stats.topDeadlineMaster}
                    metricLabel="卡点提交"
                    metricValue={stats.topDeadlineMaster?.deadlinePRs || 0}
                  />
                  <AwardCard 
                    icon={<User className="w-8 h-8 text-slate-400" />}
                    title="孤勇者勋章"
                    description="单人提交 PR 但无人互动的姐妹"
                    awardText="沉默的坚持，同样震耳欲聋"
                    participant={stats.topLoneBrave}
                    metricLabel="默默努力"
                    metricValue={stats.topLoneBrave?.lonePRs || 0}
                  />
                  <AwardCard 
                    icon={<MessageSquare className="w-8 h-8 text-cyan-400" />}
                    title="话痨勋章"
                    description="PR 描述文字最长最详细的姐妹"
                    awardText="你的认真，让代码有了温度"
                    participant={stats.topChatterbox}
                    metricLabel="描述字数"
                    metricValue={stats.topChatterbox?.totalDescriptionLength || 0}
                  />
                  <AwardCard 
                    icon={<Hammer className="w-8 h-8 text-yellow-600" />}
                    title="慢工细活勋章"
                    description="PR 描述最详尽，打磨最久的姐妹"
                    awardText="精雕细琢，方显匠心"
                    participant={stats.topCraftsman}
                    metricLabel="匠心指数"
                    metricValue={Math.round((stats.topCraftsman?.totalDescriptionLength || 0) / 10)}
                  />
                  <AwardCard 
                    icon={<Heart className="w-8 h-8 text-red-500" />}
                    title="PR 守护者"
                    description="审核操作合并最多的姐妹"
                    awardText="羊村作业本守护者"
                    participant={stats.topGuardian}
                    metricLabel="守护次数"
                    metricValue={stats.topGuardian?.mergesPerformed || "Admin"}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-20"
            >
              {/* X Stats Overview */}
              <div className="space-y-8">
                <div className="section-header">
                  <h2 className="text-4xl font-bold">3月共学 X 数据看板</h2>
                  <p className="text-pink-300 mt-2">@HerstoryWeb3 运营视角 · 真实数据汇总</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-pink-400/20 rounded-3xl p-8">
                    <div className="text-pink-400 text-sm font-medium mb-2">总共学推文</div>
                    <div className="text-6xl font-bold text-white">{X_STATS.totalTweets}</div>
                    <div className="text-sm text-pink-200 mt-6">提及 @HerstoryWeb3 并分享 Solidity 学习心得</div>
                    <div className="h-2 bg-pink-400/30 rounded-3xl mt-8 overflow-hidden">
                      <div className="h-2 w-[85%] bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl"></div>
                    </div>
                    <div className="text-xs text-pink-300 mt-2">3月1日～31日</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-pink-400/20 rounded-3xl p-8">
                    <div className="text-pink-400 text-sm font-medium mb-2">总曝光量</div>
                    <div className="text-6xl font-bold text-white">{X_STATS.totalViews}</div>
                    <div className="text-sm text-pink-200 mt-6">Views 累计 • 姐妹们的声音被看见</div>
                    <div className="mt-8 flex gap-4 text-[10px]">
                      {X_STATS.metrics.map((m, i) => (
                        <div key={i} className="flex-1 bg-white/10 rounded-2xl p-3 text-center">
                          <p className="text-slate-400">{m.label}</p>
                          <p className="font-bold text-pink-400">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-pink-400/20 rounded-3xl p-8">
                    <div className="text-pink-400 text-sm font-medium mb-2">之最 · 行为总结</div>
                    <ul className="space-y-4 text-xs">
                      {X_STATS.highlights.map((h, i) => (
                        <li key={i} className="flex justify-between items-start gap-2">
                          <span className="text-pink-200 shrink-0">{h.label}</span>
                          <span className="font-bold text-right">{h.value}<br/><span className="text-[10px] font-normal text-slate-400">{h.detail}</span></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-pink-400/20 rounded-3xl p-8 flex flex-col">
                    <div className="text-pink-400 text-sm font-medium mb-2">有趣互动故事</div>
                    <div className="flex-1 space-y-6 text-xs">
                      {X_STATS.stories.map((s, i) => (
                        <div key={i} className="border-l-2 border-pink-400 pl-4">
                          <p className="text-slate-200 leading-relaxed">{s.text}</p>
                          <p className="text-pink-300 text-[10px] mt-1">— {s.author}</p>
                        </div>
                      ))}
                      <div className="text-[10px] text-pink-400 mt-auto pt-4 italic">
                        这些小故事，将成为我们未来回忆里最温暖的部分 💕
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer's Review */}
              <div className="space-y-8">
                <div className="section-header">
                  <h2 className="text-4xl font-bold">从 @HerstoryWeb3 视角看 3 月共学</h2>
                  <p className="text-pink-300 mt-2">30 天，我们一起见证 300+ 姐妹的成长</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {X_REVIEW.map((r, i) => (
                    <div key={i} className="bg-gradient-to-br from-pink-900/20 to-transparent border border-pink-400/30 rounded-3xl p-8 hover:border-pink-500/50 transition-colors">
                      <div className="text-pink-400 mb-6 text-3xl font-bold">{r.period}</div>
                      <h3 className="font-semibold text-xl mb-3">{r.title}</h3>
                      <p className="text-pink-200 text-sm leading-relaxed">{r.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-16 text-center bg-white/5 border border-dashed border-pink-400/50 rounded-3xl p-12 max-w-2xl mx-auto">
                  <p className="text-2xl italic text-pink-200 font-serif">
                    「这不是一堂课，<br />这是一群姐妹一起在 Web3 里找到自己的力量。」
                  </p>
                  <p className="text-xs text-pink-400 mt-8">—— @HerstoryWeb3 运营团队</p>
                </div>
              </div>

              {/* X Posts Gallery */}
              <div className="space-y-8">
                <div className="section-header">
                  <h2 className="text-4xl font-bold">姐妹们的 Build in Public 成果</h2>
                  <p className="text-pink-300 mt-2">精选 3 月 X 推文 · 每一天的成长都值得被记录</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {X_POSTS.map((post) => (
                    <motion.div
                      key={post.id}
                      whileHover={{ y: -4 }}
                      className="bg-white/5 border border-pink-400/30 rounded-3xl p-6 hover:shadow-2xl hover:shadow-pink-500/10 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.user.avatar} 
                            alt={post.user.name} 
                            className="w-10 h-10 rounded-2xl border border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-medium text-sm">{post.user.handle}</div>
                            <div className="text-[10px] text-pink-300">{post.date}</div>
                          </div>
                        </div>
                        <a href={post.url} target="_blank" className="text-pink-400 hover:text-pink-500">
                          <Twitter className="w-5 h-5" />
                        </a>
                      </div>
                      <p className="text-sm leading-relaxed mb-6 text-slate-200 whitespace-pre-wrap">
                        {post.content}
                      </p>
                      <div className="flex gap-4 text-xs text-pink-300">
                        <div className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.stats.likes}</div>
                        <div className="flex items-center gap-1"><Repeat2 className="w-3 h-3" /> {post.stats.retweets}</div>
                        <div className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.stats.views}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <a 
                    href="https://x.com/search?q=%40HerstoryWeb3%20solidity%20since%3A2026-03-01%20until%3A2026-04-01" 
                    target="_blank" 
                    className="text-pink-300 text-sm underline hover:text-pink-400 transition-colors"
                  >
                    在 X 上查看更多姐妹的共学记录
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">毕业留言板</h2>
                <p className="text-pink-300">每一段心得，都是最珍贵的留念</p>
              </div>

              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {stats.allMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="break-inside-avoid bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative group hover:border-pink-500/50 transition-all"
                  >
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-800 group-hover:text-pink-900/30 transition-colors" />
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={msg.user.avatar_url} 
                        alt={msg.user.login} 
                        className="w-8 h-8 rounded-full border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-slate-200">{msg.user.login}</p>
                        <p className="text-[10px] text-slate-500">{new Date(msg.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{msg.text}"
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-900 py-12 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-slate-500 text-sm">本网站为 @HerstoryWeb3 运营团队开发的结营纪念页</p>
          <p className="text-slate-600 text-xs">
            © 2026 0xherstory Solidity Camp Graduation. Made with ❤️ for every sister.
          </p>
        </div>
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
        active ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20" : "text-slate-400 hover:text-pink-300"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/30 border border-pink-400/20 p-8 rounded-3xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-white/10">
          {icon}
        </div>
        <p className="text-xs text-pink-300 uppercase tracking-wider font-semibold">{label}</p>
      </div>
      <p className="text-5xl font-bold">{value}</p>
    </div>
  );
}

function AwardCard({ icon, title, description, awardText, participant, metricLabel, metricValue }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  awardText: string,
  participant: ParticipantStats | null,
  metricLabel: string,
  metricValue: number | string
}) {
  if (!participant) return null;

  return (
    <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 p-8 rounded-3xl text-center space-y-6 hover:border-pink-500/50 transition-all group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-center relative">{icon}</div>
      <div className="space-y-2 relative">
        <h4 className="text-xl font-bold text-white">{title}</h4>
        <p className="text-xs text-pink-400 font-medium italic">"{awardText}"</p>
        <p className="text-[10px] text-slate-400">{description}</p>
      </div>
      
      <div className="flex flex-col items-center gap-3 py-4 relative">
        <div className="relative">
          <img 
            src={participant.user.avatar_url} 
            alt={participant.user.login} 
            className="w-20 h-20 rounded-full border-4 border-slate-700 group-hover:border-pink-500 transition-all"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-[10px] px-2 py-0.5 rounded-full font-bold text-slate-950 shadow-lg">
            WINNER
          </div>
        </div>
        <p className="font-bold text-lg">{participant.user.login}</p>
      </div>

      <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm relative">
        <span className="text-slate-500">{metricLabel}</span>
        <span className="font-mono text-pink-400 font-bold">{metricValue}</span>
      </div>
    </div>
  );
}
