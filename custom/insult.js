(function (){
	
	/*
    *   @author WillKillYaQuick (Quack) will71110@yahoo.com
    *   2016/12/4
    */
	var langCount = { 
		adj: 0,
		express: 0,
		noun: 0,
		random: 0
	};
	
	//Thanks to ScaniaTV for helping with this.
	function loadLang(){
		var i;
		for (i = 1; $.lang.exists('insult.random.' + i); i++){
			langCount.random++;
		}
		for (i = 1; $.lang.exists('insult.adj.' + i); i++){
			langCount.adj++;
		}
		for (i = 1; $.lang.exists('insult.noun.' + i); i++){
			langCount.noun++;
		}
		for (i = 1; $.lang.exists('insult.express.' + i); i++){
			langCount.express++;
		}
	}
	
	/*
	* @function r
	* @params {integer} n number in collection
	* @return {integer} a random number
	*/
	function r(n) {
		return Math.floor(Math.random() * n) + 1;
	}
	
	/*
	* @function getInsult
	* @params {string} sender person sending the message
	* @params {string} message remaining args
	* @return {integer} a random number
	*/
	function getInsult(sender, message) {
		var ran = Math.floor(Math.random() * langCount.random);
		return $.lang.get('insult.random.' + ran, $.lang.get('insult.express.'+ r(langCount.express)), $.lang.get('insult.adj.'+ r(langCount.adj)), $.lang.get('insult.noun.'+ r(langCount.noun)), sender, message);
	}
	
	$.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            username = (args[0] ? args[0].toLowerCase() : false);
		if (command.equalsIgnoreCase('insult')){
			if (args.length < 2 ) {
                $.say($.whisperPrefix(sender) + ' You need a Name and a Reason like "!insult username he killed my game!"'); 
            } else if (args.length >= 2){
                $.say(getInsult(args[0], args.slice(1, args.length).toString().replace(/\,/g," ")));
            }	
		}
	});
	
	/**
	* @event initReady
	*/
	$.bind('initReady', function() {
		if ($.bot.isModuleEnabled('./custom/insult.js')) {
			$.registerChatCommand('./custom/insult.js', 'insult', 7);
			loadLang();
		}
    });
})();