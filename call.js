require('dotenv').config();
var restify = require('restify');
var builder = require('botbuilder-calling');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create calling bot
var connector = new builder.CallConnector({
    callbackUrl: 'https://031b69b2.ngrok.io/api/calls',
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
//var bot = new builder.UniversalCallBot(connector);

var bot = new builder.UniversalCallBot(connector);

server.post('/api/calls', connector.listen());

// Add root dialog
//bot.dialog('/', function (session) {
    //session.send('Watson... come here!');
//});

bot.dialog('/', [
    function (session) {
        builder.Prompts.confirm(session, "Hi! Do you want it?");
    },
    function (session, results) {
        if (results && results.response) {
            // User answered question.
		console.log(results.response);
            session.send("You confirmed %s.", results.response);
        } else {
            // User said nevermind.
            session.send("OK. Goodbye.");
        }
    }
]);
