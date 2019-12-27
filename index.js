const telegramToken = "1006092919:AAFSD6VDTAGWNOEvkblwkE-942cXhGWdAtA";
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(telegramToken, {polling: true});

var GhPolyglot = require("gh-polyglot");
var async = require("async");

// telegram.on("text", (message) => {
//   telegram.sendMessage(message.chat.id, "Hello world");
// });

var username = 'uditiarora'; //default username
var user = new GhPolyglot(username + "/git-stats");
var all_repo_stats = null;

bot.on("polling_error", (err) => console.log(err));
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const resp = "Welcome to GetMeGit bot. Type /user username to search for the user you are looking for. the default user is uditiarora";
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/user (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    username = match[1];
    var resp = "Hold on while we fetch the user info.";
    bot.sendMessage(chatId, resp);
    user = new GhPolyglot(username + "/git-stats");
    user.getAllRepos(function(err,stats) {
        if(err != null){
            resp = "User not found. Try another user.";
            username = "uditiarora";
            bot.sendMessage(chatId, resp);
        }
        else{
            all_repo_stats = stats;
            resp = "The user has a total of " + all_repo_stats.length +" repos.\n";
            resp += "Use the rest of the commands to view detailed info.";
            bot.sendMessage(chatId, resp);
        }
    });
    
});

bot.onText(/\/rep_stats/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,"Hold on! We are fetching the data.");
    var resp = "These are the repository stats for the user. Languages in ascending order of usage are :\n";
    user.repoStats(function (err, stats) {
        if(err != null){
            bot.sendMessage(chatId, "Sorry. Couldn't find anything :(");
        }
        else{
            stats.forEach((element => resp += (element.label + "\n")));
            bot.sendMessage(chatId,resp);
        }
    });
    
});

bot.onText(/\/all_reps/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,"Hold on while we fetch the repository names for you.");
    var resp = "The reps are :\n";
    if(all_repo_stats != null){
        all_repo_stats.forEach((element => resp += (element.name + "\n")));
        bot.sendMessage(chatId, resp);
    }
    else{
        user = new GhPolyglot(username + "/git-stats");
        user.getAllRepos(function(err,stats){
            if(err === null){
                all_repo_stats = stats;
                all_repo_stats.forEach((element => resp += (element.name + "\n")));
                bot.sendMessage(chatId, resp);
            }
            else{
                bot.sendMessage(chatId,"Couldn't fetch the info :(.\nTry another user.");
            }
        });

    }

});

bot.onText(/\/user_stats/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,"Hold on! We are fethcing the data.");
    var resp = "These are the user repo stats. Number of repositories in each language(descending order) : \n";
    user.userStats(function (err, stats) {
        if(err != null){
            bot.sendMessage(chatId, "Sorry. Couldn't find anything :(");
        }
        else{
            stats.forEach((element => resp += (element.label + "\n")));
            bot.sendMessage(chatId,resp);
        }
    });
    
});