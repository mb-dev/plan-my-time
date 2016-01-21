from config import ConfigClass
from flask import Flask
from flask.ext.cors import CORS
import lib.mongo as mongo
app = Flask(__name__)
app.config.from_object(__name__+'.ConfigClass')
CORS(app)
