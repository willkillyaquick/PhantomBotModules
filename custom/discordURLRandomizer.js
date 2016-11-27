(function() {
	/** 
    *   @author WillKillYaQuick (Quack) will71110@yahoo.com
    *   2016/11/27
	*/
	
	var currentKey = '',
		dbTable = 'discordRURL';
	var replacer = function(key, value) {
	   var returnValue = value;
	   try {
		  if (value.getClass() !== null) { // If Java Object
			 if (value instanceof java.lang.Number) {
				returnValue = 1 * value;
			 } else if (value instanceof java.lang.Boolean) {
				returnValue = value.booleanValue();
			 } else { // if (value instanceof java.lang.String) {
				returnValue = '' + value;
			 }
		  }
	   } catch (err) {
		  // No worries... not a Java object
	   }
	   return returnValue;
	};
	
	/*
	* @function getJSONkeyLength
	* @params {JSON} obj
	* @return {integer} JSONlength
	*/
	function getJSONkeyLength(obj) { 
		return Object.keys(obj).length; 
	}
	
	/*
	* @function isRealURLmatches
	* @params {string} url
	* @return {boolean} HTTPMatch
	*/
	function isRealURLmatches(url){
		return url.match(/[^\(,][(http(s?):\/\/)][-a-zA-Z0-9@:%._\+~#=\/\?\&]{1,}/g);
	}
	
	/*
	* @function isKeywordThere
	* @params {string} message
	* @return {boolean} ExistsInDatabase
	*/
	function isKeywordThere(message) {
		if ($.inidb.exists(dbTable, message)){
				return true;
			} else {
				return false;
			}
	}
	
	/*
	* @function addKeyURL
	* @params {string} Key, {string} message
	* @return {string} DiscordMessage
	* @info Adds Key and Data to Database
	*/
	function addKeyURL(key, message) {
		if (!isKeywordThere(key)){
			var strArray = message.split(',');
			currentKey = key;
			var tJSON = JSON.parse("{}");
			for (var i in strArray){
				if (isRealURLmatches(strArray[i])){
					tJSON[i] = strArray[i];
				}
			}
			$.inidb.set(dbTable, key, JSON.stringify(tJSON, replacer));
			return key + ' added to random URL generator.';		
		} else {
			return 'That key already exists! Use edit or remove it';
		}
	}
	
	/*
	* @function delKey
	* @params {string} Key
	* @return {string} DiscordMessage
	* @info Deletes key from database
	*/
	function delKey(key){
		if (isKeywordThere(key)){
			$.inidb.del(dbTable, key);
			return key + ' deleted from Random URL Generator';
		} else {
			return 'There is no key by that name!';
		}
	}
	
	/*
	* @function editKey
	* @params {string} Key, {string} message
	* @return {string} DiscordMessage
	* @info Edits key in database
	*/	
	function editKey(key, message){
		if (isKeywordThere(key)){
			var tJSON = JSON.parse($.inidb.get(dbTable, key));
			var tmp = message.split(',');
			if (tmp.length == 2){
				tJSON[tmp[0]] = tmp[1];
				$.inidb.set(dbTable, key, JSON.stringify(tJSON, replacer));
				$.consoleLn($.inidb.get(dbTable, key));
				return 'URL Edited successfully.';
			} else {
				return 'Edit Argument is incorrect. Only one item at a time can be edited';
			}
		}
	}
	
	/*
	* @function checkKeywordList
	* @params {string} discordMessage, {event} event
	* @info Contains functions for the messages send from Discord
	*/	
	function checkKeywordList(discordMessage, event){
		if (isKeywordThere(discordMessage)){
			var tJSON = JSON.parse($.inidb.get(dbTable, discordMessage));
			var jLength = getJSONkeyLength(tJSON);
			var randomURL = Math.floor(Math.random() * jLength);
			$.discord.sendMessage(event.getDiscordChannel(), tJSON[randomURL]);
		} else {
			var messageSplit = discordMessage.split(' '),
				messageKey = messageSplit[1].split('\\(')[0],
				messageDigest = messageSplit[1].split('\\(')[1].split('\\)')[0];
			if (messageSplit[0] == 'add' && event.isAdmin()){			
				$.discord.sendMessage(event.getDiscordChannel(), addKeyURL(messageKey,messageDigest));		
			}
			else if (messageSplit[0] == 'del' && event.isAdmin()) {
				$.discord.sendMessage(event.getDiscordChannel(), delKey(messageKey));
			}
			else if (messageSplit[0] == 'edit' && event.isAdmin()) {
				$.discord.sendMessage(event.getDiscordChannel(), editKey(messageKey, messageDigest));
			}
			else if (messageSplit[0] == 'show') {
				$.discord.sendMessage(event.getDiscordChannel(), $.inidb.get(dbTable,  messageKey));
			}
		}
	}
	
	/*
	* @event discord
	*/
    $.bind('discord', function(event) {
        var discordChannel = event.getDiscordChannel(),
            discordUser = event.getDiscordUser(),
            discordMessage = event.getDiscordMessage();

        /* Don't read our own messages, this could create a loop. */
        if ($.discord.jda().getSelfInfo().getId() == event.getId()) {
            return;
        }

        /* Checks if the message is a command. */
        if (discordMessage.startsWith('!rurl ')) {
            checkKeywordList(discordMessage.substring(6), event);
            return;
        }
    });
})();