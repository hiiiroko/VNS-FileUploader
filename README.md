# VNS-FileUploader

VNS-FileUploader 是一个基于 Electron 和 React 的跨平台文件上传应用程序。它提供了一个直观的用户界面，用于将文件从本地设备上传到指定的服务器。

要使用该应用程序，请在仓库 Releases 中下载您操作系统的分发压缩包。

如果您感觉这个项目有意思，希望可以给我一个 Star ⭐！

## 功能特性

- 拖放文件上传
- 实时上传进度显示
- 已上传文件列表管理
- 文件删除和下载功能
- 服务器连接状态监控
- 响应式设计，适配不同设备

## 技术栈

- 前端：React, Vite, Tailwind CSS
- 后端：Express.js
- 桌面应用：Electron
- 其他库：Axios, React Hot Toast, Winston, Helmet

## 项目结构

项目分为客户端（client）和服务器（server）两部分：

```
VNS-FileUploader
├─ .gitignore
├─ .prettierrc
├─ README.md
├─ client
│  ├─ .env.development
│  ├─ assets
│  │  ├─ FU.icns
│  │  └─ FU.ico
│  ├─ electron
│  │  ├─ main.js
│  │  └─ preload.js
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ ControlPanel.jsx
│  │  │  ├─ FileList.jsx
│  │  │  └─ UploadArea.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ services
│  │  │  └─ api.js
│  │  └─ utils
│  │     └─ fileHelpers.js
│  ├─ tailwind.config.js
│  ├─ vite.config.js
│  └─ yarn.lock
├─ electron-builder.yml
├─ package.json
├─ restructure.sh
├─ server
│  ├─ index.js
│  ├─ package.json
│  ├─ utils
│  │  └─ logger.js
│  └─ yarn.lock
└─ yarn.lock

```

## ToDevs: 开发环境设置

1. 克隆仓库：
   ```
   git clone https://github.com/your-username/VNS-FileUploader.git
   cd VNS-FileUploader
   ```

2. 安装依赖：
   ```
   corepack enable
   yarn install-all
   ```

3. 启动服务器与客户端：
   ```
   # 浏览器预览
   yarn start
   # 或者 Electron 窗口预览
   yarn start-electron
   ```

## 贡献

欢迎提交 Pull Requests。对于重大更改，请先开 Issue 讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)

## 致谢

PIXIU75 && 乳酸菌。
