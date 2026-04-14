/**
 * Gomoku Game - 自动化功能测试
 * 验证Issue中要求的功能是否实现
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 开始自动化功能测试...\n');
console.log('='.repeat(50));

// 检查文件内容
function checkFile(filePath, pattern) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content.includes(pattern);
    } catch (e) {
        return false;
    }
}

// 检查服务响应
function checkHttp(url, pattern) {
    return new Promise((resolve) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve(data.includes(pattern));
            });
        }).on('error', () => resolve(false));
    });
}

async function runTests() {
    const results = [];
    const basePath = path.join(__dirname, '..', 'public');

    console.log('\n📋 检查Issue要求的功能实现:\n');

    // 1. 检查禁手规则提示
    const ruleTip = checkFile(path.join(basePath, 'index.html'), '无禁手规则');
    results.push({ name: '[高] 禁手规则提示', passed: ruleTip });
    console.log(`${ruleTip ? '✅' : '❌'} 禁手规则提示: ${ruleTip ? '已实现' : '未实现'}`);

    // 2. 检查棋盘格子边框修复
    const gapFix = checkFile(path.join(basePath, 'css/style.css'), 'gap: 0');
    results.push({ name: '[高] 棋盘格子边框', passed: gapFix });
    console.log(`${gapFix ? '✅' : '❌'} 棋盘格子边框: ${gapFix ? '已修复' : '未修复'}`);

    // 3. 检查星位标记
    const starPoints = checkFile(path.join(basePath, 'js/game.js'), 'STAR_POINTS');
    results.push({ name: '[中] 星位标记', passed: starPoints });
    console.log(`${starPoints ? '✅' : '❌'} 星位标记: ${starPoints ? '已实现' : '未实现'}`);

    // 4. 检查格线绘制(棋格边框)
    const gridLines = checkFile(path.join(basePath, 'css/style.css'), 'border: 1px solid');
    results.push({ name: '[中] 格线绘制', passed: gridLines });
    console.log(`${gridLines ? '✅' : '❌'} 格线绘制: ${gridLines ? '已实现' : '未实现'}`);

    // 5. 检查ES模块封装
    const esModule = checkFile(path.join(basePath, 'js/game.js'), 'class GomokuGame');
    results.push({ name: '[低] ES模块封装', passed: esModule });
    console.log(`${esModule ? '✅' : '❌'} ES模块封装: ${esModule ? '已实现' : '未实现'}`);

    // 6. 检查JSDoc类型定义
    const jsdoc = checkFile(path.join(basePath, 'js/game.js'), '@typedef');
    results.push({ name: '[低] JSDoc类型定义', passed: jsdoc });
    console.log(`${jsdoc ? '✅' : '❌'} JSDoc类型定义: ${jsdoc ? '已实现' : '未实现'}`);

    // 7. 检查服务是否正常运行
    console.log('\n🌐 检查服务状态:');
    const serviceOk = await checkHttp('http://localhost:3000', '五子棋');
    results.push({ name: '服务运行', passed: serviceOk });
    console.log(`${serviceOk ? '✅' : '❌'} 服务运行: ${serviceOk ? '正常' : '异常'}`);

    // 8. 检查游戏JS是否可访问
    const jsOk = await checkHttp('http://localhost:3000/js/game.js', 'GomokuGame');
    results.push({ name: '游戏JS加载', passed: jsOk });
    console.log(`${jsOk ? '✅' : '❌'} 游戏JS加载: ${jsOk ? '正常' : '异常'}`);

    // 总结
    console.log('\n' + '='.repeat(50));
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    console.log(`\n📊 测试结果: ${passed}/${total} 通过`);

    if (passed === total) {
        console.log('\n🎉 所有Issue要求的功能均已实现!');
    } else {
        const failed = results.filter(r => !r.passed);
        console.log('\n⚠️ 以下功能未实现:');
        failed.forEach(f => console.log(`  - ${f.name}`));
    }

    return passed === total;
}

runTests().then(success => {
    process.exit(success ? 0 : 1);
});
