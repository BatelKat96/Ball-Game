'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'


const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src="img/glue.png">'

// Model:
var gBoard
var gGamerPos
var gEatBallCount
var gBallOnBoardCount
var gAddBallIntervalId
var gAddGlueInterval
var negNum
var gSetTimeoutId
var gIsItGlue

function onInitGame() {
    clearInterval(gAddBallIntervalId)
    clearInterval(gAddGlueInterval)
    gEatBallCount = 0
    gBallOnBoardCount = 2
    gIsItGlue = false
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gAddBallIntervalId = setInterval(addBall, 4000)
    gAddGlueInterval = setInterval(addGlue, 5000)

    reSetHTML()
}


function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
        }
    }
    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL

    board[0][6].type = FLOOR
    board[9][6].type = FLOOR
    board[5][0].type = FLOOR
    board[5][11].type = FLOOR


    console.log(board)
    return board
}


// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {
    // console.log(i, j)
    if (gIsItGlue) return

    // count Neighbors
    ckeckNegs(i, j, gBoard)

    // Calculate distance to make sure we are moving to a neighbor cell
    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    const isValidDiffMove = (iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)
    const isValidPortalMove = (iAbsDiff === gBoard.length - 1) || (jAbsDiff === gBoard[0].length - 1)
    const isValidMove = (isValidDiffMove || isValidPortalMove)
    if (!isValidMove) return

    if (j === -1) j = gBoard[0].length - 1
    else if (j === gBoard[0].length) j = 0

    if (i === -1) i = gBoard.length - 1
    else if (i === gBoard.length) i = 0


    const targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    if (targetCell.gameElement === GLUE) {
        console.log('You are on glueeee:')
        gIsItGlue = true
        setTimeout(() => gIsItGlue = false, 3000)
    }

    if (targetCell.gameElement === BALL) {
        eatingBall()
    }

    // DONE: Move the gamer

    // REMOVING FROM
    // update Model
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
    // update DOM
    renderCell(gGamerPos, '')

    // ADD TO
    // update Model
    targetCell.gameElement = GAMER
    gGamerPos = { i, j }
    // update DOM
    renderCell(gGamerPos, GAMER_IMG)
}

function eatingBall() {
    playSound()
    var elCounter = document.querySelector('.counter-ball span')
    gEatBallCount++
    gBallOnBoardCount--
    elCounter.innerText = `${gEatBallCount}`
    // console.log('gCountBall:', gCountBall)

    if (isVictory()) {
        onVictory()
        return
    }
}

// Add a ball to random empty cell
function addBall(pos) {
    var emptyCells = getEmptyCells(gBoard)
    var pos = (chooseRandeemptyCell(emptyCells))

    if (!pos) clearInterval(gAddBallIntervalId)
    // console.log('pos:', pos)

    //model
    gBoard[pos.i][pos.j].gameElement = BALL
    //dom
    renderCell(pos, BALL_IMG)

    ckeckNegs(gGamerPos.i, gGamerPos.j, gBoard)
    gBallOnBoardCount++

}

function addGlue() {
    var emptyCells = getEmptyCells(gBoard)
    var pos = (chooseRandeemptyCell(emptyCells))
    if (!pos) clearInterval(gAddGlueInterval)

    // Update model
    gBoard[pos.i][pos.j].gameElement = GLUE

    //update dom
    renderCell(pos, GLUE_IMG)

    setTimeout(() => {
        if (gBoard[pos.i][pos.j].gameElement === GLUE) {
            // UPDATE THE MODEL
            gBoard[pos.i][pos.j].gameElement = null
            // UPDATE THE DOM
            renderCell(pos, '')
        }
    }, 3000)

}

function ckeckNegs(i, j, mat) {

    var negNum = countNegs(i, j, mat)
    var elCounterNegs = document.querySelector('.negs span')
    elCounterNegs.innerText = `${negNum}`
}

function isVictory() {
    // console.log('gCountBall:', gCountBall)
    // console.log('gBallOnBoardCount:', gBallOnBoardCount)
    if (gBallOnBoardCount === 0) {
        // console.log('1:')
        return true
    }
    // console.log('2:')
    return false
}

function onVictory() {
    clearInterval(gAddBallIntervalId)
    clearInterval(gAddGlueInterval)
    // console.log('1:')
    var strHTML = ` <div class="game-over">
    <h1>Congratulations!!</h1>
    <h1> You won!!</h1></div>`
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

    var elRestart = document.querySelector('.restart')
    elRestart.style.display = 'block'
}

function reSetHTML() {
    var elRestart = document.querySelector('.restart')
    elRestart.style.display = 'none'
    var elCounter = document.querySelector('.counter-ball span')
    elCounter.innerText = '_'
}




function countNegs(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].gameElement === BALL) negsCount++
        }
    }
    return negsCount
}

function playSound() {
    const sound = new Audio('/pop.wav')
    // sound.load()
    sound.play()
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    // console.log('location:', location)

    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

// Move the player by keyboard arrows
function onHandleKey(event) {
    const i = gGamerPos.i
    const j = gGamerPos.j
    // console.log('event.key:', event.key)

    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            moveTo(i, j + 1)
            break
        case 'ArrowUp':
            moveTo(i - 1, j)
            break
        case 'ArrowDown':
            moveTo(i + 1, j)
            break
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}


// find random empty cell
function chooseRandeemptyCell(array) {
    var cellIdx = drawNum(array)
    return cellIdx

}

/// find all empty cells
function getEmptyCells(board) {
    // console.log('board:', board)
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            // console.log('currCell:', currCell)
            if (currCell.gameElement !== BALL && currCell.gameElement !== GAMER && currCell.type !== WALL) {
                emptyCells.push({ i: i, j: j })
            }
        }
    }
    return emptyCells
}


