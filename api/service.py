from app import app
import controllers
import logging

app.logger.setLevel(logging.INFO)
app.run(debug = app.config["APP_DEBUG"], port = app.config["PORT"])
