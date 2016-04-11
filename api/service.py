from app import app
import controllers
import logging
from apscheduler.schedulers.background import BackgroundScheduler

# all tasks
import tasks.extract_tags

# configuration
if not app.config["APP_DEBUG"]:
  app.logger.setLevel(logging.INFO)
  formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
  handler = logging.StreamHandler()
  handler.setFormatter(formatter)
  app.logger.addHandler(handler)

# start service
scheduler = BackgroundScheduler()
scheduler.add_job(tasks.extract_tags.run, 'cron', minute=0, hour=1)
app.run(host='0.0.0.0', debug=app.config["APP_DEBUG"], port = app.config["PORT"])

