from app import app
import controllers

app.run(debug = app.config["APP_DEBUG"], port = app.config["PORT"])
