// "use strict";

require('dotenv').config();


const Discord = require('discord.js');
const Client = new Discord.Client();
var Request = require("request");

const Room = require('./room.js');

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
                // let parentCat;
                
                //Setts type to text, needs to be lowercase
                parameters.type = "text"
                parameters.typeFormated = "room";

                CreateChannel(msg,parameters);
                break;

            case "ccat":
                //Setts type to text, needs to be lowercase
                parameters.type = "category";
                parameters.typeFormated = "category";

                CreateChannel(msg,parameters); 
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

function CreateChannel(msg,params) {
    let room,typeFormated;
    
    try {
        room = new Room(params);
      } catch (e) {
        console.error(e);
        rspnContent = `The ${params.typeFormated} must have given a name`;
        RespondToDiscord(msg,rspnContent);
        return;
      }
    
    
    if(room.FindChannel(msg.guild)) {
        rspnContent = `The ${params.typeFormated} already exists`;
        RespondToDiscord(msg, rspnContent);
        return;
    }

    if(params.category && !room.FindParent(msg.guild)) {
        rspnContent = `Category ${params.category} not found.`;
        RespondToDiscord(msg, rspnContent);
        return;
    }

    if(room.Create(msg.guild)) {
        rspnContent = `Creating ${params.typeFormated} ${params.name}`;
        RespondToDiscord(msg, rspnContent);
    }
}