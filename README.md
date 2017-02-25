#What Is This?
These are custom modules that I have built for PhantomBot.  You have to install PhantomBot to get these to work.  You can find the bot at https://phantombot.tv/ and instructions to install the bot.  Once installed, you will need to copy over the the module files and folder structure to ./scripts/ located in the phantombot root folder.  

Example: <br/>

custom/quizHandler.js --> ./scripts/custom/quizHandler.js <br/>
lang/custom/custom-quizHandler.js --> ./scripts/lang/custom/custom-quizHandler.js

#The Quiz Handler module
<b>REQUIRES</b> <br/>

custom/quizHandler.js <br/>
lang/english/custom/custom-quizHandler.js <br/>

#The Extra Life System Module
<b>REQUIRES</b> <br/>

custom/ExtraLifeSystem.js <br/>
lang/english/custom/custom-extraLifeSystem.js <br/>

<b>COMMANDS</b> # = Number only , ? = AlphaNumeric <br \>
!extralife <br/>
!extralife goal <br/>
!extralife team <br/> 
!extralife last <br/>
!extralife id # <br/>
!extralife teamid # <br/>
!extralife nick ? <br/>
!extralife hospital ? <br/>
!extralife emote ? <br/>

#Insult and Praise Modules

<b>ABOUT</b> <br/>
These four modules add a list of insults and praises to chat.  This will work in twitch and discord if you have both setup in the botlogin.txt

<b>REQUIRES</b> <br/>

custom/insult.js <br/>
custom/praise.js <br/>
custom/discord-insult.js <br/>
custom/discord-praise.js <br/>
lang/english/custom/custom-insult.js <br/>
lang/english/custom/custom-praise.js <br/>

<b>COMMANDS</b> # = Number only , ? = AlphaNumeric <br \>
!insult ? ? <br/>
!praise ? ? <br/>
