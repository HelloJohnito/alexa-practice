var Alexa = require('alexa-sdk');

var alexaMeetups = require('./data/alexaMeetups');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {

  'LaunchRequest': function () {
    this.emit(':ask', 'Welcome to Voice Devs!', 'Try saying hello!');
  },

  'HelloIntent': function (){
    this.emit(':tell', 'Hi there!');
  },

  'AlexaMeetupNumbers': function(){
    var meetupNumbers = alexaMeetups.length;
    this.emit(":ask", `There are ${meetupNumbers}.`, "How can I help you?");
  }

};
