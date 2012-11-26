var connect4 = function() {};

$(window).load(function() {

var abc = ['a', 'b', 'c', 'd', 'e', 'f'];
var myTurn = 1;

// Start new game
connect4.newGame = function() {
	$('.slot').attr('status', 'empty');
}

// Return empty slots in a column
function emptyCells(column) {
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
function disc(slot, human) {
	if (human) {
		var playerColor = '#F0314C'
		$('#' + slot).attr('status', 'human');
	}
	else {
		var playerColor = '#4091F4';
		$('#' + slot).attr('status', 'computer');
	}
	$('#' + slot).css('background', playerColor);
	$('#' + slot).css('border-color', playerColor);
}

// Clear slot
function clearSlot(slot) {
	$('#' + slot).attr('status', 'empty');
	$('#' + slot).css('background', '');
	$('#' + slot).css('border-color', '#F0314C');
}

// If slot is clicked
$('.slot').click(function() {
	var row = $(this).attr('id')[0];
	var column = $(this).attr('id')[1];
	if (myTurn) {
		// myTurn = 0;
		var empty = emptyCells(column);
		var i = 0;
		var dropDisc = window.setInterval(function() {
			console.log(i);
			if (i > 0) {
				clearSlot(empty[i - 1]);
			}
			disc(empty[i], 1);
			i++;
			if (i === empty.length) {
				window.clearInterval(dropDisc);
			}
		}, 100);
	}
});

connect4.newGame();
	
});