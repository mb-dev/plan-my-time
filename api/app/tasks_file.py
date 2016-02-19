import os,sys
import parsers.tasks_parser as tasks_parser

home = os.path.expanduser("~")
FILE_PATH = home + '/Dropbox/Apps/time-service/'

def get_full_path(date_str):
  return FILE_PATH + date_str + '.md'

def read_tasks_file(date_str):
  try:
    with open(get_full_path(date_str)) as x:
      return x.readlines()
  except FileNotFoundError as e:
    return ''

def write_content_to_file(date_str, content):
  with open(get_full_path(date_str), "w") as text_file:
    text_file.write(content)


class TasksFile:
  def __init__(self, date_str):
    self.date_str = date_str
    self.content = read_tasks_file(date_str)
    self.manager = tasks_parser.TasksParser(date_str, self.content)

  #def read(self):
   
  def content(self):
    if not self.content:
      self.read()
    return self.content

  #def add_line(time, message):

