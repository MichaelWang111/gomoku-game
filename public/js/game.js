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

/**
 * DOM元素类型定义
 * @typedef {Object} GameElements
 * @property {HTMLElement} boardEl - 棋盘DOM元素
 * @property {HTMLElement} resultEl - 结果弹窗元素
 * @property {HTMLElement} resultTextEl - 结果文字元素
 * @property {HTMLElement} player1El - 黑棋玩家元素
 * @property {HTMLElement} player2El - 白棋玩家元素
 * @property {HTMLElement} restartBtn - 重新开始按钮
 * @property {HTMLElement} playAgainBtn - 再来一局按钮
 */

/**
 * 玩家类型
 * @typedef {'black'|'white'} Player
 */

/**
 * GomokuGame 类
 * 封装五子棋游戏的所有逻辑
 */
class GomokuGame {
    /** @type {Player} */
    currentPlayer = 'black';
    /** @type {boolean} */
    gameOver = false;
    /** @type {(Player|null)[][]} */
    board = [];

    /** @type {HTMLElement|null} */
    boardEl = null;
    /** @type {HTMLElement|null} */
    resultEl = null;
    /** @type {HTMLElement|null} */
    resultTextEl = null;
    /** @type {HTMLElement|null} */
    player1El = null;
    /** @type {HTMLElement|null} */
    player2El = null;
    /** @type {HTMLElement|null} */
    restartBtn = null;
    /** @type {HTMLElement|null} */
    playAgainBtn = null;

    /**
     * 初始化游戏模块
     * @param {GameElements} elements - DOM 元素对象
     */
    init(elements) {
        // 保存 DOM 元素引用
        this.boardEl = elements.boardEl;
        this.resultEl = elements.resultEl;
        this.resultTextEl = elements.resultTextEl;
        this.player1El = elements.player1El;
        this.player2El = elements.player2El;
        this.restartBtn = elements.restartBtn;
        this.playAgainBtn = elements.playAgainBtn;

        // 绑定按钮事件
        this.restartBtn.addEventListener('click', () => this.reset());
        this.playAgainBtn.addEventListener('click', () => this.reset());

        // 初始化棋盘
        this.initBoard();
    }

    /**
     * 初始化棋盘
     * 创建15x15的棋盘网格并绑定点击事件
     */
    initBoard() {
        // 清空棋盘数组
        this.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

        // 清空棋盘DOM
        this.boardEl.innerHTML = '';

        // 生成棋格
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                // 创建棋格元素
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = String(i);
                cell.dataset.col = String(j);

                // 检查是否为星位
                if (STAR_POINTS.some(([r, c]) => r === i && c === j)) {
                    cell.classList.add('star-point');
                }

                // 绑定点击事件
                cell.addEventListener('click', () => this.handleClick(i, j));

                this.boardEl.appendChild(cell);
            }
        }
    }

    /**
     * 处理点击事件
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     */
    handleClick(row, col) {
        // 游戏结束或位置已有棋子则忽略
        if (this.gameOver || this.board[row][col]) return;

        // 更新棋盘数据
        this.board[row][col] = this.currentPlayer;

        // 渲染棋子
        this.renderStone(row, col);

        // 检查胜利
        if (this.checkWin(row, col)) {
            this.endGame(this.currentPlayer);
            return;
        }

        // 切换玩家
        this.switchPlayer();
    }

    /**
     * 渲染棋子
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     */
    renderStone(row, col) {
        // 计算棋子在棋格中的位置
        const index = row * BOARD_SIZE + col;
        const cell = this.boardEl.children[index];

        // 创建棋子元素
        const stone = document.createElement('div');
        stone.className = `stone ${this.currentPlayer}`;

        cell.appendChild(stone);
        cell.classList.add('occupied');
    }

    /**
     * 切换玩家
     */
    switchPlayer() {
        // 切换当前玩家
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';

        // 更新界面显示
        this.player1El.classList.toggle('active', this.currentPlayer === 'black');
        this.player2El.classList.toggle('active', this.currentPlayer === 'white');
    }

    /**
     * 检查胜利
     * @param {number} row - 最后一步的行索引
     * @param {number} col - 最后一步的列索引
     * @returns {boolean} 是否获胜
     */
    checkWin(row, col) {
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
            if (this.countConsecutive(row, col, deltaRow, deltaCol) >= WIN_COUNT) {
                // 高亮获胜连线
                this.highlightWinner(row, col, deltaRow, deltaCol);
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
    countConsecutive(row, col, deltaRow, deltaCol) {
        const player = this.board[row][col];
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

    /**
     * 检查位置是否在棋盘内
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @returns {boolean} 是否有效
     */
    isValidPosition(row, col) {
        return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    /**
     * 高亮获胜连线
     * @param {number} row - 起始行
     * @param {number} col - 起始列
     * @param {number} deltaRow - 行方向增量
     * @param {number} deltaCol - 列方向增量
     */
    highlightWinner(row, col, deltaRow, deltaCol) {
        const player = this.board[row][col];

        // 正向标记
        let r = row;
        let c = col;
        while (this.isValidPosition(r, c) && this.board[r][c] === player) {
            const index = r * BOARD_SIZE + c;
            this.boardEl.children[index].classList.add('winner');
            r += deltaRow;
            c += deltaCol;
        }

        // 反向标记
        r = row - deltaRow;
        c = col - deltaCol;
        while (this.isValidPosition(r, c) && this.board[r][c] === player) {
            const index = r * BOARD_SIZE + c;
            this.boardEl.children[index].classList.add('winner');
            r -= deltaRow;
            c -= deltaCol;
        }
    }

    /**
     * 结束游戏
     * @param {Player} winner - 获胜方
     */
    endGame(winner) {
        this.gameOver = true;

        // 显示结果
        const winnerText = winner === 'black' ? '黑棋' : '白棋';
        this.resultTextEl.textContent = `${winnerText}获胜！`;
        this.resultEl.classList.add('show');
    }

    /**
     * 重置游戏
     */
    reset() {
        // 重置游戏状态
        this.currentPlayer = 'black';
        this.gameOver = false;

        // 重置界面显示
        this.player1El.classList.add('active');
        this.player2El.classList.remove('active');

        // 隐藏结果弹窗
        this.resultEl.classList.remove('show');

        // 重新初始化棋盘
        this.initBoard();
    }
}

// 导出游戏类
export { GomokuGame };
