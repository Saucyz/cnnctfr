// CNNCTFR - Central Neural Network Computer That Forms Rows
// Nadim Kobeissi, 2013 - 2014
// Revision 5

var cnnctfr = {}
$(window).load(function() {

// -----------------------------------------------
// INTERNAL VARIABLES & INITIALIZATION
// -----------------------------------------------

cnnctfr.humanTurn = false

cnnctfr.playerColors = {
	human:    '#F0314C',
	computer: '#4091F4'
}

cnnctfr.wins = {
	human:    0,
	computer: 0,
	draw:     0
}

var row = [
	'a', 'b',
	'c', 'd',
	'e', 'f',
	'g'
]

var col = [
	1, 2, 3, 4,
	5, 6, 7, 8
]

var winningCombinations = (function() {
	var wc = []
	// —
	for (var r in row) {
		for (var c = 0; c < col.length - 3; c++) {
			wc.push([
				row[r] + col[c + 0],
				row[r] + col[c + 1],
				row[r] + col[c + 2],
				row[r] + col[c + 3]
			])
		}
	}
	// |
	for (var c in col) {
		for (var r = 0; r < row.length - 3; r++) {
			wc.push([
				row[r + 0] + col[c],
				row[r + 1] + col[c],
				row[r + 2] + col[c],
				row[r + 3] + col[c]
			])
		}
	}
	// \
	for (var r = 0; r < row.length - 3; r++) {
		for (var c = 0; c < col.length - 3; c++) {
			wc.push([
				row[r + 0] + col[c + 0],
				row[r + 1] + col[c + 1],
				row[r + 2] + col[c + 2],
				row[r + 3] + col[c + 3]
			])
		}
	}
	// /
	for (var r = 3; r < row.length; r++) {
		for (var c = 0; c < col.length - 3; c++) {
			wc.push([
				row[r - 0] + col[c + 0],
				row[r - 1] + col[c + 1],
				row[r - 2] + col[c + 2],
				row[r - 3] + col[c + 3]
			])
		}
	}
	return wc
})()

// Initialize board matrix
cnnctfr.blankBoardMatrix = function() {
	return {
		a1: null, b1: null, c1: null, d1: null, e1: null, f1: null, g1: null,
		a2: null, b2: null, c2: null, d2: null, e2: null, f2: null, g2: null,
		a3: null, b3: null, c3: null, d3: null, e3: null, f3: null, g3: null,
		a4: null, b4: null, c4: null, d4: null, e4: null, f4: null, g4: null,
		a5: null, b5: null, c5: null, d5: null, e5: null, f5: null, g5: null,
		a6: null, b6: null, c6: null, d6: null, e6: null, f6: null, g6: null,
		a7: null, b7: null, c7: null, d7: null, e7: null, f7: null, g7: null,
		a8: null, b8: null, c8: null, d8: null, e8: null, f8: null, g8: null
	}
}

// -----------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------

// Randomly shuffle an array
var shuffle = function(array) {
	var result = array.slice(0)
	var tmp, current, top = result.length
	if (top) while (--top) {
		current = Math.floor(Math.random() * (top + 1))
		tmp = result[current]
		result[current] = result[top]
		result[top] = tmp
	}
	return result
}

// -----------------------------------------------
// BOARD & GAME LOGIC
// -----------------------------------------------

// Start new game
cnnctfr.newGame = function() {
	cnnctfr.boardMatrix = cnnctfr.blankBoardMatrix()
	clearSlot()
	if (Math.floor(Math.random()*2)) {
		cnnctfr.humanTurn = true
	}
	else {
		cnnctfr.humanTurn = false
		var analysis = {
			'computer': analyzeBoard('computer'),
			'human':    analyzeBoard('human')
		}
		window.setTimeout(function() {
			computerPlay(analysis)
		}, 700)
	}
	window.setTimeout(function() {
		talk.say('start')
	}, 300)
}

// Return empty slots in a column
var emptySlots = function(column) {
	var empty = []
	for (var r in row) {
		if (!cnnctfr.boardMatrix[row[r] + column]) {
			empty.push(row[r] + column)
		}
	}
	if (!empty.length) {
		return false
	}
	return empty
}

// Return columns with free slots
var freeColumns = function() {
	var free = []
	for (var c in col) {
		if (emptySlots(col[c])) {
			free.push(col[c])
		}
	}
	return free
}

// Insert disc into `slot`.
// `player` can be 'human' or 'computer'
var insertDisc = function(slot, player) {
	cnnctfr.boardMatrix[slot] = player
	$('#' + slot).stop().css({
		'background':   cnnctfr.playerColors[player],
		'border-color': cnnctfr.playerColors[player]
	})
}

// Find which slots are empty in an array of slots.
var findEmptySlots = function(slots) {
	var empty = []
	for (var i in slots) {
		if (!cnnctfr.boardMatrix[slots[i]]) {
			empty.push(slots[i])
		}
	}
	return empty
}

// Clear slot
// If no slot is specified, clears all slots.
var clearSlot = function(slot) {
	if (slot) {
		cnnctfr.boardMatrix[slot] = null
		slot = '#' + slot
	}
	else {
		cnnctfr.boardMatrix = cnnctfr.blankBoardMatrix()
		slot = '.slot'
	}
	$(slot).css({
		'background':   '',
		'border-color': '#F0314C'
	})
}

// See which slot a disc will end up at if dropped in `column`
var testDrop = function(column) {
	if (empty = emptySlots(column)) {
		return empty[empty.length - 1]
	}
	return false
}

// Drop a disc with animation through `column`
// `player` can be 'human' or 'computer'
// `phrase` is what the computer will comment on this move
var dropDisc = function(column, player, phrase) {
	var empty = emptySlots(column)
	var i = 0
	var drop = window.setInterval(function() {
		if (i > 0) {
			clearSlot(empty[i - 1])
		}
		insertDisc(empty[i], player)
		i++
		if (i === empty.length) {
			window.clearInterval(drop)
			if (phrase) { talk.say(phrase) }
			nextMove(player)
		}
	}, 53)
}

// Move the game along after a disc is dropped
// `player` is the upcoming player
// `player` can be 'human' or 'computer'
var nextMove = function(player) {
	var analysis = {
		'computer': analyzeBoard('computer'),
		'human': analyzeBoard('human')
	}
	var draw = true
	for (var i in cnnctfr.boardMatrix) {
		if (!cnnctfr.boardMatrix[i]) {
			draw = false
		}
	}
	var winner = null
	if (player === 'human') {
		if (analysis['human']['four'].length) {
			winner = 'human'
			console.log('COMPUTER: LOSE')
			resetGame(player)
		}
		else {
			window.setTimeout(function() {
				computerPlay(analysis)
			}, 300 + Math.round(Math.random() * 300))
		}
	}
	else if (player === 'computer') {
		if (analysis['computer']['four'].length) {
			winner = 'computer'
			console.log('COMPUTER: WIN')
			resetGame(player)
		}
		else {
			cnnctfr.humanTurn = true
		}
	}
	if (winner) {
		for (var i in analysis[winner]['four']) {
			for (var r in analysis[winner]['four'][i]) {
				$('#' + analysis[winner]['four'][i][r])
					.css('border-color', '#FFF')
			}
		}
	}
	else if (draw) {
		resetGame(draw)
		return false
	}
}

// Reset game, increase scoreboard
// `winner` can be 'human', 'computer' or 'draw'.
var resetGame = function(winner) {
	window.setTimeout(function() {
		$('#board').fadeOut(function() {
			$('.computer').text(cnnctfr.wins.computer)
			$('.human').text(cnnctfr.wins.human)
			$('#wins').fadeIn(function() {
				if (winner === 'computer') {
					talk.say('win')
				}
				else if (winner === 'human') {
					talk.say('lose')
				}
				else if (winner === 'draw') {
					talk.say('draw')
				}
				else if (!cnnctfr.wins.human && Math.floor(Math.random()*2)) {
					talk.say('undefeated')
				}
				window.setTimeout(function() {
					cnnctfr.wins[winner]++
					$('.computer').text(cnnctfr.wins.computer)
					$('.human').text(cnnctfr.wins.human)
				}, 600)
				window.setTimeout(function() {
					$('#wins').fadeOut(function() {
						cnnctfr.newGame()
						$('#board').fadeIn()
					})
				}, 3400)
			})
		})
	}, 2500)
}

// -----------------------------------------------
// BOARD ANALYSIS, THREAT AND MOVE DETECTION
// -----------------------------------------------

// Analyze board looking for winning combinations
// `player` must be 'human' or 'computer'
// Returns an object containing the arrays:
// four: Winning combination for `player`, if any,
// three: With 1 disc missing if any,
// two: With 2 discs missing, if any,
// one: With 3 discs missing, if any,
// under: Squares (if any) where if opponent put a piece, `player` could immediately win.
var analyzeBoard = function(player) {
	var result = {
		four:  [],
		three: [],
		two:   [],
		one:   [],
		under: [],
	}
	winningCombinations = shuffle(winningCombinations)
	for (var i in winningCombinations) {
		var match = 0
		for (var r in winningCombinations[i]) {
			if (cnnctfr.boardMatrix[winningCombinations[i][r]] === player) {
				match++
			}
			else if (cnnctfr.boardMatrix[winningCombinations[i][r]]) {
				match = 0
				break
			}
		}
		switch (match) {
			case 4:
				result['four'].push(winningCombinations[i])
				break
			case 3:
				result['three'].push(winningCombinations[i])
				var empty = findEmptySlots(winningCombinations[i])
				if (empty.length && empty[0][0] !== row[row.length - 1]) {
					var under = row[row.indexOf(empty[0][0]) + 1] + empty[0][1]
					if (!cnnctfr.boardMatrix[under]) {
						result['under'].push(under)
					}
				}
				break
			case 2:
				result['two'].push(winningCombinations[i])
				break
			case 1:
				result['one'].push(winningCombinations[i])
				break
		}
	}
	return result
}

// Analyze a bunch of combinations, determine empty squares,
// Remove duplicate squares, and arrange from most to least repeated
var scoreMoves = function(combinations) {
	var score = {}
	for (var i in combinations) {
		var empty = findEmptySlots(combinations[i])
		for (var r in empty) {
			if (!score[empty[r]]) {
				score[empty[r]] = 1
			}
			else {
				score[empty[r]]++
			}
		}
	}
	return score
}

// -----------------------------------------------
// COMPUTER AI
// -----------------------------------------------

// Computer AI
// Needs analysis object as input in order to work:
// analysis = {
// 	'computer': analyzeBoard('computer'),
// 	'human': analyzeBoard('human')
// }
var computerPlay = function(analysis) {
	if (
		computerPlay.definite(analysis, 'win')    ||
		computerPlay.definite(analysis, 'block')  ||
		computerPlay.strategic(analysis)          ||
		computerPlay.general(analysis)
	) { return }
}

computerPlay.definite = function(analysis, mode) {
	if (mode === 'win') {
		var three = analysis['computer']['three']
	}
	if (mode === 'block') {
		var three = analysis['human']['three']
	}
	for (var i in three) {
		var empty = findEmptySlots(three[i])
		if (empty.length && testDrop(empty[0][1]) === empty[0]) {
			console.log('COMPUTER: '
				+ mode.toUpperCase()
				+ ' AT ' + empty[0].toUpperCase())
			if (mode === 'block') {
				dropDisc(empty[0][1], 'computer', 'block')
			}
			else {
				dropDisc(empty[0][1], 'computer')
			}
			return true
		}
	}
	return false
}

computerPlay.strategic = function(analysis) {
	var moves  = scoreMoves(analysis['computer']['two'])
	var hMoves = scoreMoves(analysis['human']['two'])
	for (var a in hMoves) {
		if (moves[a]) {
			moves[a] += hMoves[a]
		}
		else {
			moves[a]  = hMoves[a]
		}
	}
	for (var c = 50; c > 0; c--) {
		if (!Object.keys(moves).length) {
			return false
		}
		var highest = {
			square: null,
			score: 0
		}
		for (var i in moves) {
			if (moves[i] > highest['score']) {
				highest['square'] = i
				highest['score'] = moves[i]
			}
		}
		if ((testDrop(highest['square'][1]) === highest['square'])
			&& (analysis['human']['under'].indexOf(highest['square']) < 0)
			&& (analysis['computer']['under'].indexOf(highest['square']) < 0)) {
				console.log('COMPUTER: STRATEGIC MOVE AT '
					+ highest['square'].toUpperCase())
				dropDisc(highest['square'][1], 'computer')
				return true
		}
		else {
			delete moves[highest['square']]
		}
	}
	return false
}

computerPlay.general = function(analysis) {
	var column
	var badMove
	var free = freeColumns()
	for (var i in analysis['human']['under']) {
		badMove = free.indexOf(parseInt(analysis['human']['under'][i][1]))
		while ((free.length > 1) && (badMove >= 0)) {
			free.splice(badMove, 1)
			badMove = free.indexOf(parseInt(analysis['human']['under'][i][1]))
		}
	}
	for (var i in analysis['computer']['under']) {
		badMove = free.indexOf(parseInt(analysis['computer']['under'][i][1]))
		while ((free.length > 1) && (badMove >= 0)) {
			free.splice(badMove, 1)
			badMove = free.indexOf(parseInt(analysis['computer']['under'][i][1]))
		}
	}
	var preferred = [
		shuffle([4, 5]),
		shuffle([3, 6]),
		shuffle([2, 7]),
		shuffle([1, 8])
	]
	for (var i in preferred) {
		if (column) { break }
		for (var o in preferred[i]) {
			if (free.indexOf(preferred[i][o]) >= 0) {
				column = preferred[i][o]
				break
			}
		}
	}
	console.log(analysis['human']['under'])
	console.log('COMPUTER: PLAYING AT ' + testDrop(column).toUpperCase())
	dropDisc(column, 'computer')
	return true
}


// -----------------------------------------------
// INITIALIZE AND START PROGRAM
// -----------------------------------------------

// Initialize board UI
cnnctfr.boardMatrix = cnnctfr.blankBoardMatrix()

$('#board').html('')
for (var r in row) {
	$('#board').append('<tr></tr>')
	for (var c in col) {
		$('#board tr').last()
			.append('<td></td>')
		$('#board td').last()
			.addClass('slot')
			.attr('id', row[r] + col[c])
	}
}
$('.slot').on('click touchend', function() {
	var row    = $(this).attr('id')[0]
	var column = $(this).attr('id')[1]
	if (cnnctfr.humanTurn && !cnnctfr.boardMatrix[row + column]) {
		cnnctfr.humanTurn = false
		console.log('HUMAN: PLAYING MOVE AT ' + testDrop(column).toUpperCase())
		dropDisc(column, 'human')
	}
})

// Start new game
cnnctfr.newGame()

})