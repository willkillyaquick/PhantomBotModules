(function (){
	
	/*
    *   @author WillKillYaQuick (Quack) will71110@yahoo.com
    *   2016/12/4
    */
	var langCount = { 
		express: 0
	};
	
	//Thanks to ScaniaTV for helping with this.
	function loadLang(){
		var i;
		for (i = 1; $.lang.exists('fortune.express.' + i); i++){
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
	* @function getFortune
	* @params {string} sender person sending the message
	* @params {string} message remaining args
	* @return {string} fortune
	*/
	function getFortune(sender) {
		return $.lang.get('fortune.main.say', sender, $.lang.get('fortune.express.' + r(langCount.express)), r(8) + '-' + (r(8) + 8) + '-' + (r(8) + 16) + '-' + (r(8) + 24) + '-' + (r(8) + 32) + '-' + (r(8) + 40) + '-' + (r(8) + 48) + '-' + (r(8) + 52)) ;
	}
	
	$.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            username = (args[0] ? args[0].toLowerCase() : false);
		if (command.equalsIgnoreCase('fortune')){
				$.say(getFortune(sender));
		}
	});
	
	/**
	* @event initReady
	*/
	$.bind('initReady', function() {
		if ($.bot.isModuleEnabled('./custom/fortuneCookie.js')) {
			$.registerChatCommand('./custom/fortuneCookie.js', 'fortune', 7);
			loadLang();
		}
    });
})();