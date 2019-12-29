const telegramToken = "1006092919:AAFSD6VDTAGWNOEvkblwkE-942cXhGWdAtA";
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(telegramToken, {polling: true});

var GhPolyglot = require("gh-polyglot");
const fetch = require("node-fetch");


var username = 'uditiarora'; //default username
var user = new GhPolyglot(username + "/git-stats");
var all_repo_stats = null;
var user_data = null;
var repo_data = null;
var command_keyboard = [["/commands_list","/all_reps","/rep_stats"],
                        ["/name","/joining_date","/followers"],["/following","/location","/bio"],
                    ["/avatar","/company","/most_starred"]];

bot.on("polling_error", (err) => console.log(err));
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const resp = "Welcome to GetMeGit bot. Type /user username to search the user you are looking for. The default user is uditiarora.";
    fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (response.status === 404) {
                return setError({ active: true, type: 404 });
                }
                if (response.status === 403) {
                return setError({ active: true, type: 403 });
                }
                return response.json();
            })
            .then(json => user_data = json)
            .catch(error => {
                setError({ active: true, type: 400 });
                console.error('Error:', error);
    });
    bot.sendMessage(chatId, resp,{
        "reply_markup" : {
            "keyboard" : command_keyboard
        }
    });
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
            repo_data = null;
            all_repo_stats = null;
            user_data = null;
            fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (response.status === 404) {
                return setError({ active: true, type: 404 });
                }
                if (response.status === 403) {
                return setError({ active: true, type: 403 });
                }
                return response.json();
            })
            .then(json => user_data = json)
            .catch(error => {
                setError({ active: true, type: 400 });
                console.error('Error:', error);
            });


            all_repo_stats = stats;
            resp = "The user has a total of " + all_repo_stats.length +" repos.\n";
            resp += "Use the rest of the commands to view detailed info.";
            bot.sendMessage(chatId, resp);
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

bot.onText(/\/rep_stats/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,"Hold on! We are fethcing the data.");
    var resp = "These are the user repo stats. Number of repositories in each language(descending order) : \n";
    user.userStats(function (err, stats) {
        if(err != null){
            bot.sendMessage(chatId, "Sorry. Couldn't find anything :(");
        }
        else{
            stats.forEach((element => resp += (element.label + ": " + element.value + "\n")));
            bot.sendMessage(chatId,resp);
        }
    });
    
});

bot.onText(/\/name/, (msg) => {
    const chatId = msg.chat.id;
    if(user_data != null){
        bot.sendMessage(chatId, `User's name is ${user_data.name}.`);
    }
    else{
        bot.sendMessage(chatId,"Couldn't find this user. Try some other user");
    }    
});

bot.onText(/\/joining_date/, (msg) => {
    const chatId = msg.chat.id;
    if(user_data != null){
        bot.sendMessage(chatId, `User's joining date was ${user_data.created_at.substring(0,10)}.`);
    }
    else{
        bot.sendMessage(chatId,"Couldn't find this user. Try some other user");
    }    
});


bot.onText(/\/followers/, (msg) => {
    const chatId = msg.chat.id;
    if(user_data != null){
        bot.sendMessage(chatId, `User has ${user_data.followers} followers.`);
    }
    else{
        bot.sendMessage(chatId,"Couldn't find this user. Try some other user.");
    }    
});

bot.onText(/\/following/, (msg) => {
    const chatId = msg.chat.id;
    if(user_data != null){
        bot.sendMessage(chatId, `User is following ${user_data.following} people.`);
    }
    else{
        bot.sendMessage(chatId,"Couldn't find this user. Try some other user.");
    }    
});

bot.onText(/\/location/, (msg) => {
    const chatId = msg.chat.id;
    if(user_data != null){
        if(user_data.location != null){
            bot.sendMessage(chatId,`User's location is ${user_data.location}.`);
        }
        else{
            bot.sendMessage(chatId,"User has not provided any location.");
        }
    }
    else{
        bot.sendMessage(chatId,"Couldn't find this user. Try some other user.");
    }    
});
bot.onText(/\/bio/, (msg) => {
    const chatId = msg.chat.id;
    if(user_data != null){
        if(user_data.bio != null){
            bot.sendMessage(chatId,`${user_data.bio}.`);
        }
        else{
            bot.sendMessage(chatId,"User has not provided any bio.");
        }
    }
    else{
        bot.sendMessage(chatId,"Couldn't find this user. Try some other user.");
    }    
});

bot.onText(/\/avatar/, (msg) => {
    const chatId = msg.chat.id;
    if(user_data != null){
        if(user_data.avatar_url != null){
            bot.sendMessage(chatId,`You can find user's avatar at ${user_data.avatar_url}`);
        }
        else{
            bot.sendMessage(chatId,"User has not provided any avatar.");
        }
    }
    else{
        bot.sendMessage(chatId,"Couldn't find this user. Try some other user.");
    }    
});

bot.onText(/\/company/, (msg) => {
    const chatId = msg.chat.id;
    if(user_data != null){
        if(user_data.company != null){
            bot.sendMessage(chatId,`User's company is ${user_data.company}.`);
        }
        else{
            bot.sendMessage(chatId,"User has not provided any company.");
        }
    }
    else{
        bot.sendMessage(chatId,"Couldn't find this user. Try some other user.");
    }    
});

function most_starred(){
    const LIMIT = 10;
        const sortProperty = 'stargazers_count';
        const mostStarredRepos = repo_data
            .filter(repo => !repo.fork)
            .sort((a, b) => b[sortProperty] - a[sortProperty])
            .slice(0, LIMIT);
        var resp = "";
        mostStarredRepos.forEach((repo => {
            if(repo[sortProperty] !== 0){
                resp += (repo.name + ": "+ repo[sortProperty]+"\n");
            }
        }));
        return resp;
}

bot.onText(/\/most_starred/, (msg) => {
    const chatId = msg.chat.id;
    if(repo_data != null){
        var resp = most_starred();
        if(resp.localeCompare("") === 0){
            bot.sendMessage(chatId,"User does not have any starred repositories.");
        }
        else{
            resp = "Most starred repos with number of stars: \n" + resp;
            bot.sendMessage(chatId,resp);
        }
        
    }
    else{
        fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
            .then(response => {
                if (response.status === 404) {
                return setError({ active: true, type: 404 });
                }
                if (response.status === 403) {
                return setError({ active: true, type: 403 });
                }
                return response.json();
            })
            .then(json => {
                repo_data = json;
                if(repo_data != null){
                    var resp = most_starred();
                    if(resp.localeCompare("") === 0){
                        bot.sendMessage(chatId,"User does not have any starred repositories.");
                    }
                    else{
                        resp = "Most starred repos with number of stars: \n" + resp;
                        bot.sendMessage(chatId,resp);
                    }
                }
                else{
                    bot.sendMessage(chatId,"User has no repositories that are starred.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
        });
    }    
});


bot.onText(/\/commands_list/, (msg) => {
    const chatId = msg.chat.id;
    var resp = "The list of commands with their functionality: \n";
    resp += "/start : To start the bot\n";
    resp += "/user username : Fetches the user data\n";
    resp += "/all_reps : Returns names of all the user's public repositories\n";
    resp += "/name : Returns user's name\n";
    resp += "/joining_date : Returns user's joining date\n";
    resp += "/followers : Returns number of followers of the user\n";
    resp += "/following : Returns number of people the user is following\n";
    resp += "/location : Returns user's location\n";
    resp += "/bio : Returns user's bio\n";
    resp += "/avatar : Returns user's avatar\n";
    resp += "/company : Returns user's company\n";
    resp += "/most_starred : Returns user's top 10 starred repositories\n";
    bot.sendMessage(chatId,resp);
});