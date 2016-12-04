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
	
	/*
	* @event discord
	*/
    $.bind('discord', function(event) {
        var discordChannel = event.getDiscordChannel(),
            discordUser = event.getDiscordUser(),
            discordMessage = event.getDiscordMessage(),
			args = discordMessage.split(' ');

        /* Don't read our own messages, this could create a loop. */
        if ($.discord.jda().getSelfInfo().getId() == event.getId()) {
            return;
        }

        /* Checks if the message is a command. */
        if (discordMessage.startsWith('!insult ')) {
			if (args.length < 3){
				$.discord.sendMessage(event.getDiscordChannel(), ' You need a Name and a Reason like "!insult username he killed my game!"');	
			} 
			else if (args.length >= 3){
                $.discord.sendMessage(event.getDiscordChannel(),getInsult(args[1], args.slice(2, args.length).toString().replace(/\,/g," ")));
            }
            return;
        }
    });
	loadLang();
})();