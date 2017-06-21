var randomFacts = {
  fun: {
    fact: "funny stuff"
  },
  movie: {
    fact: "The best movie is...."
  },
  sports: {
    fact: "Warriors won the 2017 championship"
  },
  science: {
    fact: "Science"
  }
};

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    // if (event.session.application.applicationId !== "") {
    //     context.fail("Invalid Application ID");
    //  }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
  getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if(intentName === "RandomIntent"){
      handleRandomFactResponse(intent, session, callback)
    }
    else if("AMAZON.YesIntent"){
      handleYesResponse(intent, session, callback)
    }
    else if("AMAZON.NoIntent"){
      handleNoResponse(intent, session, callback)
    }
    else if("AMAZON.HelpIntent"){

    }
    else if("AMAZON.StopIntent"){

    }
    else if("AMAZON.CancelIntent"){

    }
    else {
      throw "Invalid intent"
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
  var speechOutput = "Welcome to Random Facts. Choose a topic:" +
  "Fun, Movie, Sports, Science.";

  var reprompt = "Which topic?";
  var header = "Random Facts";
  var shouldEndSession = false;

  var sesstionAttributes = {
    "speechOutput": speechOutput,
    "repromptText": reprompt
  }

  callback(sesstionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function handleRandomFactResponse(intent, session, callback){
  var category = intent.slots.Category.value.toLowerCase();

  if(!randomFacts[category]){
    var speechOutput = "Category does not exists";
    var reprompText = "Try again";
    var header = "Not valid";
  }
  else {
    var fact = randomFacts[category].fact;
    var speechOutput = capitalizeFirst(category) + " " + fact + " " + "Do you want to hear another?";
    var repromptText = " Do you want to hear another fact?";
    var header = capitalizeFirst(category);
  }

  var shouldEndSession = false;

  callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}


function handleYesResponse(intent, session, callback){
  var speechOutput = "Great! Please choose a category";
  var repromptText = speechOutput;
  var shouldEndSession = false;

  callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))
}


function handleNoResponse(intent, session, callback){

}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function capitalizeFirst(s){
  return s[0].toUpperCase()+ s.slice(1);
}
