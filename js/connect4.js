var connect4 = function() {};

$(window).load(function() {

var abc = ['a', 'b', 'c', 'd', 'e', 'f'];
var myTurn = 1;

// Start new game
connect4.newGame = function() {
	clearSlot('all');
}

// Return empty slots in a column
function emptySlots(column) {
	var empty = [];
	for (var i in abc) {
		if ($('#' + abc[i] + column).attr('status') === 'empty') {
			empty.push(abc[i] + column);
		}
	}
	return empty;
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
			if (human) {
				window.setTimeout(function() {
					computerPlay();
				}, 800);
			}
			else {
				myTurn = 1;
			}
		}
	}, 60);
}

// If slot is clicked
$('.slot').click(function() {
	var row = $(this).attr('id')[0];
	var column = $(this).attr('id')[1];
	if (myTurn && ($(this).attr('status') === 'empty')) {
		myTurn = 0;
		dropDisc(column, 1);
	}
});

function computerPlay() {
	/* 
	Computer Strategy
		1. Check if human is in danger of winning. If yes, block winning move.
		2. Check if I can win. If yes, play winning move.
		3. Check if it's possible to build to a winning move. If yes, play accordingly.
		4. Place disc randomly.
	*/
	dropDisc((Math.ceil(Math.random()*7)), 0);
}

connect4.newGame();
	
});