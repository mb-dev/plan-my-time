import re
from dateutil import parser

timeRegex = re.compile(r'([0-9:](am|pm))')
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
    for line in lines:
      if line.startswith('-'):
        time = timeRegex.search(line).group(0)
        time_parsed = str(parser.parse(datestr + ' ' + time))
        people = peopleRegex.findall(line)
        self.people += people
        tags = tagRegex.findall(line)
        self.tags += tags
        locations = locationRegex.findall(line)
        self.locations += locations
        self.tasks.append({"start_time": time_parsed, "duration": None, "line": line})

  def to_dict():
    {
      "people": self.people,
      "tags": self.tags,
      "locations": self.locations,
      "tasks": self.tasks
    }
