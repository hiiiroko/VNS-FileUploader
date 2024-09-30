#!/bin/bash

# 确保脚本在项目根目录下执行
if [ ! -f "package.json" ]; then
    echo "请在项目根目录下运行此脚本"
    exit 1
fi

# 创建client和server目录
mkdir -p client server

# 移动客户端相关文件到client目录
mv assets electron index.html src vite.config.js postcss.config.js tailwind.config.js eslint.config.js client/

# 移动服务器相关文件到server目录
mv server/* server/

# 复制package.json到client目录并修改
cp package.json client/
sed -i '' 's/"name": "file-upload-app"/"name": "file-upload-app-client"/' client/package.json
sed -i '' 's/"main": "electron\/main.js"/"main": "electron\/main.js"\n  ,"proxy": "http:\/\/localhost:3000"/' client/package.json

# 创建服务器的package.json
cat > server/package.json << EOL
{
  "name": "file-upload-app-server",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.0",
    "multer": "^1.4.5-lts.1"
  }
}
EOL

# 更新根目录的package.json
cat > package.json << EOL
{
  "name": "file-upload-app",
  "version": "1.0.1",
  "scripts": {
    "install-all": "yarn install && cd client && yarn install && cd ../server && yarn install",
    "start-server": "cd server && yarn start",
    "start-client": "cd client && yarn dev",
    "build-client": "cd client && yarn build",
    "start": "concurrently \"yarn start-server\" \"yarn start-client\""
  },
  "devDependencies": {
    "concurrently": "^9.0.1"
  }
}
EOL

# 创建.env文件
echo "REACT_APP_API_URL=http://localhost:3000" > client/.env

# 更新.gitignore
echo "node_modules" > .gitignore
echo "dist" >> .gitignore
echo ".env" >> .gitignore

echo "项目结构重组完成。请运行 'yarn install-all' 来安装所有依赖。"