// "use strict";

require('dotenv').config();


const Discord = require('discord.js');
const Client = new Discord.Client();
var Request = require("request");

// setInterval(function(){ Rand(0,2); }, 1000);



Client.on('ready', () => {
    PrintToConsle("Logged in as " + Client.user.tag);
    // SendNewMessegeToDiscord("ReaxTestBot Lives!");
    //Run bot
})

Client.on('message', msg => {

    
    //Gets the experssion to listen for, makes lower to avoid case problems.
    let lowCaseExpr = process.env.LISTEN_EXPR.toLowerCase();
    PrintToConsle(lowCaseExpr);
 
    //Check if messeage starts with the pattern the bot listens to
    if (msg.content.toLowerCase().startsWith(lowCaseExpr)) {
        //Prints the request to console for debugging         
        PrintToConsle(msg.author.username + ": " + msg.content);

        //Defines roles allowed to use the command
        // var allowerdRole = msg.guild.roles.find("name","Admin");;

        let formatedMsg = msg.content.toLowerCase();
        let parsedCommand = ParseCommand(formatedMsg);
        let command = parsedCommand[0];
        let parameters = parsedCommand[1];
        
        let max, rspnContent, response;
        let options = new Object;

        // console.log(msg.guild.channels.find( c => c.name == "TEST" ));
        // return;
        

        switch (command) {     
            
            //Creates a new textchannel
            case "croom":
                let parentCat;
                
                // name = parameters.name;
                options.nsfw = parameters.nsfw || false;
                options.type = parameters.type || "text"; 
                
                //Check if category is set
                if(parameters.category) {
                    //Checks if category exists
                    parentCat = msg.guild.channels.find( c => c.name == parameters.category && c.type == "category" ); 
                    options.parent = parentCat 

                    //IF parent not found
                    if(!parentCat) {
                        rspnContent = ("Category " + parameters.category + " not found.");
                        RespondToDiscord(msg, rspnContent);
                        return;
                    }
                }
                //Default category, should be fected from .env
                else {
                    parentCat = null;
                }
                
                options.parent = parentCat 
                msg.guild.createChannel(parameters.name, options).then(console.log).catch(console.error);
    
                console.log(options.parent);
                rspnContent = "Creating channel " + parameters.name;
                RespondToDiscord(msg, rspnContent);
                break;

            case "ccat":
                options.nsfw = parameters.nsfw || false;
                options.type = "category";   
                msg.guild.createChannel(parameters.name, options).then(console.log).catch(console.error);
    
            break;
        
            default:
                PrintToConsle(command);
                rspnContent = "Okänt kommandon.\n";
                RespondToDiscord(msg, rspnContent);
                // PrintToConsle(UserHasRole(msg,"Admin"));
                break;
        }
    }
});


Client.login(process.env.BOT_TOKEN);

/**
 * Parses a discord message into a easier format.
 *
 * @param {*} msg Discord message from the pattern /bot command !param1:value1  !param2:value2 
 * @param {*} [expr=process.env.LISTEN_EXPR.toLowerCase()]
 * @returns array, first value is the command second value is a key.value dictionary of the params
 */
function ParseCommand(msg, expr = process.env.LISTEN_EXPR.toLowerCase()) {
    //Remvove the expresson
    let formatedCommand = msg.replace(expr,"");
    //Splits on given delimtiter
    formatedCommand = formatedCommand.split("!");
    //Removes whitespace from all elements
    trimedFormCommand = formatedCommand.map(element => element.trim());
    
    //Saves the command.
    let command = trimedFormCommand.shift();
    
    let paramDict = {};

    //Extracting and formating the parameters
    let splitParameters = trimedFormCommand.map(x => x.split(":"));
    splitParameters = splitParameters.forEach(element => {
        paramDict[element[0]] = element[1];
    });
    
    return Array(command,paramDict);
}



function UserHasRole(msg, roleName) {
    return msg.member.roles.some(role => role.name === roleName)
}

function RespondToDiscord(msg, msgContent) {
    try {
        msg.reply(msgContent);
        PrintToConsle("Sending response to Discord: '" + msgContent+"'");
    }
    catch (error) {
        PrintToConsle(error);
    }
}

function PrintToConsle($msg) {
    let parseMsg = new Date().toLocaleTimeString();
    parseMsg += ": " + $msg;
    console.log(parseMsg);
}

//Sends a message to the Discord-Channel, as default reads the .env file.
function SendNewMessegeToDiscord(msgContent, channelName = process.env.DEFAULT_CHANNEL) {
    try {
        PrintToConsle("Sending messege to Discord: " + msgContent);
        let channel = Client.channels.find('name', channelName);
        channel.send(msgContent);
    }
    catch (error) {
        console.error(error);
    }
}
