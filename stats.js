// Dependencies
var GhPolyglot = require("gh-polyglot");

// Stats about git-stats
var user = new GhPolyglot("IonicaBizau/git-stats");


user.repoStats(function (err, stats) {
    console.log(err || stats);
});

user.userStats(function (err, stats) {
    console.log(err || stats);
});

