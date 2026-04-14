# 五子棋游戏 (Gomoku)

一个基于 Web 的双人五子棋小游戏，支持黑白棋对战。

## 功能特性

- 15x15 标准棋盘
- 双人对战模式
- 自动胜负判定
- 获胜连线高亮显示
- 重新开始功能

## 技术栈

- 前端: HTML, CSS, JavaScript
- 后端: Node.js, Express

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务器
npm start
```

访问 http://localhost:3000 开始游戏。

## 项目结构

```
gomoku-game/
├── public/          # 前端静态资源
│   ├── css/         # 样式文件
│   ├── js/          # 脚本文件
│   └── index.html   # 入口页面
├── src/server/      # 后端服务器
│   └── index.js     # Express 服务器
├── package.json     # 项目配置
└── tsconfig.json    # TypeScript 配置
```

## 许可证

MIT