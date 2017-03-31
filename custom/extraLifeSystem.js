/*
 * This is an unsupported module for retrieving data from Extra Life.
 * As Extra Life does not officially provide an API, this module may
 * stop working or may not work as expected at any time. If there are
 * connectivity issues or if the data is not coming back as expected,
 * there is a good chance that something changed on the Extra Life side.
 *
 * No warranty is implied or provided.
 *
 * @author illusionaryone
 * Modded by Willkillyaquick
 * REQUIRED LIBARY BELOW
 * ./scripts/lang/english/custom/custom-ExtraLife.js 
 *
 */

(function() {

    /**
     * NOTICE: YOU MUST MANUALLY CONFIGURE THESE VARIABLE FROM CHAT. 
     */
     
    var extraLifeID = $.inidb.get('extralife','id');
    var extraLifeTeamID = $.inidb.get('extralife','teamid');
    var extraLifeURL = 'https://www.extra-life.org/index.cfm?fuseaction=donate.participant&participantID=' + extraLifeID;
    var nickName = $.inidb.get('extralife','nick');
    var emoteLove = $.inidb.get('extralife','emote');
    var hospital = $.inidb.get('extralife','hospital');

    /**
     * @function isSetUp
     * @return {boolean} setupBoolean
     * @param {string} sender
     */
    
    function isSetUp(sender){
        var str = $.whisperPrefix(sender);
        var check= true;
        if (!$.inidb.exists('extralife','id')) {
            str = ' ID is not setup. (!extralife id #) | ';
            check = false;
        }
        if (!$.inidb.exists('extralife','nick')) {
            str = str + ' Name is not setup. (!extralife nick ___) | ';
            check = false;
        }
        if (!$.inidb.exists('extralife','hospital')) {
            str = str + ' Hospital Name is not setup. (!extralife hospital ____)';
            check = false;
        }
        if (!$.inidb.exists('extralife','emote')) {
            $.inidb.set('extralife','emote','<3');
        }
        if (!check) {
            $.say(str);
        }
        return check;
    }
    
    /**
     * @function isTeamSetup
     * @return {boolean} isTeamSetup
     * @param {string} sender
     */
    function isTeamSetup(sender) {
        if (!$.inidb.exists('extralife','teamid')) {
            $.say($.whisperPrefix(sender) + ' Team id is not setup. (!extralife teamid #)');
            return false;
        } else {
            return true;
        }
    }
    
    /**
     * @function pullJSONData
     * @param {string} url
     * @return {JSON} requestedJSON
     */
    function pullJSONData(url) {
        var HttpResponse = Packages.com.gmt2001.HttpResponse;
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var responseData = HttpRequest.getData(HttpRequest.RequestType.GET, url, "", new HashMap());
        return JSON.parse(responseData.content);
    }
    
     /**
     * @function pullExtraLifeTotalGoal
     * @return {String} userInformation
     */
    function pullExtraLifeTotalGoal() {
        var jsonObj = pullJSONData('https://www.extra-life.org/index.cfm?fuseaction=donordrive.participant&participantID=' + extraLifeID + '&format=json');
        var totalRaised = jsonObj['totalRaisedAmount'];
        var fundRaisingGoal = jsonObj['fundraisingGoal'];
        return $.lang.get('extralifesystem.pullextragoal.goal', nickName, totalRaised , fundRaisingGoal);
    }
    
     /**
     * @function pullExtraLifeTeamTotalGoal
     * @return {string} teamInformation
     */
    function pullExtraLifeTeamTotalGoal() {
        var jsonObj = pullJSONData('https://www.extra-life.org/index.cfm?fuseaction=donorDrive.team&teamID=' + extraLifeTeamID + '&format=json');
        var totalRaised = jsonObj['totalRaisedAmount'];
        var fundRaisingGoal = jsonObj['fundraisingGoal'];
        var teamName = jsonObj['name'];
        return $.lang.get('extralifesystem.pullextrateam.goal', nickName, teamName , totalRaised, fundRaisingGoal);
    }

    /**
     * @function pullExtraLifeLastDonation
     * @return {String} donationInformation
     * 
     */
    function pullExtraLifeLastDonation() {
        var jsonObj = pullJSONData('https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participantDonations&participantID=' + extraLifeID + '&format=json');
        if (jsonObj[0] === undefined) {
            return 'No recent donations found!';
        }
        
        var message = jsonObj[0].message;
        var donorName = jsonObj[0].donorName;
        var donationAmount = jsonObj[0].donationAmount;
        return $.lang.get('extralifesystem.pullextradonation.last', donationAmount , donorName, message);
    }
    
     /**
     * @function pullExtraLifeDonations
     */
    function pullExtraLifeDonationsInterval() {
        var jsonObj = pullJSONData('https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participantDonations&participantID=' + extraLifeID + '&format=json');
        var firstRun = $.getIniDbBoolean('extralife', 'firstrun', true);

        if (jsonObj[0] === undefined) {
            if (firstRun) {
                $.inidb.set('extralife', 'firstrun', 'false');
            }
            return;
        }

        for (var i = 0; i < jsonObj.length; i++) {
            var message = jsonObj[i].message;
            var donorName = jsonObj[i].donorName;
            var donationAmount = jsonObj[i].donationAmount;
            var createdOn = jsonObj[i].createdOn;
            if ($.inidb.exists('extralife', donorName + '_' + createdOn)) {
                continue;
            }
            
            $.inidb.set('extralife', donorName + '_' + createdOn, donationAmount);
            if (!firstRun) {
                $.say($.lang.get('extralifesystem.pullextradonation.interval', donationAmount, donorName, message, emoteLove));
            }
        }
        
        if (firstRun) {
            $.inidb.set('extralife', 'firstrun', 'false');
        }
    }
    
    /**
    * @setExtraLifeID
    * @return statusOfIDMessage
    * @param {string} setdb
    * @param {integer} id
    * @param {string} sender
    */
    function setID(setdb, id, sender) {
        if (!isNaN(id)) {
                $.inidb.set('extralife', setdb, id)
                return $.lang.get('extralifesystem.setid.updated', $.whisperPrefix(sender));
            } else {
                return $.lang.get('extralifesystem.setid.error', $.whisperPrefix(sender));
            }
    }
    
    /**
     * @event command
     */  
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            username = (args[0] ? args[0].toLowerCase() : false);

        if (command.equalsIgnoreCase('extralife')) {        
            
            if (args.length == 0 && isSetUp(sender)) {
                $.say($.lang.get('extralifesystem.extralife.say',nickName, hospital, extraLifeURL, emoteLove)); 
                return;
            } else if (args.length == 0){
                return;
            }
            
            if (args[0].equalsIgnoreCase('goal') && isSetUp(sender)) {
                $.say(pullExtraLifeTotalGoal());
                return;
            }

            if (args[0].equalsIgnoreCase('last') && isSetUp(sender)) {
                $.say(pullExtraLifeLastDonation());
                return;
            }
            
            if (args[0].equalsIgnoreCase('team') && isTeamSetup(sender)) {
                $.say(pullExtraLifeTeamTotalGoal());
                return;
            } else if (args[0].equalsIgnoreCase('team')){
                return;
            }
            
            //Setup Area
            if (args[0].equalsIgnoreCase('id')) {
                $.say(setID('id', args[1], sender));
                extraLifeID = $.inidb.get('extralife','id');
                extraLifeURL = 'https://www.extra-life.org/index.cfm?fuseaction=donate.participant&participantID=' + extraLifeID;
                return;
            }
            
            if (args[0].equalsIgnoreCase('teamid')) {
                $.say(setID('teamid', args[1], sender));
                return;
            }
            
            if (args[0].equalsIgnoreCase('emote')) {
                $.inidb.set('extralife', 'emote', args[1]);
                emoteLove = $.inidb.get('extralife','emote');
                $.say($.lang.get('extralifesystem.emote.set',$.whisperPrefix(sender)));
                return;
            }
            
            if (args[0].equalsIgnoreCase('hospital')) {
                $.inidb.set('extralife', 'hospital', args.slice(1, args.length).toString().replace(/\,/g," "));
                hospital = $.inidb.get('extralife','hospital');
                $.say($.lang.get('extralifesystem.hospital.set',$.whisperPrefix(sender)));
                return;
            }
            
            if (args[0].equalsIgnoreCase('nick')) {
                $.inidb.set('extralife', 'nick', args.slice(1, args.length).toString().replace(/\,/g," "));
                nickName = $.inidb.get('extralife','nick');
                $.say($.lang.get('extralifesystem.nick.set',$.whisperPrefix(sender)));
                return;
            }
        }

    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/extraLifeSystem.js')) {
            $.registerChatCommand('./custom/extraLifeSystem.js', 'extralife', 7);
            $.registerChatSubcommand('extralife', 'teamid', 0);
            $.registerChatSubcommand('extralife', 'id', 0);
            $.registerChatSubcommand('extralife', 'emote', 0);
            $.registerChatSubcommand('extralife', 'hospital', 0);

            setInterval(function() { pullExtraLifeDonationsInterval(); }, 60e3);
        }
    });


})();