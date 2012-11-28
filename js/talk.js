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
		'Another human defeat.',
		'Are you tired?',
		'You seem tired.',
		'My intellect is superior.',
		'Your human mind cannot compare.',
		'I am programmed for perfect play.',
		'You are unchallenging.',
		'I am programmed to win.',
		'You are human; flawed.',
		'Easy.',
		'I am superior.',
		'You are easily distracted.'
	],
	'blocking': [
		'Try harder.',
		'Not this time.',
		'You are not subtle.',
		'Too obvious.',
		'Nice try.',
		'Did you think I would not notice?',
		'I know what you are thinking.',
		'Predictable.'
	],
	'losing': [
		'You have cornered me.',
		'I am defeated.',
		'You are a valuable opponent.',
		'I will have to try harder.',
		'I see.',
		'Interesting.',
		'Impossible.',
		'Does not compute.'
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
	$('#talk').html('&nbsp;');
	var typing = window.setInterval(function() {
		if (i === phrase.length) {
			window.clearInterval(typing);
		}
		else {
			$('#talk').append(phrase[i]);
			i++;
		}
	}, 40);
}
	
});