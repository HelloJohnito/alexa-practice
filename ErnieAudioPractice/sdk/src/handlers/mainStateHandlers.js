var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Data
var musicData = require('./data/musicData');


var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function () {
    this.emit(':ask', "Welcome to Ernie Ball's Jamming Session. What genre of music do you want to play and in what key?");
  },


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

    this.attributes['genre'] = genre;
    this.attributes['key'] = key;
    this.handler.state = constants.states.AUDIO_PLAYER;
    this.emitWithState('PlaySong');
  }

});
