#!/usr/bin/env python3.5

import os,sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../api"))

import click
import lib.date_helpers as date_helpers

home = os.path.expanduser("~")
FILE_PATH = home + '/Dropbox/Apps/time-service/'
today = FILE_PATH + date_helpers.today_str() + '.md'

def get_file_content():
  try:
    with open(today) as x:
      content = x.readlines()
  except FileNotFoundError as e:
    content = ''
  return content

def write_content_to_file(content):
  with open(today, "w") as text_file:
    text_file.write(content)

@click.group()
def cli():
  pass

@cli.command()
@click.argument('title', nargs=-1)
def start(title):
  content = get_file_content()
  time_now = date_helpers.time_now_aprox()
  title = ''.join(list(filter(None, list(title))))
  content = content + "\n" + '- ' + time_now + ' ' + title
  write_content_to_file(content)

def main():
  cli()

if __name__ == '__main__':
  main()
