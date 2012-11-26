var connect4 = function() {};

$(window).load(function() {

var abc = ['a', 'b', 'c', 'd', 'e', 'f'];
var winning = [];
var myTurn = null;
var wins = [0, 0, 0];

// Start new game
connect4.newGame = function() {
	if (!winning.length) {
		winningCombinations();
	}
	clearSlot('all');
	var firstPlayer = Math.floor(Math.random()*2);
	if (firstPlayer === 1) {
		myTurn = 1;
	}
	else {
		myTurn = 0;
		$('.slot').css('cursor', 'auto');
		window.setTimeout(function() {
			computerPlay();
		}, 800);
	}
}

// Calculate array of winning combinations
function winningCombinations() {
	var w = 0;
	function horizontal() {
		for (var i in abc) {
			for (var r = 1; r < 5; r++) {
				winning[w] = [];
				for (var d = 0; d < 4; d++) {
					winning[w].push(abc[i] + (r + d));
				}
				w++;
			}
		}
	}
	function vertical() {
		for (var i = 7; i > 0; i--) {
			for (var r = 6; r !== 3; r--) {
				winning[w] = [];
				for (var d = 4; d > 0; d--) {
					winning[w].push(abc[r - d] + i);
				}
				w++;
			}
		}
	}
	function leftDiagonal() {
		for (var i = 3; i < abc.length; i++) {
			for (var r = 4; r < 8; r++) {
				winning[w] = [];
				for (var d = 0; d < 4; d++) {
					winning[w].push(abc[i - d] + (r - d));
				}
				w++;
			}
		}
	}
	function rightDiagonal() {
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
	horizontal();
	vertical();
	leftDiagonal();
	rightDiagonal();
}

// Check for game win
// 0 for computer, 1 for human
// Can also check for near-wins (wins with 1 disc missing)
// Can also check for distant wins (with 2 discs missing)
// If near-win or distant win mode, will return missing disc location(s)
function checkWin(human, nearWin, distantWin) {
	if (human) {
		var criteria = 'human';
	}
	else {
		var criteria = 'computer';
	}
	for (var i in winning) {
		var m = 0;
		var near = [];
		for (var r in winning[i]) {
			if ($('#' + winning[i][r]).attr('status') === criteria) {
				m++;
			}
			else if ($('#' + winning[i][r]).attr('status') === 'empty') {
				near.push(winning[i][r]);
			}
		}
		if (nearWin && (near.length === 1) && (m === 3)) {
			return near[0];
		}
		else if (distantWin && (near.length === 2) && (m === 2)) {
			return near;
		}
		else if (m === 4) {
			for (var r in winning[i]) {
				$('#' + winning[i][r]).css('border-color', '#FFF'); 
			}
			$('.slot').css('cursor', 'auto');
			return true;
		}
	}
	// Detect tie
	var tie = 1;
	$('.slot').each(function(index) {
		if ($(this).attr('status') === 'empty') {
			tie = 0;
		}
	});
	if (tie) {
		resetGame(2);
	}
	return false;
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
			free.push(i);
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
	if (human) {
		if (checkWin(1, 0)) {
			console.log('COMPUTER: LOSE');
			resetGame(human);
		}
		else {
			window.setTimeout(function() {
				computerPlay();
			}, 800);
		}
	}
	else {
		if (checkWin(0, 0)) {
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
// 2 if tie
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
				}, 1000);
				window.setTimeout(function() {
					$('#wins').fadeOut(function() {
						connect4.newGame();
						$('#board').fadeIn();
					});
				}, 2500);
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
		dropDisc(column, 1);
	}
});

function computerPlay() {
	var free = freeColumns();
	var r = free[Math.floor(Math.random()*free.length)];
	var badMove = null;
	if ((nearWin = checkWin(0, 1, 0)) && (testDrop(nearWin[1]) === nearWin)) {
		console.log('COMPUTER: PLAYING WINNING MOVE AT ' + nearWin.toUpperCase());
		dropDisc(nearWin[1], 0);
		return true;
	}
	if (nearWin = checkWin(1, 1)) {
		if (testDrop(nearWin[1]) === nearWin) {
			console.log('COMPUTER: BLOCKING NEAR WIN AT ' + nearWin.toUpperCase());
			dropDisc(nearWin[1], 0);
			return true;
		}
		else if (testDrop(nearWin[1]) === (abc[abc.indexOf(nearWin[0]) + 1] + nearWin[1])) {
			badMove = abc[abc.indexOf(nearWin[0]) + 1] + nearWin[1];
			console.log('COMPUTER: AVERTING BAD MOVE AT ' + badMove.toUpperCase());
			if (r === badMove[1]) {
				if (free.length > 1) {
					free.splice(abc.indexOf(r), 1);
					r = free[Math.floor(Math.random()*free.length)];
				}
				else {
					console.log('COMPUTER: BAD MOVE POTENTIALLY INEVITABLE AT ' + badMove.toUpperCase());
				}
			}
		}
	}
	if (distantWin = checkWin(0, 0, 1)) {
		if ((testDrop(distantWin[0][1]) === distantWin[0]) && (distantWin[0] !== badMove)) {
			var move = distantWin[0];
		}
		else if ((testDrop(distantWin[1][1]) === distantWin[1]) && (distantWin[1] !== badMove)) {
			var move = distantWin[1];
		}
		if (typeof(move) !== 'undefined') {
			console.log('COMPUTER: PLAYING OPTIMISTIC MOVE AT ' + move.toUpperCase());
			dropDisc(move[1], 0);
			return true;
		}
	}
	if (distantWin = checkWin(1, 0, 1)) {
		if ((testDrop(distantWin[0][1]) === distantWin[0]) && (distantWin[0] !== badMove)) {
			var move = distantWin[0];
		}
		else if ((testDrop(distantWin[1][1]) === distantWin[1]) && (distantWin[1] !== badMove)) {
			var move = distantWin[1];
		}
		if (typeof(move) !== 'undefined') {
			console.log('COMPUTER: PLAYING DEFENSIVE MOVE AT ' + move.toUpperCase());
			dropDisc(move[1], 0);
			return true;
		}
	}
	console.log('COMPUTER: PLAYING ARBITRARY MOVE AT ' + testDrop(r).toUpperCase());
	dropDisc(r, 0);
	return true;
}

connect4.newGame();
	
});