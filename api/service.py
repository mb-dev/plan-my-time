from app import app
import controllers
import logging

if not app.config["APP_DEBUG"]:
  app.logger.setLevel(logging.INFO)
  formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
  handler = logging.StreamHandler()
  handler.setFormatter(formatter)
  app.logger.addHandler(handler)

app.run(debug = app.config["APP_DEBUG"], port = app.config["PORT"])

