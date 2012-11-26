var connect4 = function() {};

$(window).load(function() {

var abc = ['a', 'b', 'c', 'd', 'e', 'f'];
var winning = [];
var myTurn = null;

// Start new game
connect4.newGame = function() {
	clearSlot('all');
	var firstPlayer = (Math.floor(Math.random()*2));
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
		
	}
	function rightDiagonal() {
		
	}
	horizontal();
	vertical();
}

// Check for game win
// 0 for computer, 1 for human
// Can also check for near-wins (wins with 1 disc missing)
// If near-win mode, will return missing disc location
function checkWin(human, nearWin) {
	if (human) {
		var criteria = 'human';
	}
	else {
		var criteria = 'computer';
	}
	for (var i in winning) {
		var m = 0;
		var near = 0;
		for (var r in winning[i]) {
			if ($('#' + winning[i][r]).attr('status') === criteria) {
				m++;
			}
			else if ($('#' + winning[i][r]).attr('status') === 'empty') {
				near = winning[i][r];
			}
		}
		if (nearWin && near && (m === 3)) {
			console.log(winning[i]);
			return near;
		}
		if (m === 4) {
			for (var r in winning[i]) {
				$('#' + winning[i][r]).css('border-color', '#FFF'); 
			}
			$('.slot').css('cursor', 'auto');
			return true;
		}
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
	for (var i = 1; i < 7; i++) {
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
		}
		else {
			window.setTimeout(function() {
				computerPlay();
			}, 800);
		}
	}
	else {
		if (checkWin(0, 0)) {
			console.log('COMPUTER: WIN')
		}
		else {
			myTurn = 1;
			$('.slot').css('cursor', 'pointer');
		}
	}
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
	/* 
	Computer Strategy
		1. Check if human is in danger of winning. If yes, block winning move. [DONE]
		2. Check if I can win. If yes, play winning move. [DONE]
		3. Check if it's possible to build to a winning move. If yes, play accordingly. [NOT DONE]
		4. Place disc randomly. [DONE]
	*/
	if (nearWin = checkWin(1, 1)) {
		console.log('COMPUTER: BLOCKING NEAR WIN AT ' + nearWin.toUpperCase());
		dropDisc(nearWin[1], 0);
	}
	else if (nearWin = checkWin(0, 1)) {
		console.log('COMPUTER: PLAYING WINNING MOVE AT ' + nearWin.toUpperCase());
		dropDisc(nearWin[1], 0);
	}
	else {
		var free = freeColumns();
		dropDisc(free[Math.floor(Math.random()*free.length)], 0);
	}
}

winningCombinations();
connect4.newGame();
	
});