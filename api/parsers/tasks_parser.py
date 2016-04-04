import re
import datetime
from dateutil import parser
import lib.date_helpers as date_helpers

timeRegex = re.compile(r'([0-9:]+(am|pm)?)')
peopleRegex = re.compile(r'@([\w-]+)')
tagRegex = re.compile(r'#([\w-]+)')
locationRegex = re.compile(r'\$([\w-]+)')

def convert_line_to_task(time, line):
  people = peopleRegex.findall(line)
  tags = tagRegex.findall(line)
  locations = locationRegex.findall(line)
  return {
    "start_time": str(time),
    "duration": None,
    "line": line,
    "comment":'',
    "people": people,
    "tags": tags,
    "locations": locations}

def update_durations(tasks):
  last_date = None

  for idx, task in enumerate(tasks):
    task_date = date_helpers.parse_datetime_str(task["start_time"])
    if last_date is not None:
      duration = task_date - last_date
      tasks[idx-1]["duration"] = duration.seconds
    last_date = task_date


class TasksParser:
  def __init__(self, date_str, content):
    self.date_str = date_str
    self.content = content
    self.tags = []
    self.people = []
    self.locations = []
    self.tasks = []
    self.header = ''

    # parse
    lines = content.split('\n')
    last_comment = ''
    last_date = None
    for line in lines:
      # lines that don't start with - are comments to the previous line, or headers.
      if not line.startswith('-'):
        last_comment = last_comment + line + "\n"
        continue
      time = timeRegex.search(line)
      if time is None:
        continue
      time = time.group(0)
      if not time.endswith('am') and not time.endswith('pm'):
        time += 'am'
      try:
        time = parser.parse(date_str + ' ' + time)
        time_parsed = str(time)
      except ValueError:
        continue

      # check if the current date is before the previous date
      if last_date and time < last_date:
        raise(ValueError("Invalid file, date is going backwards"))

      duration = None
      if last_date is None:
        self.header = last_comment;
      else:
        self.tasks[-1]["comment"] = last_comment
        last_comment = ''

      last_date = time
      new_task = convert_line_to_task(time, line)
      self.people += new_task["people"]
      self.tags += new_task["tags"]
      self.locations += new_task["locations"]
      self.tasks.append(new_task)
    update_durations(self.tasks)

  def add_line(self, time, line):
    pos = len(self.tasks)
    for idx, task in enumerate(self.tasks):
      task_date = date_helpers.parse_datetime_str(task["start_time"])
      if task_date > time:
        pos = idx
        break
    line = date_helpers.time_aprox(time) + ' ' + line
    self.tasks.insert(pos, convert_line_to_task(time, line))
    update_durations(self.tasks)

  def to_tasks_file(self):
    content = self.header
    for task in self.tasks:
      content += task["line"] + "\n"
      content += task["comment"]
    return content

  def to_dict(self):
    return {
      "date": self.date_str,
      "people": self.people,
      "tags": self.tags,
      "locations": self.locations,
      "tasks": self.tasks
    }

  # summerize the metadata relative to date.
  # metadata should contain only elements that are in the same month as date
  @staticmethod
  def summerize(metadata_arr, date):
    def summerize_task_item(task, metadata_date, key, val):
      if val not in summary[key]:
        summary[key][val] = {"day": 0, "week": 0, "month": 0}

      if date_helpers.is_same_week(date, metadata_date):
        summary[key][val]["week"] += task["duration"]

      if date_helpers.is_same_day(date, metadata_date):
        summary[key][val]["day"] += task["duration"]

      summary[key][val]["month"] += task["duration"]

    summary = {'tags': {}, 'people': {}}
    for metadata in metadata_arr:
      if not "tasks" in metadata:
        continue
      metadata_date = date_helpers.parse_date_str(metadata["date"])
      for task in metadata["tasks"]:
        if task["duration"] is None:
          continue
        for tag in task["tags"]:
          summerize_task_item(task, metadata_date, 'tags', tag)
        for person in task["people"]:
          summerize_task_item(task, metadata_date, 'people', person)
    return summary
