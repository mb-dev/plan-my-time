from config import ConfigClass
from flask import Flask
from flask.ext.cors import CORS
app = Flask(__name__)
app.config.from_object(__name__ + '.ConfigClass')
CORS(app, allow_headers=['Authorization', 'Content-Type'])
