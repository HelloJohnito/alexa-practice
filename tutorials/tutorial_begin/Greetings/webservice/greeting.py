from flask import Flask
from flask import request
from flask import make_response
import json
import datetime


app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/alexa_end_point', methods=['POST'])
def alexa():
    event = request.get_json()
    req = event['request']

    if req['type'] == 'LaunchRequest':
        return handle_launch_request()

    elif req['type'] == 'IntentRequest':
        if req['intent']['name'] == 'HelloIntent':
            return handle_hello_intent(req)
        else:
            return "", 400

    elif req['type'] == 'SessionEndedRequest':
        pass

def handle_launch_request():
    'Handles launch request and generates response'
    res = Response()
    res.speechText = 'Welcom to Greetings skill.'
    res.end_session = False
    return res.build_response()

def handle_hello_intent(req):
    'Handles hello intent and returns response'
    name = req['intent']['slots']['FirstName']['value']
    res = Response()
    res.speech_text = 'Hello {0}. Your name is spelled <say-as interpret-as="spell-out">{0}</say-as> .'.format(name)
    res.speech_text += get_wish()
    return res.build_response()

def get_wish():
    'Return good morning/after/evening'
    current_time = datetime.datetime.utcnow()
    hours = current_time.hour - 8
    if hours < 0:
        hours = 24 + hours

    if hours < 12:
        return 'Good morning. '
    elif hours < 18:
        return 'Good afternoon. '
    else:
        return 'Good Evening. '


class Response(object):
    'Alexa skill response object with helper functions'

    def __init__(self):
        self.speech_text = None
        self.reprompt_text = None
        self.end_session = True

    def build_response(self):
        'Builds alexa response and returns'
        fnl_response = {
            'version': '1.0',
            'response': {
                'outputSpeech' : {
                    'type': 'SSML',
                    'ssml': '<speak>' + self.speech_text + '</speak>'
                },
                'shouldEndSession': self.end_session
            }
        }
        if self.reprompt_text:
            fnl_response['response']['reprompt_text'] = {
                'outputSpeech' : {
                    'type': 'SSML',
                    'ssml': '<speak>' + self.reprompt_text + '</speak>'
                }
            }
        http_response = make_response(json.dumps(fnl_response))
        http_response.headers['Content-Type'] = 'application/json'
        return http_response
