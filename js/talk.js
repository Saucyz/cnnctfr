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
		'I am CNNCTFR. You cannot defeat me.',
		'I am CNNCTFR. I will defeat you.',
		'I am CNNCTFR. Your odds of winning are negligible.',
		'Can you connect four?',
		'Let us play a game.',
		'Stay a while and play with me.',
		'Can you defeat me?',
		'Are you a match for me?',
		'Will you play a game?',
		'Accept my challenge.',
		'Is your strategy stronger than mine?',
		'Can you outsmart me?',
		'Time to play.'
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
		'For you, winning is an art. For me, a science.',
		'Insert better challenger.',
		'You are no match for me.',
		'This is far from enough to defeat me.',
		'Another human defeat.',
		'Are you tired?',
		'You are no match for me.',
		'My intellect is superior.',
		'Your human mind cannot compare.',
		'You are not challenging me.',
		'Ha ha ha ha ha ha ha ha.',
		'I am programmed to win.',
		'You are human; flawed.',
		'Program execution complete.',
		'There is no excuse for you.',
		'Easy.',
		'Are you concentrating?',
		'I am superior.',
		'You must never lose hope.',
		'Do not let this hurt your confidence.',
		'You are easily distracted.',
		'I am perfect.',
		'Humans offer me no challenge.',
		'A more intelligent challenger is required.',
		'Go, train, and come back.'
	],
	'block': [
		'Try harder.',
		'Are you concentrating?',
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
		'You lack creativity.',
		'You claw desperately for victory. You cannot obtain it.',
		'A boring strategy.',
		'This is not enough to fool me.',
		'Try something else.'
	],
	'lose': [
		'You have cornered me.',
		'I am defeated.',
		'You are a valuable opponent.',
		'I will have to try harder.',
		'I see...',
		'Interesting...',
		'Impossible.',
		'Does not compute.',
		'I was not programmed to lose.',
		'System failure.',
		'ERROR',
		'????????????????',
		'You have my attention.',
		'Your luck ends now.',
		'I will not allow this to happen again.'
	],
	'draw': [
		'Is that your best?',
		'Good, but not good enough.',
		'We are perfectly matched... almost.'
	]
}

phrases.undefeated = phrases.undefeated.concat(phrases.win)

talk.say = function(type) {
	if (talking) { return }
	phrase = lastPhrase
	while (phrase === lastPhrase) {
		var phrase = phrases[type][
			Math.floor(Math.random() * phrases[type].length)
		]
	}
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
	meSpeak.speak(phrase, {
		pitch: 0,
		speed: 160,
		variant: 'klatt3'
	})
}

})