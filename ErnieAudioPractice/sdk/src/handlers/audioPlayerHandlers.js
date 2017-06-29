var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Data
var musicData = require('../data/musicData');


var audioPlayerHandlers = Alexa.CreateStateHandler(constants.states.AUDIO_PLAYER, {

  'LaunchRequest': function () {
    this.emit(':ask', "Welcome to Ernie Ball's Jamming Session. What genre of music do you want to play, and in what key?", "The options for genre are: blues, rock, and jazz. The options for keys are: a, g, c, d, and f.");
  },

// Start Playing Music
  'JamIntent': function(){
    var genre = this.event.request.intent.slots.Genre.value;
    var key = this.event.request.intent.slots.Key.value;

    if(!genre){
      genre = musicData.genres[Math.floor(Math.random() * musicData.genres.length)];
    }
    if(!key){
      key = musicData.keys[Math.floor(Math.random() * musicData.keys.length)];
    }
    key = key.toUpperCase();
    var songs = musicData[genre][key];
    var index = Math.floor(Math.random() * songs.length);
    var song = songs[index];

    if(song){

      // save to session
      this.attributes['genre'] = genre;
      this.attributes['key'] = key;
      this.attributes['index'] = index;
      this.attributes['offsetInMilliseconds'] = 0;

      // OutSpeech
      this.response.speak(`Playing ${songs[index].title}`);

      // Audio Directive
      this.response.audioPlayerPlay('REPLACE_ALL', song.url, index, null, 0);
      // this.response.audioPlayerPlay(playBehavior, url, token, expectedPreviousToken, milliseconds);

      // Build Response and Send to Alexa
      this.emit(':responseReady');
    }
    // Invalid genre or key
    else {
      this.emit(':ask', `Sorry, please try again. The options for genres are blues, rock, and jazz. The options for keys are a, g, c, d, and f. What would you like to jam to?`);
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
  },
  'AMAZON.CancelIntent': function () {
    this.response.audioPlayerStop();
    this.emit(':responseReady');
  },
  'AMAZON.ResumeIntent': function () {
    // Get Audio Player Session Attributes
    var songs = musicData[this.attributes['genre']][this.attributes['key']];
    var index = this.attributes['index'];
    var currentSong = songs[index];
    var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];

    // Audio Directive
    this.response.audioPlayerPlay('REPLACE_ALL', currentSong.url, index, null, offsetInMilliseconds);

    // Build Response and Send to Alexa
    this.emit(':responseReady');
  },

  'AMAZON.NextIntent': function () {
    // Get Audio Player Session Attributes
    var songs = musicData[this.attributes['genre']][this.attributes['key']];
    var index = this.attributes['index'];

    // If last song in the queue - Go to the front of the queue
    if (index === songs.length - 1) {
      index = 0;
      // this.attributes['index'] = 0; // why do we not set this?
    }
    // Play Next Episode
    else {
      index++;
    }

    var nextSong = songs[index];
    // Speech Output
    this.response.speak(`Now playing ${nextSong.title}.`);
    // Audio Directive
    this.response.audioPlayerPlay('REPLACE_ALL', nextSong.url, index, null, 0);
    // Build Response and Send to Alexa
    this.emit(':responseReady');
  },

  'AMAZON.PreviousIntent': function () {
    // Get Audio Player Session Attributes
    var songs = musicData[this.attributes['genre']][this.attributes['key']];
    var index = this.attributes['index'];

    // If firt song in the queue - Go to the end of the queue
    if (index === 0) {
      index = songs.length - 1;
    }
    // Play Previous Episode
    else {
      index--;
    }

    var previousSong = songs[index];
    // Speech Output
    this.response.speak(`Now playing ${previousSong.title}.`);
    // Audio Directive
    this.response.audioPlayerPlay('REPLACE_ALL', previousSong.url, index, null, 0);
    // Build Response and Send to Alexa
    this.emit(':responseReady');
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
    var audioHelpMessage = "You are jamming with Ernie Ball. You can say, next or previous to navigate through the songs. At any time, you can say pause to pause the audio and resume to resume.";
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
    this.emitWithState('AMAZON.NextIntent');
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
