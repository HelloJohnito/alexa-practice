var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');


var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function () {
    let speechOutput = "Can I interest you with something from the 303 Bar? We have beer, wine, and whiskey.";
    let reprompt = "What would you like to drink? Beer, wine, or whiskey?";
    this.emit(':ask', speechOutput, reprompt);
  },

  'DrinkIntent': function(){
    var drink = this.event.request.intent.slots.Drink.value;
    var time = new Date;
    var hour = time.getHours();

    if(drink === 'wine'){
      this.emit(':ask', "Ask Liza if she has enough to spare, she likes to drink her feelings. Will you be drinking alone?");
    }
    else if(drink === "whiskey" && hour  <= 12){
      this.emit(':tell', `Hmmmmm... It's ${hour} o’clock, whiskey does not sound like a good idea. Blackbelt has tried this before, their data shows that bad decisions only lead to more bad decisions.`);
    }
    else if(drink === "whiskey" && hour > 12){
      this.emit(':ask', "You clearly have good taste, I will send an email to Grant asking him to pour you one of his favorites. Will you be drinking alone?");
    }
    else if(drink === "beer" && hour < 14){
      let remainder = 14 - hour;
      this.emit(':ask', `Beer o’clock is not for another ${remainder} hours, but we celebrate original thinking here at Blackbelt, you are obviously one of us. Will you be drinking alone?`);
    }
    else if (drink === "beer" && hour >= 14){
      this.emit(':ask', "Excellent choice, it’s important to stay hydrated throughout the day. Are you drinking alone?");
    }
    else {
      this.emit(':ask', "I did not recognize that drink. We have beer, wine, whiskey. What would you like?");
    }
  },

  'YesIntent': function(){
    // this.handler.state = constants.states.AUDIO_PLAYER;
    this.emit(':tell',"Let me help you with that.");
  },

  'NoIntent': function(){
    this.emit(':tell', "I like where this is going.");
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
  }

});

module.exports = mainStateHandlers;
