var Alexa = require('alexa-sdk');

// Constants
var constants = require('./constants/constants');

// Handlers
var onboardingStateHandler = require('./handlers/onboardingStateHandler');
var mainStateHandler = require('./handlers/mainStateHandler');
var audioPlayerStateHandler = require('./handlers/audioPlayerStateHandler');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.appId = constants.appId;
  alexa.dynamoDBTableName = constants.dynamoDBTableName;

  alexa.registerHandlers(
    onboardingStateHandler,
    mainStateHandler,
    audioPlayerStateHandler
  );

  alexa.execute();
};
