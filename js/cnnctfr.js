var cnnctfr = function() {};

$(window).load(function() {

var abc = ['a', 'b', 'c', 'd', 'e', 'f'];
var winning = [];
var myTurn = null;
var wins = [0, 0, 0];
var badMoves = [];

// Start new game
cnnctfr.newGame = function() {
	if (!winning.length) {
		winningCombinations();
	}
	badMoves = [];
	clearSlot('all');
	var firstPlayer = Math.floor(Math.random()*2);
	// var firstPlayer = 1;
	if (firstPlayer === 1) {
		myTurn = 1;
	}
	else {
		myTurn = 0;
		$('.slot').css('cursor', 'auto');
		var analysis = {
			'computer': analyzeBoard('computer'),
			'human': analyzeBoard('human')
		};
		window.setTimeout(function() {
			computerPlay(analysis);
		}, 700);
	}
}

// Calculate array of winning combinations
function winningCombinations() {
	var w = 0;
	for (var i in abc) {
		for (var r = 1; r < 5; r++) {
			winning[w] = [];
			for (var d = 0; d < 4; d++) {
				winning[w].push(abc[i] + (r + d));
			}
			w++;
		}
	}
	for (var i = 7; i > 0; i--) {
		for (var r = 6; r !== 3; r--) {
			winning[w] = [];
			for (var d = 4; d > 0; d--) {
				winning[w].push(abc[r - d] + i);
			}
			w++;
		}
	}
	for (var i = 3; i < abc.length; i++) {
		for (var r = 4; r < 8; r++) {
			winning[w] = [];
			for (var d = 0; d < 4; d++) {
				winning[w].push(abc[i - d] + (r - d));
			}
			w++;
		}
	}
	for (var i = 3; i < abc.length; i++) {
		for (var r = 4; r > 0; r--) {
			winning[w] = [];
			for (var d = 0; d < 4; d++) {
				winning[w].push(abc[i - d] + (r + d));
			}
			w++;
		}
	}
}

// Randomly shuffle array
function shuffle(array) {
	var tmp, current, top = array.length;
	if(top) while(--top) {
		current = Math.floor(Math.random() * (top + 1));
		tmp = array[current];
		array[current] = array[top];
		array[top] = tmp;
	}
	return array;
}

// Return empty slots in a column
function emptySlots(column) {
	var empty = [];
	for (var i in abc) {
		if ($('#' + abc[i] + column).attr('status') === 'empty') {
			empty.push(abc[i] + column);
		}
	}
	if (empty.length === 0) {
		return false;
	}
	return empty;
}

// Return columns with free slots
function freeColumns() {
	var free = [];
	for (var i = 1; i < 8; i++) {
		if (emptySlots(i)) {
			free.push(i.toString());
		}
	}
	return free;
}

// Insert disc into slot.
// 0 if computer, 1 if human
function insertDisc(slot, human) {
	if (human) {
		var playerColor = '#F0314C'
		$('#' + slot).attr('status', 'human');
	}
	else {
		var playerColor = '#4091F4';
		$('#' + slot).attr('status', 'computer');
	}
	$('#' + slot).css('cursor', 'auto');
	$('#' + slot).css('background', playerColor);
	$('#' + slot).css('border-color', playerColor);
}

// Clear slot
// 'all' to clear all slots
function clearSlot(slot) {
	if (slot === 'all') {
		slot = '.slot';
	}
	else {
		slot = '#' + slot;
	}
	$(slot).attr('status', 'empty');
	$(slot).css('cursor', 'pointer');
	$(slot).css('background', '');
	$(slot).css('border-color', '#F0314C');
}

// See which slot a disc will end up at if dropped in column
function testDrop(column) {
	if (empty = emptySlots(column)) {
		return empty[empty.length - 1];
	}
	return false;
}

// Drop a disc with animation through column
// 0 if computer, 1 if human
function dropDisc(column, human) {
	var empty = emptySlots(column);
	var i = 0;
	var drop = window.setInterval(function() {
		if (i > 0) {
			clearSlot(empty[i - 1]);
		}
		insertDisc(empty[i], human);
		i++;
		if (i === empty.length) {
			window.clearInterval(drop);
			nextMove(human);
		}
	}, 60);
}

// Move the game along after a disc is dropped
// 0 for computer, 1 for human
function nextMove(human) {
	var analysis = {
		'computer': analyzeBoard('computer'),
		'human': analyzeBoard('human')
	};
	if (human) {
		if (analysis['human']['win'].length) {
			console.log('COMPUTER: LOSE');
			resetGame(human);
		}
		else {
			window.setTimeout(function() {
				computerPlay(analysis);
			}, 700);
		}
	}
	else {
		if (analysis['computer']['win'].length) {
			console.log('COMPUTER: WIN');
			resetGame(human);
		}
		else {
			myTurn = 1;
			$('.slot').each(function(index) {
				if ($(this).attr('status') === 'empty') {
					$(this).css('cursor', 'pointer');
				}
			});
		}
	}
}

// Reset game, increase scoreboard
// 0 is computer winner, 1 if human winner
// 2 if draw
function resetGame(winner) {
	window.setTimeout(function() {
		$('#board').fadeOut(function() {
			$('.computer').text(wins[0]);
			$('.human').text(wins[1]);
			$('#wins').fadeIn(function() {
				window.setTimeout(function() {
					wins[winner]++;
					$('.computer').text(wins[0]);
					$('.human').text(wins[1]);
				}, 800);
				window.setTimeout(function() {
					$('#wins').fadeOut(function() {
						cnnctfr.newGame();
						$('#board').fadeIn();
					});
				}, 2300);
			});
		});
	}, 2500);
}

// If slot is clicked
$('.slot').click(function() {
	var row = $(this).attr('id')[0];
	var column = $(this).attr('id')[1];
	if (myTurn && ($(this).attr('status') === 'empty')) {
		myTurn = 0;
		$('.slot').css('cursor', 'auto');
		console.log('HUMAN: PLAYING MOVE AT ' + testDrop(column).toUpperCase());
		dropDisc(column, 1);
	}
});

// Analyze board looking for winning combinations
// Criteria must be 'human' or 'computer'
// By default, just handles wins and draws
// Also returns an object containing:
// win: Winning combination, if any
// nearWins: With 1 disc missing if any
// possibleWins: With 2 discs missing, if any
// distantWins: With 3 discs missing, if any
// Missing disc location(s) arranged from more to less critical
function analyzeBoard(criteria) {
	var win = [];
	var nearWins = [];
	var possibleWins = [];
	var distantWins = [];
	for (var i in winning) {
		var m = 0;
		var near = [];
		for (var r in winning[i]) {
			if ($('#' + winning[i][r]).attr('status') === criteria) {
				m++;
				if ($('#' + winning[i][r - 1]).attr('status') === 'empty') {
					if (near.indexOf(winning[i][r - 1]) > -1) {
						near.splice(near.indexOf(winning[i][r - 1]), 1);
					}
					near.unshift(winning[i][r - 1]);
				}
				if ($('#' + winning[i][r + 1]).attr('status') === 'empty') {
					if (near.indexOf(winning[i][r + 1]) > -1) {
						near.splice(near.indexOf(winning[i][r + 1]), 1);
					}
					near.unshift(winning[i][r + 1]);
				}
			}
			if (near.indexOf(winning[i][r]) < 0) {
				if ($('#' + winning[i][r]).attr('status') === 'empty') {
					near.push(winning[i][r]);
				}
			}
		}
		if (m === 4) {
			for (var r in winning[i]) {
				$('#' + winning[i][r]).css('border-color', '#FFF');
				win.push(winning[i][r]);
			}
			$('.slot').css('cursor', 'auto');
		}
		else if ((m === 3) && (near.length === 1)) {
			nearWins.push(near[0]);
		}
		else if ((m === 2) && (near.length === 2)) {
			possibleWins.push(near);
		}
		else if ((m === 1) && (near.length === 3)) {
			distantWins.push(near);
		}
	}
	// Detect draw
	var draw = 1;
	$('.slot').each(function(index) {
		if ($(this).attr('status') === 'empty') {
			draw = 0;
		}
	});
	if (draw) {
		resetGame(2);
	}
	return {
		'win': win, 
		'nearWins': nearWins, 
		'possibleWins': possibleWins, 
		'distantWins': distantWins
	};
}

// Computer AI
// Needs analysis object as input in order to work:
// analysis = {
// 	'computer': analyzeBoard('computer'),
// 	'human': analyzeBoard('human')
// };
function computerPlay(analysis) {
	console.log(analysis);
	if (nearWin = analysis['computer']['nearWins']) {
		shuffle(nearWin);
		for (var i in nearWin) {
			if (testDrop(nearWin[i][1]) === nearWin[i]) {
				console.log('COMPUTER: PLAYING WINNING MOVE AT ' + nearWin[i].toUpperCase());
				dropDisc(nearWin[i][1], 0);
				return true;
			}
		}
	}
	if (nearWin = analysis['human']['nearWins']) {
		shuffle(nearWin);
		for (var i in nearWin) {
			var p = abc[abc.indexOf(nearWin[i][0]) + 1] + nearWin[i][1];
			if (testDrop(nearWin[i][1]) === p) {
				if (badMoves.indexOf(p) < 0) {
					console.log('COMPUTER: DISASTROUS MOVE DETECTED AT ' + p.toUpperCase());
					badMoves.push(p);
				}
			}
			if (testDrop(nearWin[i][1]) === nearWin[i]) {
				console.log('COMPUTER: PLAYING BLOCKING MOVE AT ' + nearWin[i].toUpperCase());
				dropDisc(nearWin[i][1], 0);
				return true;
			}
		}
	}
	if (possibleWin = analysis['computer']['possibleWins']) {
		shuffle(possibleWin);
		for (var i in possibleWin) {
			for (var r in possibleWin[i]) {
				if ((testDrop(possibleWin[i][r][1]) === possibleWin[i][r])
				&& (badMoves.indexOf(possibleWin[i][r]) < 0)) {
					console.log('COMPUTER: PLAYING OFFENSIVE MOVE AT ' + possibleWin[i][r].toUpperCase());
					dropDisc(possibleWin[i][r][1], 0);
					return true;
				}
			}
		}
	}
	if (possibleWin = analysis['human']['possibleWins']) {
		shuffle(possibleWin);
		for (var i in possibleWin) {
			for (var r in possibleWin[i]) {
				if ((testDrop(possibleWin[i][r][1]) === possibleWin[i][r])
				&& (badMoves.indexOf(possibleWin[i][r]) < 0)) {
					console.log('COMPUTER: PLAYING DEFENSIVE MOVE AT ' + possibleWin[i][r].toUpperCase());
					dropDisc(possibleWin[i][r][1], 0);
					return true;
				}
			}
		}
	}
	if (distantWin = analysis['computer']['distantWins']) {
		shuffle(distantWin);
		for (var i in distantWin) {
			for (var r in distantWin[i]) {
				if ((testDrop(distantWin[i][r][1]) === distantWin[i][r])
				&& (badMoves.indexOf(distantWin[i][r]) < 0)) {
					console.log('COMPUTER: PLAYING DISTANTLY RELEVANT MOVE AT ' + distantWin[i][r].toUpperCase());
					dropDisc(distantWin[i][r][1], 0);
					return true;
				}
			}
		}
	}
	var free = freeColumns();
	for (var i in badMoves) {
		if ((free.indexOf(badMoves[i][1]) > -1) && (free.length > 1)) {
			free.splice(free.indexOf(badMoves[i][1]), 1);
		}
	}
	if ((free.indexOf('1') > -1) && (free.length > 1)) {
		free.splice(free.indexOf('1'), 1);
	}
	if ((free.indexOf('7') > -1) && (free.length > 1)) {
		free.splice(free.indexOf('7'), 1);
	}
	r = free[Math.floor(Math.random()*free.length)];
	console.log('COMPUTER: PLAYING RANDOM MOVE AT ' + testDrop(r).toUpperCase());
	dropDisc(r, 0);
	return true;
}

cnnctfr.newGame();
	
});