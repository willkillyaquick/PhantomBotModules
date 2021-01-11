(function(){
    
    /** 
    *   @author WillKillYaQuick (Quack) will71110@yahoo.com
    *   2016/11/11
    *
    *   This module uses the API from http://jservice.io .  ID's for the questions can be found atan
    *   http://jservice.io/search .  Note that all the answer can be found on that site.  This is why
    *   MOD's are set up to be the only ones that can change the ID. Put this in .scripts/games/ .
    *
    *   x!quiz
    *   x!quiz ask 
    *   x!quiz id ''
    *   x!quiz skip
    *   x!quiz answer ''
    *   x!quiz clue (whispers)
    *   
    */

    var firstData = "http://jservice.io/api/category?id=" + $.inidb.get('quiz', 'cid');
    var jsonData = JSON.parse($.customAPI.get(firstData).content);
	var answers = '';

    //remove special strings    
    function filterStrings(str){
        return str;
    }
    
    //Set Active Question asked
    function setActive(){
        $.inidb.set('quiz', 'active', 'true');
    }

    //Remove active Question asked
    function setNonActive(){
        $.inidb.set('quiz', 'active', 'false');
    }

    //Get active
    function getActive(){
        return $.getIniDbBoolean('quiz', 'active', true);
    }

    //Return catagory !quiz cat "ID"
    function changeSubject(id, sender){
        if (isNaN(id)){
            return $.lang.get('quiz.id.errornumber', $.whisperPrefix(sender));
        } else {
            $.inidb.set('quiz', 'cid', id);
            setNonActive();
            pullRandomQuestion();
            return $.lang.get('quiz.id.changesubject', $.inidb.get('quiz', 'title'), $.getIniDbString('quiz','cid'));
        }
    }
    
    //skipQuestion
    function skipQuestion(sender){
        if ($.getUserPoints(sender) > 14){
            $.inidb.decr('points', sender, 15);
			setNonActive();
        } else {
            return $.lang.get('quiz.skipquestion.errorpoints', $.whisperPrefix(sender));
        }
        return $.lang.get('quiz.skipquestion.skipping', pullRandomQuestion()); 
    }
    
    //Store Data
    function storeData(){
        $.inidb.set('quiz', 'title', jsonData.title);
        $.inidb.set('quiz', 'qid', Math.floor(Math.random() * jsonData.clues_count) + 1);
        $.inidb.set('quiz', 'question', jsonData['clues'][$.inidb.get('quiz', 'qid')]['question']);
        $.inidb.set('quiz', 'answer', jsonData['clues'][$.inidb.get('quiz', 'qid')]['answer']);
        if (jsonData['clues'][$.inidb.get('quiz', 'qid')]['value'] == 0){
            $.inidb.set('quiz', 'value', 10);
        } else {
            $.inidb.set('quiz', 'value', jsonData['clues'][$.inidb.get('quiz', 'qid')]['value']);
        }
        for (i = 1; i <= 4; i++){
            var temp = Math.floor(Math.random() * jsonData.clues_count) + 1;
			if (jsonData['clues'][temp]['answer'] == $.inidb.get('quiz', 'answer')){
				i -= 1;
			} else {
				$.inidb.set('quiz', 'randomclue' + i, jsonData['clues'][temp]['answer']);
			}
        }
    }
    
    //pulls random question from API
    function pullRandomQuestion(){
        if (!getActive()){
            if ($.inidb.get('quiz', 'cid') < 1) {
                $.inidb.set('quiz', 'cid', 25);
            }
            //Do we need to pull data again?
            if ($.inidb.get('quiz','lcid') != $.inidb.get('quiz','cid')){
                $.inidb.set('quiz','lcid', $.inidb.get('quiz','cid'));
                pullData = "http://jservice.io/api/category?id=" + $.inidb.get('quiz', 'cid');
                jsonData = JSON.parse($.customAPI.get(pullData).content);
            }
            storeData();
            setActive();
			answers = getMultipleAnswers();
		}
		return $.lang.get('quiz.pullrandomquestion.ask', Math.floor($.inidb.get('quiz', 'value')/10), $.inidb.get('quiz', 'question') + answers);
    }
    
    //checkAnswer
    function checkAnswer(str, sender){
		if (getActive()){
			if ($.inidb.get('quiz', 'answer').toLowerCase() == str.toLowerCase() || $.inidb.get('quiz', 'correct') == str.toLowerCase()){
				setNonActive();
				//GrantPoints
				$.inidb.incr('points', sender ,Math.floor($.inidb.get('quiz', 'value')/10));
				return $.lang.get('quiz.checkanswer.correct',sender, Math.floor($.inidb.get('quiz', 'value')/10)); //+ " points to you my friend. Type !quiz ask to get next question...";
			}
			$.say($.lang.get('quiz.checkanswer.whisperanswer',$.whisperPrefix(sender), pullRandomQuestion()));
			return $.lang.get('quiz.checkanswer.wrong', sender);// + ", sorry but that is not the right answer.  Please try again";
		}
		return '###No Active Question###';
    }
    function getMultipleAnswers(){
		var temp = 1;
		var str = '###Type number of answer:'
        var r = Math.floor((Math.random() * 4) + 1);
        for (i = 1; i <= 4; i++){
            if (r == i){
				$.inidb.set('quiz', 'correct', i);
				str += '### ' + i + ': ' + $.inidb.get('quiz','answer');
            } else {
				str += '### ' + i + ': '+ $.inidb.get('quiz','randomclue' + temp);
				temp = temp + 1;
            }
        }
		return str;
    }
    
    /**
     * @event command
     */  
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            args = event.getArgs(),
            username = (args[0] ? args[0].toLowerCase() : false);
        if (command.equalsIgnoreCase('quiz')) {

            if (args.length == 0) {
                $.say($.lang.get('quiz.info'));
                return;
            }

            if (args[0].equalsIgnoreCase('ask')) {
                $.say(pullRandomQuestion());
				//getMultipleAnswers();
                return;
            }
            if (args[0].equalsIgnoreCase('skip')) {
                $.say(skipQuestion(sender));
                return;
            }
            if (args[0].equalsIgnoreCase('answer')) {
                $.say(checkAnswer(args.slice(1, args.length).toString().replace(/\,/g," "), sender));
                return;
            }
            if (args[0].equalsIgnoreCase('id')) {
                $.say(changeSubject(args[1], sender));
                return;
            }
            if (args[0].equalsIgnoreCase('subject')) {
                $.say($.lang.get('quiz.id.changesubject', $.inidb.get('quiz', 'title'), $.inidb.get('quiz','cid')));
                return;
            }
            /* if (args[0].equalsIgnoreCase('clue')) {
                $.say(getMultipleAnswers(sender));
                return;
            } */
        }

    });
    
    /**
     * @event initReady
     */
$.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./custom/handlerQuiz.js')) {
            $.registerChatCommand('./custom/handlerQuiz.js', 'quiz', 7);
            $.registerChatSubcommand('quiz', 'id', 2);
            //setInterval(function() { keepQuestionAlive(); }, 60e3);
        }
    });
})
 ();