# 0xherstory Solidity 共学营 · 结营庆典

这是一个为 **0xherstory Solidity 共学营** 打造的结营纪念页面。它记录了姐妹们在 2026 年 3 月期间的学习历程、代码提交情况以及在 X (Twitter) 上的精彩瞬间。

## 🌟 核心功能

- **🎓 毕业合影 (Photo Tab)**：展示所有参与者的头像，见证集体的力量。
- **📊 共学看板 (Stats Tab)**：通过 GitHub API 实时获取 PR 数据，展示提交总数、合并情况及活跃度排行榜。
- **🐦 Build in Public (Gallery Tab)**：汇总 X 平台上的共学数据，包括推文总数、曝光量及姐妹们的互动小故事。
- **💬 姐妹留言板 (Messages Tab)**：精选共学期间的感悟与心得，留下最珍贵的文字记忆。
- **🎉 抛帽庆祝**：点击按钮触发全屏彩带特效，共同庆祝顺利结营！

## 🛠️ 技术栈

- **前端框架**：React 19 + Vite
- **样式处理**：Tailwind CSS 4.0
- **动画效果**：Motion (motion/react)
- **数据可视化**：Recharts
- **交互特效**：Canvas Confetti
- **图标库**：Lucide React
- **数据来源**：GitHub API (支持 Personal Access Token 扩展访问限制)

## 🚀 快速开始

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **启动开发服务器**：
   ```bash
   npm run dev
   ```

3. **设置 GitHub Token** (可选)：
   在页面右上角点击“设置 GitHub Token”，输入你的 Classic Token，以获取更完整的 PR 统计数据。

## 📁 项目结构

- `src/App.tsx`: 主页面逻辑与 UI。
- `src/services/githubService.ts`: 处理 GitHub PR 数据的抓取与加工。
- `src/constants/xPosts.ts`: 存储 X 平台的统计数据与回顾内容。
- `src/types.ts`: 全局类型定义。

## ❤️ 致谢

感谢每一位参与共学的姐妹，是你们的热爱与坚持，让这段旅程变得意义非凡。

---
*Made with ❤️ by @HerstoryWeb3 运营团队*
