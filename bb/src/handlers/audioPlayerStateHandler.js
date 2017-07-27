var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Data
var musicData = require('../data/musicData');


var audioPlayerHandlers = Alexa.CreateStateHandler(constants.states.AUDIO_PLAYER, {

  'LaunchRequest': function () {
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

// Start Playing Music
  'SongIntent': function(){
    var alone = this.attributes['alone'];
    var type = (alone) ? 'party' : 'sad';
    var index = 0;
    var song = musicData[type][index];

    if(song){
      // save to session
      this.attributes['type'] = type;
      this.attributes['index'] = 0;
      this.attributes['offsetInMilliseconds'] = 0;

      // OutSpeech
      var outputSpeech = (alone) ? "I like where this is going." : "Let me help you with that.";
      this.response.speak(outputSpeech);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', song.url, index, null, 0);
      // this.response.audioPlayerPlay(playBehavior, url, token, expectedPreviousToken, milliseconds);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
    else {
      var outputSpeech = `I was going to play a music for you but something went wrong... Sorry.`;
      this.emit(':tell', outputSpeech);
    }
  },


// Audio Control Intents - Intent Request Handlers
  'AMAZON.PauseIntent': function () {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
    // this.handler.state = constants.states.ONBOARDING;
    // this.emitWithState('LaunchRequest');
  },
  'AMAZON.CancelIntent': function () {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },
  'AMAZON.ResumeIntent': function () {
    // Get Audio Player Session Attributes
    var index = this.attributes['index'];
    var song = musicData[this.attributes['type']][index];
    var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];

    // Audio Directive
    this.response.audioPlayerPlay('REPLACE_ALL', song.url, index, null, offsetInMilliseconds);

    // Build Response and Send to Alexa
    this.emit(':responseReady');
  },
  'AMAZON.NextIntent': function () {
  },

  'AMAZON.PreviousIntent': function () {
  },

  'AMAZON.RepeatIntent': function () {
    // Get Audio Player Session Attributes
    var songs = musicData[this.attributes['genre']][this.attributes['key']];
    var index = this.attributes['index'];
    var currentSong = songs[index];

    // Audio Directive
    this.response.audioPlayerPlay('REPLACE_ALL', currentSong.url, index, null, 0);
    // Build Response and Send to Alexa
    this.emit(':responseReady');
  },

  'AMAZON.StartOverIntent': function () {
    this.emitWithState('AMAZON.RepeatIntent');
  },


  'AMAZON.HelpIntent': function () {
    var audioHelpMessage = "";
    this.emit(':ask', audioHelpMessage, audioHelpMessage);
  },


// Audio Event Handlers - AudioPlayer Request Handlers
  'PlaybackStarted': function () {
    this.attributes['index'] = parseInt(this.event.request.token);
    this.attributes['offsetInMilliseconds'] = parseInt(this.event.request.offsetInMilliseconds);
    this.emit(':saveState', true);
  },
  'PlaybackFinished': function () {
    //Play Next Song
    // this.emitWithState('AMAZON.NextIntent');
    this.emit(':tell', "Goodbye");
  },
  'PlaybackStopped': function () {
    this.attributes['index'] = parseInt(this.event.request.token);
    this.attributes['offsetInMilliseconds'] = parseInt(this.event.request.offsetInMilliseconds);
    this.emit(':saveState', true);
  },
  'PlaybackFailed': function () {
    console.log('Player Failed: ', this.event.request.error);
    this.context.succeed(true);
  },

  // Unhandled Function - Handles Optional Audio Intents Gracefully
  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  },

});

module.exports = audioPlayerHandlers;
