/**
 * Gomoku Game - 单元测试
 * 测试核心游戏逻辑
 */

// 游戏常量
const BOARD_SIZE = 15;
const WIN_COUNT = 5;

/**
 * 简易游戏类用于测试(不依赖DOM)
 */
class TestGomokuGame {
    currentPlayer = 'black';
    gameOver = false;
    board = [];

    initBoard() {
        this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    countConsecutive(row, col, deltaRow, deltaCol) {
        const player = this.board[row][col];
        if (!player) return 0;
        let count = 1;

        // 正向检查
        let r = row + deltaRow;
        let c = col + deltaCol;
        while (this.isValidPosition(r, c) && this.board[r][c] === player) {
            count++;
            r += deltaRow;
            c += deltaCol;
        }

        // 反向检查
        r = row - deltaRow;
        c = col - deltaCol;
        while (this.isValidPosition(r, c) && this.board[r][c] === player) {
            count++;
            r -= deltaRow;
            c -= deltaCol;
        }

        return count;
    }

    checkWin(row, col) {
        const directions = [
            { deltaRow: 0, deltaCol: 1 },
            { deltaRow: 1, deltaCol: 0 },
            { deltaRow: 1, deltaCol: 1 },
            { deltaRow: 1, deltaCol: -1 }
        ];

        for (const { deltaRow, deltaCol } of directions) {
            if (this.countConsecutive(row, col, deltaRow, deltaCol) >= WIN_COUNT) {
                return true;
            }
        }
        return false;
    }

    placeStone(row, col, player) {
        if (this.board[row][col]) return false;
        this.board[row][col] = player;
        return true;
    }
}

// 测试用例
const tests = [];

/**
 * 测试棋盘初始化
 */
function testBoardInit() {
    const game = new TestGomokuGame();
    game.initBoard();

    // 验证棋盘大小
    if (game.board.length !== BOARD_SIZE) {
        throw new Error(`棋盘行数应为${BOARD_SIZE}, 实际为${game.board.length}`);
    }
    if (game.board[0].length !== BOARD_SIZE) {
        throw new Error(`棋盘列数应为${BOARD_SIZE}, 实际为${game.board[0].length}`);
    }

    // 验证初始状态
    if (game.currentPlayer !== 'black') {
        throw new Error('初始玩家应为黑棋');
    }
    if (game.gameOver !== false) {
        throw new Error('游戏初始状态应为未结束');
    }

    return true;
}
tests.push({ name: '棋盘初始化', fn: testBoardInit });

/**
 * 测试落子功能
 */
function testPlaceStone() {
    const game = new TestGomokuGame();
    game.initBoard();

    // 测试正常落子
    if (!game.placeStone(7, 7, 'black')) {
        throw new Error('正常落子应成功');
    }
    if (game.board[7][7] !== 'black') {
        throw new Error('落子位置应记录棋子颜色');
    }

    // 测试重复落子
    if (game.placeStone(7, 7, 'white')) {
        throw new Error('重复落子应失败');
    }

    return true;
}
tests.push({ name: '落子功能', fn: testPlaceStone });

/**
 * 测试水平方向胜利检测
 */
function testHorizontalWin() {
    const game = new TestGomokuGame();
    game.initBoard();

    // 放置5子连珠(水平)
    game.placeStone(7, 3, 'black');
    game.placeStone(7, 4, 'black');
    game.placeStone(7, 5, 'black');
    game.placeStone(7, 6, 'black');
    game.placeStone(7, 7, 'black');

    if (!game.checkWin(7, 7)) {
        throw new Error('水平5子连珠应判定为胜利');
    }

    return true;
}
tests.push({ name: '水平胜利检测', fn: testHorizontalWin });

/**
 * 测试垂直方向胜利检测
 */
function testVerticalWin() {
    const game = new TestGomokuGame();
    game.initBoard();

    // 放置5子连珠(垂直)
    game.placeStone(3, 7, 'white');
    game.placeStone(4, 7, 'white');
    game.placeStone(5, 7, 'white');
    game.placeStone(6, 7, 'white');
    game.placeStone(7, 7, 'white');

    if (!game.checkWin(7, 7)) {
        throw new Error('垂直5子连珠应判定为胜利');
    }

    return true;
}
tests.push({ name: '垂直胜利检测', fn: testVerticalWin });

/**
 * 测试左斜方向胜利检测
 */
function testLeftDiagonalWin() {
    const game = new TestGomokuGame();
    game.initBoard();

    // 放置5子连珠(左斜)
    game.placeStone(3, 3, 'black');
    game.placeStone(4, 4, 'black');
    game.placeStone(5, 5, 'black');
    game.placeStone(6, 6, 'black');
    game.placeStone(7, 7, 'black');

    if (!game.checkWin(7, 7)) {
        throw new Error('左斜5子连珠应判定为胜利');
    }

    return true;
}
tests.push({ name: '左斜胜利检测', fn: testLeftDiagonalWin });

/**
 * 测试右斜方向胜利检测
 */
function testRightDiagonalWin() {
    const game = new TestGomokuGame();
    game.initBoard();

    // 放置5子连珠(右斜)
    game.placeStone(3, 11, 'white');
    game.placeStone(4, 10, 'white');
    game.placeStone(5, 9, 'white');
    game.placeStone(6, 8, 'white');
    game.placeStone(7, 7, 'white');

    if (!game.checkWin(7, 7)) {
        throw new Error('右斜5子连珠应判定为胜利');
    }

    return true;
}
tests.push({ name: '右斜胜利检测', fn: testRightDiagonalWin });

/**
 * 测试未获胜情况
 */
function testNoWin() {
    const game = new TestGomokuGame();
    game.initBoard();

    // 放置4子连珠
    game.placeStone(7, 3, 'black');
    game.placeStone(7, 4, 'black');
    game.placeStone(7, 5, 'black');
    game.placeStone(7, 6, 'black');

    if (game.checkWin(7, 6)) {
        throw new Error('4子连珠不应判定为胜利');
    }

    return true;
}
tests.push({ name: '未获胜检测', fn: testNoWin });

/**
 * 测试边界位置胜利
 */
function testEdgeWin() {
    const game = new TestGomokuGame();
    game.initBoard();

    // 在边界放置5子连珠
    game.placeStone(0, 0, 'black');
    game.placeStone(0, 1, 'black');
    game.placeStone(0, 2, 'black');
    game.placeStone(0, 3, 'black');
    game.placeStone(0, 4, 'black');

    if (!game.checkWin(0, 4)) {
        throw new Error('边界5子连珠应判定为胜利');
    }

    return true;
}
tests.push({ name: '边界胜利检测', fn: testEdgeWin });

/**
 * 测试无效位置检测
 */
function testInvalidPosition() {
    const game = new TestGomokuGame();
    game.initBoard();

    if (game.isValidPosition(-1, 0)) {
        throw new Error('负数行索引应无效');
    }
    if (game.isValidPosition(0, 15)) {
        throw new Error('超出棋盘列索引应无效');
    }
    if (!game.isValidPosition(7, 7)) {
        throw new Error('棋盘中间位置应有效');
    }

    return true;
}
tests.push({ name: '位置有效性检测', fn: testInvalidPosition });

// 运行所有测试
console.log('🧪 运行五子棋游戏测试...\n');

let passed = 0;
let failed = 0;

for (const { name, fn } of tests) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (e) {
        console.log(`❌ ${name}: ${e.message}`);
        failed++;
    }
}

console.log(`\n📊 测试结果: ${passed} 通过, ${failed} 失败`);

if (failed > 0) {
    process.exit(1);
}
