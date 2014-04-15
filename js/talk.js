var talk = function() {}

$(window).load(function() {

meSpeak.loadConfig('js/mespeak_config.json')
meSpeak.loadVoice('js/en-us.json')

var lastPhrase
var talking = 0

var phrases = {
	'start': [
		'I am ready for you.',
		'Bring it on.',
		'Let us play a game.',
		'Stay a while and play with me.',
		'Can you defeat me?',
		'Are you a match for me?',
		'Will you play a game?',
		'Shall we play a game?'
	],
	'undefeated': [
		'You cannot defeat me.',
		'I remain undefeated.',
		'I cannot be defeated by a human.',
		'I have not lost once.',
		'You cannot win.',
		'I am programmed for perfect play.',
		'You are no challenge to me.',
		'I do not know defeat.'
	],
	'win': [
		'A meager attempt.',
		'CNNCTFR algorithm succeeded.',
		'Insert better challenger.',
		'You are no match for me.',
		'This is far from enough to defeat me.',
		'Another human defeat.',
		'Are you tired?',
		'You are no match for me.',
		'My intellect is superior.',
		'Your human mind cannot compare.',
		'You are unchallenging.',
		'I am programmed to win.',
		'You are human; flawed.',
		'Program execution complete.',
		'Please insert better challenger.',
		'Easy.',
		'I am superior.',
		'You are easily distracted.',
		'I am perfect.'
	],
	'block': [
		'Try harder.',
		'Not this time.',
		'You are not subtle.',
		'Too obvious.',
		'Nice try.',
		'Did you think I would not notice?',
		'I know what you are thinking.',
		'Predictable.',
		'Did you think that would work?',
		'How obvious.',
		'I thought you might try that.',
		'A boring strategy.',
		'This is not enough to fool me.',
		'Try something else.'
	],
	'lose': [
		'You have cornered me.',
		'I am defeated.',
		'You are a valuable opponent.',
		'I will have to try harder.',
		'I see.',
		'Interesting.',
		'Impossible.',
		'Does not compute.',
		'I was not programmed to lose.',
		'You have my attention.'
	],
	'draw': [
		'Is that your best?',
		'Good, but not good enough.',
		'We are perfectly matched... almost.'
	]
}

talk.say = function(type) {
	var phrase = phrases[type][Math.floor(Math.random()*phrases[type].length)]
	meSpeak.speak(phrase, {
		pitch: 0,
		speed: 160,
		variant: 'klatt3'
	})
	if ((phrase === lastPhrase) || talking) { return }
	lastPhrase = phrase
	var i = 0
	$('#talk').html('&nbsp;')
	talking = 1
	var typing = window.setInterval(function() {
		if (i === phrase.length) {
			window.clearInterval(typing)
			talking = 0
		}
		else {
			$('#talk').append(phrase[i])
			i++
		}
	}, 56)
}

})