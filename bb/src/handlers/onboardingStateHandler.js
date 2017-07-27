var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');


var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING,{

  'NewSession': function () {
      this.handler.state = constants.states.MAIN;
      this.emitWithState('LaunchRequest');
    },

  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'Goodbye!');
  },

  'SessionEndedRequest': function () {
    // Force State to Save when the user times out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', 'Please try again.');
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  }
});


module.exports = onboardingStateHandlers;
