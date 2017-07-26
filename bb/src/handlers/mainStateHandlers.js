var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');


var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function () {
    let speechOutput = "Can I interest you with something from the 303 Bar? We have beer, wine, and whiskey."
    let reprompt = "What would you like to drink? Beer, wine, or whiskey?";
    this.emit(':ask', speechOutput, reprompt);
  },

  'DrinkIntent': function(){
    var drink = this.event.request.intent.slots.Drink.value;
    var time = new Date;
    var hour = time.getHours();

    if(drink === 'Wine'){
      this.emit(':ask', "Ask Liza if she has enough to spare, she likes to drink her feelings. Will you be drinking alone?");
    }
    else if(drink === "Whiskey" && hour  < 13){
      this.emit(':tell', `Hmmmmm... It's ${hour} o’clock, are you sure you want to start with whiskey? Blackbelt has tried this before, their data shows that bad decisions only lead to more bad decisions.`);
    }
    else if(drink === "Whiskey" && hour > 12){
      this.emit(':ask', "You clearly have good taste, I will send an email to Grant asking him to pour you one of his favorites. Will you be drinking alone?");
    }
    else if(drink === "Beer" && hour < 14){
      let remainder = 14 - hour;
      this.emit(':ask', `Beer o’clock is not for another ${remainder} hours, but we celebrate original thinking here at Blackbelt, you are obviously one of us. Will you be drinking alone?`);
    }
    else if (drink === "Beer" && hour > 13){
      this.emit(':ask', "Excellent choice, it’s important to stay hydrated throughout the day. Are you drinking alone?");
    }
  },

  'AMAZON.HelpIntent': function () {
    let speechOutput = "Can I interest you with something from the 303 Bar? We have beer, wine, and whiskey.";
    let reprompt = "What would you like to drink? We have beer, wine, and whiskey";
    this.emit(':ask', speechOutput, reprompt);
  },

  'AMAZON.CancelIntent': function () {
    let speechOutput = "Goodbye";
    this.emit(':tell', speechOutput);
  },

  'AMAZON.StopIntent': function () {
    let speechOutput = "Goodbye";
    this.emit(':tell', speechOutput);
  },

  'YesIntent': function(){
    this.emit(':tell',"Let me help you with that.");
  },

  'NoIntent': function(){
    this.emit(':tell', "I like where this is going.");
  }

});
