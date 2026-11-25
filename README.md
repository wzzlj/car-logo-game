# 🚗 小小车标大冒险（幼儿园儿童识车标 H5 小游戏）

一款专为 **iPhone Safari / 主屏幕 PWA** 打造的幼儿园儿童汽车车标认知与车库养成小游戏，零外部构建依赖，可直接部署到 **GitHub Pages** 并离线畅玩。

## ✨ 核心功能

- **50 个精选车标（国产 32 + 进口 18）**：内置高清矢量车标，支持**新旧车标版本**（如比亚迪、吉利、宝骏、红旗、大众、宝马、别克等）以及**颜色变体**（彩色 / 黑色 / 银色 / 金色）。
- **全程中文语音播报 + 汽车鸣笛音效**：调用 iPhone 原生中文语音朗读（Web Speech API）与 Web Audio 合成音效，小朋友不识字也能独立玩。
- **先学后考 + 6 种趣味玩法**：
  1. 听名字选车标
  2. 看真车选车标 / 看车标找真车
  3. 颜色侦探（找出正确颜色的车标）
  4. 车标翻牌配对
  5. 车标四宫格拼图
  6. Boss 关限时快答
  - 内置**错题重复出现**机制，答错的车标会在后续关卡中自动回访巩固。
- **我的车库养成系统**：闯关赚取星星与车币，解锁 9 款梦幻爱车、4 套车库主题和 6 种趣味摆件，点击爱车还会鸣笛说话。
- **家长控制中心（算术家长锁）**：
  - **吃饭模式**：可设置每答 2~5 题自动触发 30~120 秒干饭倒计时休息。
  - **护眼提醒 & 每日时长上限**：保护儿童视力。
  - **学习报告**：已掌握车标数、常错车标、今日游玩时长。
  - **多孩独立档案**：家里多个小朋友分开保存进度。
  - **跨手机进度导出/导入**：支持一键生成**存档迁移码 + 可扫码二维码**，轻松在另一台手机恢复进度。

## 🚀 部署到 GitHub Pages

1. 在 GitHub 上新建一个公开仓库（例如 `car-logo-game`）。
2. 在本目录初始化并推送代码：
   ```bash
   git init
   git add .
   git commit -m "feat: 初始化小小车标大冒险"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/car-logo-game.git
   git push -u origin main
   ```
3. 打开 GitHub 仓库的 **Settings → Pages → Build and deployment**，将 **Source** 选择为 **GitHub Actions**（仓库内已预置 `.github/workflows/deploy.yml`）。
4. 等待约 1 分钟部署完成，用 iPhone Safari 打开 `https://<你的用户名>.github.io/car-logo-game/`，点击底部分享图标 → **添加到主屏幕**，即可全屏离线游玩！

## 📸 可选：补充 Wikimedia Commons 真车照片

游戏默认内置了 50 款对应品牌的矢量实车图，开箱即用。如果你想把展示图替换为真实道路汽车照片，可以在联网环境下运行：

```bash
python3 scripts/fetch_wikimedia_assets.py
```

脚本会自动从 Wikimedia Commons（公开 CC 授权）下载压缩后的真车图到 `assets/cars/<brand_id>.jpg`，并生成 `assets/cars/ATTRIBUTION.md` 来源说明文件。

## 📄 版权声明

本项目仅用于个人家庭非商业儿童启蒙教育。内置矢量图形为教学简化绘制，各品牌名称与注册商标归原汽车厂商所有。
