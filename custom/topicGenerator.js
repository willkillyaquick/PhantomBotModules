/*
 * This is an unsupported module for retrieving data from 
 * http://www.conversationstarters.com/.
 * As http://www.conversationstarters.com/ do not officially provide an API, 
 * this module may stop working or may not work as expected at any time. 
 * If there are connectivity issues or if the data is not coming back as 
 * expected, there is a good chance that something changed on the 
 * http://www.conversationstarters.com/.
 *
 * No warranty is implied or provided. 
 * @author willkillyaquick
 */

(function() {
	var workingURL = "http://www.conversationstarters.com/random.php"
	
	function pullStringData(url) {
        var HttpResponse = Packages.com.gmt2001.HttpResponse;
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, url, "", new HashMap());
        return responseData.content;
    }
	
	$.bind('command', function(event) {
		var command = event.getCommand();
		var strData = pullStringData(workingURL);
		if (command.equalsIgnoreCase('topic')){
			$.say("New Chat Topic: " +  strData.slice(39));
			return;
		}
	});
		
	$.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/topicGenerator.js')) {
            $.registerChatCommand('./custom/topicGenerator.js', 'topic', 7);
		}
    });
})();