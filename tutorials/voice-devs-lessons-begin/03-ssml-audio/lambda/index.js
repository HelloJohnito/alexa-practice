var Alexa = require('alexa-sdk');

// Data
var alexaMeetups = require('./data/alexaMeetups');

// Helpers
var convertArrayToReadableString = require('./helpers/convertArrayToReadableString');

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var handlers = {
  //ALexa looks for the new tag inside the response
  'NewSession': function(){
    this.emit(":ask", "Welcome to the Voice Dev. What is your name?", "How can I help you?");
  },

  'NameCapture': function(){
    var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
    var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;

    var name;
    if(USFirstNameSlot){
      name = USFirstNameSlot;
    } else if(UKFirstNameSlot){
      name = USFirstNameSlot;
    }

    // Save Name in Session attributes and Ask for Country
    if(name){
      this.attributes['userName'] = name;
      this.emit(":ask", `Ok ${name}, what country are you from?`);
    }
    else {
      this.emit(":ask", "Sorry I did not recognize that name.");
    }

  },

  'CountryCapture': function(){
    var country = this.event.requst.intent.slots.Country.value;

    //Get User Name from the session Attributes
    var userName = this.attribute['userName'];

    // Save Country Name in session Attribute and Ask for Favorite Programming Language.
    if(country){
      this.attribute['userCountry'] = country;
      this.emit(":ask", `Your country is ${country}`)
    }
    else {
      this.emit(":ask", "I did not get that.")
    }

  },

  'AlexaMeetupNumbers': function () {
    var meetupNumbers = alexaMeetups.length;
    this.emit(':ask', `There are currently ${meetupNumbers} Alexa developer meetups. Check to see if your city is one of them!`);
  },

  'AlexaMeetupCityCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Get City
    var city;
    if (USCitySlot) {
      city = USCitySlot;
    } else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    } else {
      this.emit(':ask', 'Sorry, I didn\'t recognise that city name.');
    }

    var cityMatch = '';
    // Check for City
    for (var i = 0; i < alexaMeetups.length; i++) {
      if ( alexaMeetups[i].city.toLowerCase() === city.toLowerCase() ) {
        cityMatch = alexaMeetups[i].city;
      }
    }

    // Add London Audio
    var londonAudio = ``;
    if (city.toLowerCase() === 'london') {
      londonAudio = `<audio src="https://s3-eu-west-1.amazonaws.com/voice-devs/london-baby.mp3">`;
    }

    // Respond to User
    if (cityMatch !== '') {
      this.emit(':ask', `${londonAudio} Yes! ${city} has an Alexa developer meetup!`);
    } else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one!`);
    }

  },

  'AlexaMeetupOrganiserCheck': function () {
    // Get Slot Values
    var USCitySlot = this.event.request.intent.slots.USCity.value;
    var EuropeanCitySlot = this.event.request.intent.slots.EuropeanCity.value;

    // Get City
    var city;
    if (USCitySlot) {
      city = USCitySlot;
    } else if (EuropeanCitySlot) {
      city = EuropeanCitySlot;
    } else {
      this.emit(':tell', 'Sorry, I didn\'t recognise that city name.');
    }

    var cityMatch = '';
    var cityOrganisers;
    // Check for City
    for (var i = 0; i < alexaMeetups.length; i++) {
      if ( alexaMeetups[i].city.toLowerCase() === city.toLowerCase() ) {
        cityMatch = alexaMeetups[i].city;
        cityOrganisers = alexaMeetups[i].organisers;
      }
    }

    // Add London Audio
    var londonAudio = ``;
    if (city.toLowerCase() === 'london') {
      londonAudio = `<audio src="https://s3-eu-west-1.amazonaws.com/voice-devs/london-baby.mp3" />`;
    }

    // Respond to User
    if (cityMatch !== '') {
      // 1 Organiser
      if (cityOrganisers.length === 1) {
        this.emit(':ask', `${londonAudio} The organiser of the ${city} Alexa developer meetup is ${cityOrganisers[0]}.`);
      }  else { // Multiple Organisers
        this.emit(':ask', `The organisers of the ${city} Alexa developer meetup are: ${convertArrayToReadableString(cityOrganisers)}`);
      }
    } else {
      this.emit(':ask', `Sorry, looks like ${city} doesn't have an Alexa developer meetup yet - why don't you start one!`);
    }

  }


};
