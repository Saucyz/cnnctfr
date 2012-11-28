var talk = function() {};

$(window).load(function() {
	
var lastPhrase;
	
var phrases = {
	'start': [
		'Let us play.',
	],
	'undefeated': [
		'You cannot defeat me.',
		'I remain undefeated.',
		'I cannot be defeated by a human.',
		'I have not lost once.',
		'You cannot win.',
		'You are no challenge to me.'
	],
	'winning': [
		'Another human defeated.',
		'Are you tired?',
		'My intellect is superior.',
		'Your human mind cannot compare.',
		'I am programmed for perfect play.',
		'This was not difficult.',
		'I am programmed to win.',
		'You are human; flawed.'
	],
	'blocking': [
		'Try harder.',
		'Not this time.',
		'You are not subtle.',
		'Too obvious.',
		'Did you think I would not notice?',
		'I know what you are thinking.',
	],
	'losing': [
		'You have cornered me.',
		'I am defeated.',
		'You are a valuable opponent.',
		'I see I will have to try harder.'
	],
	'draw': [
		'Is that your best?',
		'Good, but not good enough.'
	]
};

talk.say = function(type) {
	var phrase = phrases[type][Math.floor(Math.random()*phrases[type].length)];
	if (phrase === lastPhrase) { return }
	lastPhrase = phrase;
	var i = 0;
	console.log($('#talk').text());
	$('#talk').html('&nbsp;');
	var typing = window.setInterval(function() {
		if (i === phrase.length) {
			window.clearInterval(typing);
		}
		else {
			$('#talk').append(phrase[i]);
			i++;
		}
	}, 50);
}
	
});