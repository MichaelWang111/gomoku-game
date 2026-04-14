/**
 * Gomoku Game - Express 服务器
 * 托管前端静态文件和提供游戏服务
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 3000;

// 托管静态文件
const publicPath = resolve(__dirname, '../../public');
console.log('Public path:', publicPath);
app.use(express.static(publicPath));

// 路由：返回首页
app.get('/', (req, res) => {
    res.sendFile(resolve(publicPath, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`五子棋游戏服务已启动: http://localhost:${PORT}`);
});