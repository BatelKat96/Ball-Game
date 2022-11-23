'use strict'

// creat board
function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

// render board
function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


// copy mat
function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}


// find neighber
function countNegs(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            // if (mat[i][j] === BALL || mat[i][j] === BALL) negsCount++
            if (mat[i][j]) negsCount++
        }
    }
    return negsCount
}

// get rand num from arry
function drawNum(array) {
    var idx = getRandomInt(0, array.length)
    var num = array[idx]
    array.splice(idx, 1)
    return num
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


// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    // console.log('location:', location)

    const cellSelector = '.' + getClassName(location) // .cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass //// cell-i-j
}



// get random color
function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}


// Getting a random integer between two values
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//Getting a random integer between two values, inclusive
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// printPrimaryDiagonal(gMat)   
// if (pos.i === pos.j) {
function printPrimaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][d]
        console.log(item)
    }
}

// printSecondaryDiagonal(gMat)
// if (pos.i + pos.j === gBoard.length - 1) 
function printSecondaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][squareMat.length - d - 1]
        console.log(item)
    }
}


/// shuffle
function drawNum() {
    return gNums.pop()
}

function shuffle(items) {
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);

        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}
