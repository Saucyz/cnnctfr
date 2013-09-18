// CNNCTFR - Central Neural Network Computer That Forms Rows
// Nadim Kobeissi, 2013

var cnnctfr = function() {}
$(window).load(function() {

// -----------------------------------------------
// INTERNAL VARIABLES & INITIALIZATION
// -----------------------------------------------

var humanTurn = false
var winningCombinations = []
var abc = ['a', 'b', 'c', 'd', 'e', 'f']
var boardMatrix = {}
var playerColors = {
	human: '#F0314C',
	computer: '#4091F4'
}
var wins = {
	human: 0,
	computer: 0,
	draw: 0
}

// Initialize board UI
function initBoardUI() {
	$('#board').html('')
	for (var c in abc) {
		$('#board').append('<tr></tr>')
		for (var r = 1; r < 8; r++) {
			$('#board tr').last()
				.append('<td></td>')
			$('#board td').last()
				.addClass('slot')
				.attr('id', abc[c] + r)
		}
	}
	$('.slot').click(function() {
		var row = $(this).attr('id')[0]
		var column = $(this).attr('id')[1]
		if (humanTurn && !boardMatrix[row + column]) {
			humanTurn = false
			console.log('HUMAN: PLAYING MOVE AT ' + testDrop(column).toUpperCase())
			dropDisc(column, 'human')
		}
	})
}

// Initialize board matrix
function initBoardMatrix() {
	boardMatrix = {
		'a1': null, 'b1': null, 'c1': null, 'd1': null, 'e1': null, 'f1': null,
		'a2': null, 'b2': null, 'c2': null, 'd2': null, 'e2': null, 'f2': null,
		'a3': null, 'b3': null, 'c3': null, 'd3': null, 'e3': null, 'f3': null,
		'a4': null, 'b4': null, 'c4': null, 'd4': null, 'e4': null, 'f4': null,
		'a5': null, 'b5': null, 'c5': null, 'd5': null, 'e5': null, 'f5': null,
		'a6': null, 'b6': null, 'c6': null, 'd6': null, 'e6': null, 'f6': null,
		'a7': null, 'b7': null, 'c7': null, 'd7': null, 'e7': null, 'f7': null
	}
}

// Initialize array of winning combinations
function initWinningCombinations() {
	winningCombinations = []
	var w = 0
	for (var i in abc) {
		for (var r = 1; r < 5; r++) {
			winningCombinations[w] = []
			for (var d = 0; d < 4; d++) {
				winningCombinations[w].push(abc[i] + (r + d))
			}
			w++
		}
	}
	for (var i = 7; i > 0; i--) {
		for (var r = 6; r !== 3; r--) {
			winningCombinations[w] = []
			for (var d = 4; d > 0; d--) {
				winningCombinations[w].push(abc[r - d] + i)
			}
			w++
		}
	}
	for (var i = 3; i < abc.length; i++) {
		for (var r = 4; r < 8; r++) {
			winningCombinations[w] = []
			for (var d = 0; d < 4; d++) {
				winningCombinations[w].push(abc[i - d] + (r - d))
			}
			w++
		}
	}
	for (var i = 3; i < abc.length; i++) {
		for (var r = 4; r > 0; r--) {
			winningCombinations[w] = []
			for (var d = 0; d < 4; d++) {
				winningCombinations[w].push(abc[i - d] + (r + d))
			}
			w++
		}
	}
}

// -----------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------

// Randomly shuffle an array
function shuffle(array) {
	var tmp, current, top = array.length
	if (top) while (--top) {
		current = Math.floor(Math.random() * (top + 1))
		tmp = array[current]
		array[current] = array[top]
		array[top] = tmp
	}
}

// Clean an array from false/null/0 values
function cleanArray(array) {
	var newArray = new Array()
	for (var i = 0; i < array.length; i++) {
		if (array[i]) {
			newArray.push(array[i])
		}
	}
	return newArray
}

// -----------------------------------------------
// BOARD & GAME LOGIC
// -----------------------------------------------

// Start new game
cnnctfr.newGame = function() {
	initBoardMatrix()
	clearSlot('all')
	if (Math.floor(Math.random()*2)) {
		humanTurn = true
	}
	else {
		humanTurn = false
		var analysis = {
			'computer': analyzeBoard('computer'),
			'human': analyzeBoard('human')
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
function emptySlots(column) {
	var empty = []
	for (var i in abc) {
		if (!boardMatrix[abc[i] + column]) {
			empty.push(abc[i] + column)
		}
	}
	if (!empty.length) {
		return false
	}
	return empty
}

// Return columns with free slots
function freeColumns() {
	var free = []
	for (var i = 1; i < 8; i++) {
		if (emptySlots(i)) {
			free.push(i)
		}
	}
	return free
}

// Insert disc into `slot`.
// `player` can be 'human' or 'computer'
function insertDisc(slot, player) {
	boardMatrix[slot] = player
	$('#' + slot).stop()
	$('#' + slot).css('background', playerColors[player])
	$('#' + slot).css('border-color', playerColors[player])
}

// Find which slots are empty in an array of slots.
function findEmptySlots(slots) {
	var empty = []
	for (var i in slots) {
		if (!boardMatrix[slots[i]]) {
			empty.push(slots[i])
		}
	}
	return empty
}

// Clear slot
// 'all' to clear all slots
function clearSlot(slot) {
	if (slot === 'all') {
		initBoardMatrix()
		slot = '.slot'
	}
	else {
		boardMatrix[slot] = null
		slot = '#' + slot
	}
	$(slot).css('background', '')
	$(slot).css('border-color', '#F0314C')
}

// See which slot a disc will end up at if dropped in `column`
function testDrop(column) {
	if (empty = emptySlots(column)) {
		return empty[empty.length - 1]
	}
	return false
}

// Drop a disc with animation through `column`
// `player` can be 'human' or 'computer'
// `phrase` is what the computer will comment on this move
function dropDisc(column, player, phrase) {
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
	}, 53);	
}

// Move the game along after a disc is dropped
// `player` is the upcoming player
// `player` can be 'human' or 'computer'
function nextMove(player) {
	var analysis = {
		'computer': analyzeBoard('computer'),
		'human': analyzeBoard('human')
	}
	var draw = true
	for (var i in boardMatrix) {
		if (boardMatrix[i]) {
			draw = false
		}
	}
	if (draw) {
		resetGame(draw)
		return false
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
			}, 100)
		}
	}
	else if (player === 'computer') {
		if (analysis['computer']['four'].length) {
			winner = 'computer'
			console.log('COMPUTER: WIN')
			resetGame(player)
		}
		else {
			humanTurn = true
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
}

// Reset game, increase scoreboard
// `winner` can be 'human', 'computer' or 'draw'.
function resetGame(winner) {
	window.setTimeout(function() {
		$('#board').fadeOut(function() {
			$('.computer').text(wins[0])
			$('.human').text(wins[1])
			$('#wins').fadeIn(function() {
				if (winner === 'human') {
					talk.say('losing')
				}
				else if (winner === 'draw') {
					talk.say('draw')
				}
				else if (!wins[1] && Math.floor(Math.random()*2)) {
					talk.say('undefeated')
				}
				window.setTimeout(function() {
					wins[winner]++
					$('.computer').text(wins['computer'])
					$('.human').text(wins['human'])
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
function analyzeBoard(player) {
	var result = {
		four: [],
		three: [],
		two: [],
		one: [],
		under: [],
	}
	shuffle(winningCombinations)
	for (var i in winningCombinations) {
		var match = 0
		for (var r in winningCombinations[i]) {
			if (boardMatrix[winningCombinations[i][r]] === player) {
				match++
			}
			else if (boardMatrix[winningCombinations[i][r]]) {
				match = 0
				break
			}
		}
		switch (match) {
			case 4:
				result['four'].push(winningCombinations[i])
				break;
			case 3:
				result['three'].push(winningCombinations[i])
				var empty = findEmptySlots(winningCombinations[i])
				if (empty.length && empty[0][0] !== 'f') {
					var under = abc[abc.indexOf(empty[0][0]) + 1] + empty[0][1]
					if (!boardMatrix[under]) {
						result['under'].push(under)
					}
				}
				break;
			case 2:
				result['two'].push(winningCombinations[i])
				break;
			case 1:
				result['one'].push(winningCombinations[i])
				break;
		}
	}
	return result
}

// Analyze a bunch of combinations, determine empty squares,
// Remove duplicate squares, and arrange from most to least repeated
function scoreMoves(combinations) {
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
			dropDisc(empty[0][1], 'computer', mode)
			return true
		}
	}
	return false
}

computerPlay.strategic = function(analysis) {
	var moves = scoreMoves(analysis['computer']['two'])
	var hMoves = scoreMoves(analysis['human']['two'])
	for (var a in hMoves) {
		if (moves[a]) {
			moves[a] += hMoves[a]
		}
		else {
			moves[a] = hMoves[a]
		}
	}
	for (var c = 20; c > 0; c--) {
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
				console.log('COMPUTER: STRATEGIC MOVE AT ' + highest['square'].toUpperCase())
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
			free[badMove] = null
			free = cleanArray(free)
			badMove = free.indexOf(parseInt(analysis['computer']['under'][i][1]))
		}
	}
	for (var i in analysis['computer']['under']) {
		badMove = free.indexOf(parseInt(analysis['computer']['under'][i][1]))
		while ((free.length > 1) && (badMove >= 0)) {
			free[badMove] = null
			free = cleanArray(free)
			badMove = free.indexOf(parseInt(analysis['computer']['under'][i][1]))
		}
	}
	if ((free.indexOf(4) >= 0) && (testDrop(4) === 'f4')) {
		column = 4
	}
	else {
		column = free[Math.floor(Math.random() * free.length)]
	}
	console.log('COMPUTER: PLAYING AT ' + testDrop(column).toUpperCase())
	dropDisc(column, 'computer')
	return true
}


// -----------------------------------------------
// INITIALIZE AND START PROGRAM
// -----------------------------------------------

initBoardUI()
initWinningCombinations()
cnnctfr.newGame()

})