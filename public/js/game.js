/**
 * Gomoku Game - 游戏逻辑模块
 * 处理五子棋的游戏状态和胜负判定
 */

// 游戏常量配置
const BOARD_SIZE = 15;  // 棋盘大小 15x15
const WIN_COUNT = 5;     // 获胜所需连子数

// 星位位置 (天元和星)
const STAR_POINTS = [
    [3, 3], [3, 7], [3, 11],
    [7, 3], [7, 7], [7, 11],
    [11, 3], [11, 7], [11, 11]
];

// 游戏状态
let currentPlayer = 'black';  // 当前玩家
let gameOver = false;        // 游戏是否结束
let board = [];              // 棋盘数据

// DOM 元素引用
let boardEl = null;
let resultEl = null;
let resultTextEl = null;
let player1El = null;
let player2El = null;
let restartBtn = null;
let playAgainBtn = null;

/**
 * 初始化游戏模块
 * @param {Object} elements - DOM 元素对象
 */
function initGame(elements) {
    // 保存 DOM 元素引用
    ({ boardEl, resultEl, resultTextEl, player1El, player2El, restartBtn, playAgainBtn } = elements);

    // 绑定按钮事件
    restartBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', resetGame);

    // 初始化棋盘
    initBoard();
}

/**
 * 初始化棋盘
 * 创建15x15的棋盘网格并绑定点击事件
 */
function initBoard() {
    // 清空棋盘数组
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

    // 清空棋盘DOM
    boardEl.innerHTML = '';

    // 生成棋格
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            // 创建棋格元素
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;

            // 检查是否为星位
            if (STAR_POINTS.some(([r, c]) => r === i && c === j)) {
                cell.classList.add('star-point');
            }

            // 绑定点击事件
            cell.addEventListener('click', () => handleClick(i, j));

            boardEl.appendChild(cell);
        }
    }
}

/**
 * 处理点击事件
 * @param {number} row - 行索引
 * @param {number} col - 列索引
 */
function handleClick(row, col) {
    // 游戏结束或位置已有棋子则忽略
    if (gameOver || board[row][col]) return;

    // 更新棋盘数据
    board[row][col] = currentPlayer;

    // 渲染棋子
    renderStone(row, col);

    // 检查胜利
    if (checkWin(row, col)) {
        endGame(currentPlayer);
        return;
    }

    // 切换玩家
    switchPlayer();
}

/**
 * 渲染棋子
 * @param {number} row - 行索引
 * @param {number} col - 列索引
 */
function renderStone(row, col) {
    // 计算棋子在棋格中的位置
    const index = row * BOARD_SIZE + col;
    const cell = boardEl.children[index];

    // 创建棋子元素
    const stone = document.createElement('div');
    stone.className = `stone ${currentPlayer}`;

    cell.appendChild(stone);
    cell.classList.add('occupied');
}

/**
 * 切换玩家
 */
function switchPlayer() {
    // 切换当前玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';

    // 更新界面显示
    player1El.classList.toggle('active', currentPlayer === 'black');
    player2El.classList.toggle('active', currentPlayer === 'white');
}

/**
 * 检查胜利
 * @param {number} row - 最后一步的行索引
 * @param {number} col - 最后一步的列索引
 * @returns {boolean} 是否获胜
 */
function checkWin(row, col) {
    // 四个方向：水平、垂直、左斜、右斜
    const directions = [
        { deltaRow: 0, deltaCol: 1 },   // 水平
        { deltaRow: 1, deltaCol: 0 },  // 垂直
        { deltaRow: 1, deltaCol: 1 },  // 左斜
        { deltaRow: 1, deltaCol: -1 }  // 右斜
    ];

    // 遍历每个方向检查
    for (const { deltaRow, deltaCol } of directions) {
        // 检查是否有WIN_COUNT个连续棋子
        if (countConsecutive(row, col, deltaRow, deltaCol) >= WIN_COUNT) {
            // 高亮获胜连线
            highlightWinner(row, col, deltaRow, deltaCol);
            return true;
        }
    }

    return false;
}

/**
 * 统计连续棋子数量
 * @param {number} row - 起始行
 * @param {number} col - 起始列
 * @param {number} deltaRow - 行方向增量
 * @param {number} deltaCol - 列方向增量
 * @returns {number} 连续棋子数量
 */
function countConsecutive(row, col, deltaRow, deltaCol) {
    const player = board[row][col];
    let count = 1;

    // 正向检查
    let { row: r, col: c } = { row: row + deltaRow, col: col + deltaCol };
    while (isValidPosition(r, c) && board[r][c] === player) {
        count++;
        r += deltaRow;
        c += deltaCol;
    }

    // 反向检查
    r = row - deltaRow;
    c = col - deltaCol;
    while (isValidPosition(r, c) && board[r][c] === player) {
        count++;
        r -= deltaRow;
        c -= deltaCol;
    }

    return count;
}

/**
 * 检查位置是否在棋盘内
 * @param {number} row - 行索引
 * @param {number} col - 列索引
 * @returns {boolean} 是否有效
 */
function isValidPosition(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

/**
 * 高亮获胜连线
 * @param {number} row - 起始行
 * @param {number} col - 起始列
 * @param {number} deltaRow - 行方向增量
 * @param {number} deltaCol - 列方向增量
 */
function highlightWinner(row, col, deltaRow, deltaCol) {
    const player = board[row][col];

    // 正向标记
    let { row: r, col: c } = { row, col };
    while (isValidPosition(r, c) && board[r][c] === player) {
        const index = r * BOARD_SIZE + c;
        boardEl.children[index].classList.add('winner');
        r += deltaRow;
        c += deltaCol;
    }

    // 反向标记
    r = row - deltaRow;
    c = col - deltaCol;
    while (isValidPosition(r, c) && board[r][c] === player) {
        const index = r * BOARD_SIZE + c;
        boardEl.children[index].classList.add('winner');
        r -= deltaRow;
        c -= deltaCol;
    }
}

/**
 * 结束游戏
 * @param {string} winner - 获胜方
 */
function endGame(winner) {
    gameOver = true;

    // 显示结果
    const winnerText = winner === 'black' ? '黑棋' : '白棋';
    resultTextEl.textContent = `${winnerText}获胜！`;
    resultEl.classList.add('show');
}

/**
 * 重置游戏
 */
function resetGame() {
    // 重置游戏状态
    currentPlayer = 'black';
    gameOver = false;

    // 重置界面显示
    player1El.classList.add('active');
    player2El.classList.remove('active');

    // 隐藏结果弹窗
    resultEl.classList.remove('show');

    // 重新初始化棋盘
    initBoard();
}

// 导出模块
export { initGame };