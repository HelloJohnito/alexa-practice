"use strict";
var Alexa = require('alexa-sdk');

var APP_ID = undefined;
var speechOutput;
var reprompt;

var handlers = {
  'LaunchRequest': function(){
    var welcomeOutput = "Welcome to demo. Please state a command.";
    var welcomeReprompt = "Please state a command.";
    this.emit(':ask', welcomeOutput, welcomeReprompt);
  },

  // Alexa, ask demo practice ""
  'FeelingsIntent': function(){
    var feeling = this.event.request.intent.slots.feelings.value;

    switch(feeling){
      case "happy":
        speechOutput = "I am glad you are feeling happy";
        break;
      case "good":
        speechOutput = "I am glad you are feeling good";
        break;
      case "excited":
        speechOutput = "I am glad you are feeling excited";
        break;
      default:
        speechOutput = "Sorry Invalid. Please try again.";
        break;
    }
    this.emit(":tell", speechOutput);
  },

  'NameIntent': function(){
    var name = this.event.request.intent.slots.name.value;

    var cardTitle = name;
    var cardContent = "this is the card content";

    var imageObj = {
        smallImageUrl: 'https://s3.amazonaws.com/tsatsatzu-public/images/test_lg.png',
        largeImageUrl: 'https://s3.amazonaws.com/tsatsatzu-public/images/test_sm.png'
    };

    switch(name.toLowerCase()){
      case "john":
        speechOutput = "John is an Engineer";
        break;
      case "aaron":
        speechOutput = "Aaron is a student";
        break;
      case "bob":
        speechOutput = "Bob is a cook";
        break;
      default:
        speechOutput = "Invalid";
        break;
    }

    this.emit(":tellWithCard", speechOutput, cardTitle, cardContent, imageObj);
  },

  'AMAZON.HelpIntent': function () {
      speechOutput = "";
      reprompt = "";
      this.emit(':ask', speechOutput, reprompt);
  },

  'AMAZON.CancelIntent': function () {
      speechOutput = "";
      this.emit(':tell', speechOutput);
  },

  'AMAZON.StopIntent': function () {
      speechOutput = "";
      this.emit(':tell', speechOutput);
  },
};

exports.handler = function (event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
