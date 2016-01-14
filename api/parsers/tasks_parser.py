import re
import datetime
from dateutil import parser

timeRegex = re.compile(r'([0-9:]+(am|pm)?)')
peopleRegex = re.compile(r'@([\w-]+)')
tagRegex = re.compile(r'#([\w-]+)')
locationRegex = re.compile(r'\$([\w-]+)')

class TasksParser:
  def __init__(self, datestr, content):
    self.content = content
    self.tags = []
    self.people = []
    self.locations = []
    self.tasks = []

    # parse
    lines = content.split('\n')
    last_date = None
    for line in lines:
      if not line.startswith('-'):
        continue
      time = timeRegex.search(line)
      if time is None:
        continue
      time = time.group(0)
      if not time.endswith('am') and not time.endswith('pm'):
        time += 'am'
      try:
        time = parser.parse(datestr + ' ' + time)
        time_parsed = str(time)
      except ValueError:
        continue

      duration = None
      if last_date is not None:
        duration = time - last_date
        self.tasks[-1]["duration"] = duration.seconds
      last_date = time
      people = peopleRegex.findall(line)
      self.people += people
      tags = tagRegex.findall(line)
      self.tags += tags
      locations = locationRegex.findall(line)
      self.locations += locations
      self.tasks.append({
        "start_time": time_parsed,
        "duration": None,
        "line": line,
        "people": people,
        "tags": tags})

  def to_dict(self):
    return {
      "people": self.people,
      "tags": self.tags,
      "locations": self.locations,
      "tasks": self.tasks
    }

  @staticmethod
  def summerize(metadata_arr):
    tag_summary = {}
    for metadata in metadata_arr:
      for task in metadata["tasks"]:
        if task["duration"] is None:
          continue
        for tag in task["tags"]:
          if tag not in tag_summary:
            tag_summary[tag] = task["duration"]
          else:
            tag_summary[tag] += task["duration"]
    return tag_summary
