
var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    alexa.dynamoDBTableName = 'sampleLanguageTable'; // creates new table for session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function() { //Executes when a new session is launched
      console.log(this.attributes);
        if (!this.attributes['myLangauge']) {
            this.emit('LaunchIntent');
        } else {
            this.emit('TestIntent');
        }
    },

    'LaunchIntent': function() {
        this.emit(':ask', "Hi, what is your language?");
    },

    'LanguageIntent': function() {
        this.attributes['myLangauge'] = this.event.request.intent.slots.myLangauge.value;
        this.emit(':ask', "I got it.");
    },

    'TestIntent': function() {
        this.emit(':tell', "I still remember that your language is, " + this.attributes['myLangauge']);
    }
};
