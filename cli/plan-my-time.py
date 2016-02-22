#!/usr/bin/env python3.5

import os
import sys
import shutil

script_path = __file__
if os.path.islink(__file__):
  script_path = os.path.realpath(script_path)

sys.path.insert(0, os.path.join(os.path.dirname(script_path), "../api"))

import click
import lib.date_helpers as date_helpers
import app.tasks_file as tasks_file

today_file_name = date_helpers.today_str() + '.md'
today_full_path = tasks_file.FILE_PATH + today_file_name
template_path   = tasks_file.FILE_PATH + 'template.md'

def get_file_content():
  try:
    with open(todaytoday_full_path) as x:
      content = x.readlines()
  except FileNotFoundError as e:
    content = ''
  return content


@click.group()
def cli():
  pass

@cli.command()
@click.argument('title', nargs=-1)
def start(title):
  tasksFile = tasks_file.TasksFile(date_helpers.today_str())
  content = get_file_content()
  time_now = date_helpers.time_now_aprox()
  title = ''.join(list(filter(None, list(title))))
  content = content + "\n" + '- ' + time_now + ' ' + title
  write_content_to_file(content)

@cli.command()
def init():
  if os.path.isfile(today_full_path):
    print("file {0} already exists".format(today_file_name))
    return

  if not os.path.isfile(template_path):
    print("Template file is not found")
    return

  shutil.copy(template_path, today_full_path)
  print("success!")

def main():
  cli()

if __name__ == '__main__':
  main()
