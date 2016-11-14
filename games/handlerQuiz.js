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

    var jsonData;
    var firstData = getURLData("http://jservice.io/api/category?id=" + $.inidb.get('quiz', 'cid'));
    var jsonData = JSON.parse(firstData.content);

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
        setNonActive();
        if ($.getUserPoints(sender) > 14){
            $.inidb.decr('points', sender, 15);
        } else {
            return $.lang.get('quiz.skipquestion.errorpoints', $.whisperPrefix(sender));
        }
        return $.lang.get('quiz.skipquestion.skipping', pullRandomQuestion()); 
    }

    //Get URL Data
    function getURLData(url){
        var HttpResponse = Packages.com.gmt2001.HttpResponse;
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        return HttpRequest.getData(HttpRequest.RequestType.GET, url, "", new HashMap());
    }
    
    //Store Data
    function storeData(){
        $.inidb.set('quiz', 'title', jsonData.title);
        $.inidb.set('quiz', 'qid', Math.floor(Math.random() * jsonData.clues_count) + 1);
        $.inidb.set('quiz', 'question', jsonData['clues'][$.inidb.get('quiz', 'qid')]['question']);
        $.inidb.set('quiz', 'answer', jsonData['clues'][$.inidb.get('quiz', 'qid')]['answer']);
        if (jsonData['clues'][$.inidb.get('quiz', 'qid')]['value'] == 0){
            $.inidb.set('quiz', 'value', 10)
        } else {
            $.inidb.set('quiz', 'value', jsonData['clues'][$.inidb.get('quiz', 'qid')]['value']);
        }
        for (i = 0; i < 3; i++){
            var temp = Math.floor(Math.random() * jsonData.clues_count) + 1
            $.inidb.set('quiz', 'randomclue' + i, jsonData['clues'][temp]['answer']);
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
                pullData = getURLData("http://jservice.io/api/category?id=" + $.inidb.get('quiz', 'cid'));
                jsonData = JSON.parse(pullData.content);
            }
            storeData();
            setActive();
        } 
        return $.lang.get('quiz.pullrandomquestion.ask', Math.floor($.inidb.get('quiz', 'value')/10), $.inidb.get('quiz', 'question'));
    }
    
    //checkAnswer
    function checkAnswer(str, sender){
        if ($.inidb.get('quiz', 'answer').toLowerCase() == str.toLowerCase()){
            setNonActive();
            //GrantPoints
            $.inidb.incr('points', sender ,Math.floor($.inidb.get('quiz', 'value')/10))
            return $.lang.get('quiz.checkanswer.correct',sender, Math.floor($.inidb.get('quiz', 'value')/10)); //+ " points to you my friend. Type !quiz ask to get next question...";
        }
        $.say($.lang.get('quiz.checkanswer.whisperanswer',$.whisperPrefix(sender), pullRandomQuestion()));
        return $.lang.get('quiz.checkanswer.wrong', sender);// + ", sorry but that is not the right answer.  Please try again";
    }
    
    //return Multiple Answers Clues
    function getMultipleAnswers(sender){
        var str = 'Answer Hints Cost 20 points: ';
        if ($.getUserPoints(sender) > 19){
            $.inidb.decr('points', sender, 20);
        } else {
            return lang.get('quiz.getmultipleanswers.errorpoints',$.whisperPrefix(sender))// "You dont have enought points to request a hint";
        }
        var r = Math.floor((Math.random() * 4));
        for (i = 0; i < 4; i++){
            if (r == i){
                str = str + $.inidb.get('quiz','answer') + ' : ';
            } else {
            str = str + $.inidb.get('quiz','randomclue' + i) + ' : ';
            }
        }
        return $.lang.get('quiz.getmultipleanswers.clue', $.whisperPrefix(sender), str);
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
            if (args[0].equalsIgnoreCase('clue')) {
                $.say(getMultipleAnswers(sender));
                return;
            }
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
}) ();