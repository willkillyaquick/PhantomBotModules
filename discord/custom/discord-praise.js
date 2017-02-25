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
		for (i = 1; $.lang.exists('praise.random.' + i); i++){
			langCount.random++;
		}
		for (i = 1; $.lang.exists('praise.adj.' + i); i++){
			langCount.adj++;
		}
		for (i = 1; $.lang.exists('praise.noun.' + i); i++){
			langCount.noun++;
		}
		for (i = 1; $.lang.exists('praise.express.' + i); i++){
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
	* @function getPraise
	* @params {string} sender person sending the message
	* @params {string} message remaining args
	* @return {integer} a random number
	*/
	function getPraise(sender, message) {
		var ran = Math.floor(Math.random() * langCount.random);
		return $.lang.get('praise.random.' + ran, $.lang.get('praise.express.'+ r(langCount.express)), $.lang.get('praise.adj.'+ r(langCount.adj)), $.lang.get('praise.noun.'+ r(langCount.noun)), sender, message);
	}
	
	/*
	* @event discordCommand
	*/
	$.bind('discordCommand', function(event) {
        var channel = event.getChannel(),
			args = event.getArgs(),
			command = event.getCommand();

        /* Checks if the message is a command. */
        if (command.equalsIgnoreCase('praise')) {
			if (args.length < 2){
				$.discord.say(channel, ' You need a Name and a Reason like "!praise username you fixed my bot!"');	
			} 
			else if (args.length >= 2){
                $.discord.say(channel ,getPraise(args[0], args.slice(1, args.length).toString().replace(/\,/g," ")));
            }
            return;
        }
    });
	$.bind('initReady', function() {
		if ($.bot.isModuleEnabled('./discord/custom/discord-praise.js')) {
			$.discord.registerCommand('./discord/custom/discord-praise.js', 'praise', 0);
			loadLang();
		}
	});
})();