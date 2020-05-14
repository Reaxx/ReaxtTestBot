// "use strict";

require('dotenv').config();


const Discord = require('discord.js');
const Client = new Discord.Client();
var Request = require("request");

// setInterval(function(){ Rand(0,2); }, 1000);

const GeneratorLists = require("./generatorlists.js");

const gLists = new GeneratorLists();
gLists.Load();
PrintToConsle("Loaded from JSON");

Client.on('ready', () => {
    PrintToConsle("Logged in as " + Client.user.tag);
    // SendNewMessegeToDiscord("SimultimaBot Lives!");
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
        
        let max, rspnContent, paramName, response;
        let paramNames = [];

        switch (command) {     
            case "tärning":              
                max = parameters["d"] || 6;
                let randNr = Rand(1,max);
                rspnContent = "Rullade en d"+max+": \n";
                rspnContent += randNr;
                RespondToDiscord(msg, rspnContent);
                break;

            case "plats":
                let place = gLists.GetRandom("Places");
                console.log(place);

                if(place === false) {
                    rspnContent = "Inga träffar funna, prova att skapa några.";
                } else {
                    rspnContent = "Slumpvis vald plats: \n";
                    rspnContent += place;
                }

                RespondToDiscord(msg, rspnContent);
                break;

            case "skapa":
                //Asuming first param is relevant
                paramNames = Object.keys(parameters);
                paramName = paramNames[0];

                switch (paramName) {
                    case "plats":
                        response = gLists.Add("Places",parameters[paramName]);  
                        break;
                
                    default:
                        rspnContent = paramName+" okänd.";
                        RespondToDiscord(msg,rspnContent);
                        return false;
                }

                //Creating response if a known param was used
                if(response === true) {
                    gLists.Save();
                    rspnContent = "Objekt ''"+parameters[paramName]+"' i lista ''"+paramName+"' skapad";      
                    msgContent = msg.author+" - " + rspnContent;              
                    SendNewMessegeToDiscord(msgContent);
                } else {
                    rspnContent = response;
                }
                RespondToDiscord(msg,rspnContent);
                break;
                
            case "radera":
                //Asuming first param is relevant
                paramNames = Object.keys(parameters);
                paramName = paramNames[0];

                switch (paramName) {
                    case "plats":
                        response = gLists.Remove("Places",parameters[paramName]);  
                        break;
                
                    default:
                        rspnContent = paramName+" okänd.";
                        RespondToDiscord(msg,rspnContent);
                        return false;
                }

                //Creating response if a known param was used
                if(response === true) {
                    gLists.Save();
                    rspnContent = "Objekt ''"+parameters[paramName]+"' i lista ''"+paramName+"' raderat";      
                    msgContent = msg.author+" - " + rspnContent;              
                    SendNewMessegeToDiscord(msgContent);
                } else {
                    rspnContent = response;
                }
                RespondToDiscord(msg,rspnContent);
                break;

                case "lista":
                    //Asuming first param is relevant
                    paramNames = Object.keys(parameters);
                    paramName = paramNames[0];
    
                    switch (paramName) {
                        case "plats":
                            response = gLists.List("Places",parameters[paramName]);  
                            break;
                    
                        default:
                            rspnContent = paramName+" okänd.";
                            RespondToDiscord(msg,rspnContent);
                            return false;
                    }
    
                    RespondToDiscord(msg,response);
                    break;
        
            default:
                rspnContent = "Okänt kommandon.\nTillgänliga kommandon är: \n";
                rspnContent += "Tärning [!d:100]\n";
                rspnContent += "Plats\n";
                rspnContent += "Skapa ![plats]:[platsbeskrivning]\n"
                rspnContent += "Radera ![plats]:[platsbeskrivning]\n"
                rspnContent += "Lista ![plats]"
                RespondToDiscord(msg, rspnContent);
                // PrintToConsle(UserHasRole(msg,"Admin"));
                break;
        }
    }
});


Client.login(process.env.BOT_TOKEN);

function Rand(min,max) {
    let rand =  Math.round(Math.random()*max) + min
    console.log("Max: "+max+"\nMin: "+min+"\nResult: "+rand+"\n");
    return rand;
}

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
