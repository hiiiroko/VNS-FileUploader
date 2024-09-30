# VNS-FileUploader

VNS-FileUploader 是一个基于 Electron 和 React 的跨平台文件上传应用程序。它提供了一个直观的用户界面，用于将文件从本地设备上传到指定的服务器。

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
├─ client
│  ├─ electron
│  │  ├─ main.js
│  │  └─ preload.js
│  └─ src
│     ├─ components
│     ├─ services
│     └─ utils
└─ server
   ├─ routes
   └─ utils
```

## 开发环境设置

1. 克隆仓库：
   ```
   git clone https://github.com/your-username/VNS-FileUploader.git
   cd VNS-FileUploader
   ```

2. 安装依赖：
   ```
   yarn install-all
   ```

3. 启动开发服务器：
   ```
   # 浏览器预览
   yarn start
   # Electron 窗口预览
   yarn start-server
   ```

## 构建和分发

要创建可分发的应用程序，请按照以下步骤操作：

1. 构建客户端：
   ```
   cd client
   yarn build
   ```

2. 构建 Electron 应用：
   ```
   yarn electron:build
   ```

3. 构建服务器：
   ```
   cd ../server
   yarn build
   ```

4. 创建分发包：
   - 复制 `dist/win-unpacked`（Windows）或 `dist/mac`（macOS）文件夹中的内容到一个新文件夹，例如 `VNS-FileUploader-Distribution`
   - 将构建好的服务器可执行文件复制到 `VNS-FileUploader-Distribution` 文件夹
   - 创建一个 `config.json` 文件，包含必要的配置信息：
     ```json
     {
       "PORT": 3000,
       "UPLOAD_DIR": "./uploads"
     }
     ```
   - 创建一个启动脚本 `start.bat`（Windows）或 `start.sh`（macOS/Linux）：

     Windows (`start.bat`):
     ```batch
     start "" "file-upload-server.exe"
     timeout /t 5
     start "" "File Upload App.exe"
     ```

     macOS/Linux (`start.sh`):
     ```bash
     #!/bin/bash
     ./file-upload-server &
     sleep 5
     open "File Upload App.app"
     ```

5. 将 `VNS-FileUploader-Distribution` 文件夹打包成 zip 文件进行分发。

## 使用说明

1. 解压下载的 zip 文件
2. 运行 `start.bat`（Windows）或 `start.sh`（macOS/Linux）
3. 应用程序将自动启动，您可以开始上传文件了

## 贡献

欢迎提交 Pull Requests。对于重大更改，请先开 issue 讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)

## 致谢

PIXIU75 && 乳酸菌。

## 界面效果

<img width="1336" alt="开发预览效果图-1" src="https://github.com/user-attachments/assets/2c8b2d8e-027b-4c0d-bd04-dd7bf3e579cf">
<img width="1332" alt="开发预览效果图-2" src="https://github.com/user-attachments/assets/92bb6c03-5847-488e-863d-0eb7964f4f7c">
<img width="1332" alt="客户端效果图-1" src="https://github.com/user-attachments/assets/e54fd0a9-d02e-43d8-acad-a900c53b9352">
