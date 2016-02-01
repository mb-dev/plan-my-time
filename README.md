[![Build Status](https://travis-ci.org/mb-dev/plan-my-time.svg?branch=master)](https://travis-ci.org/mb-dev/plan-my-time/)

# About Plan My Time
Plan My Time is a is an open-source time management app built in React/Python. Just like Mint manages money, with this app you record time spent per category and get a report at the end of the period.

***This is still a work in progress.***

## Architecture

React Client <-> Python API Server       <-> Dropbox
Browser      <-> Node.JS Static Server

The main data source in the app is a daily activity journal which records which tasks got done at which time.

Example:
```
- 7am #wakeup
- 1pm #lunch with @steve-lee at $blue-bottle
- 2:15pm #yoga
- 11pm #sleep
```

These day journals are stored as markdown files in dropbox with a file name date.md.

Internally those files are converted to json journal files, that contain #tags, $locations and @people.

## Metrics
Task tags are counted on a monthly basis.

```
[
  {tag: 'yoga', day: 600, week: 4200, month: 16800}
]
```

## Break notification
Version 1 allows turning on break notifications at predefined interval. There will be notification every 10 minutes and then every :50 minutes a special "take a break notification"

## API

### GET /journal?date=YYYY-MM-DD
Retrieves the markdown file from dropbox and returns it.

### POST /journal
{text: 'content here', date: 'YYYY-MM-DD'}
Updates the markdown file on dropbox with new journal

### GET /journal/metadata
Summarizes all journals (TODO: limit to a time period) and return JSON metadata. Also contains summary of time spent per #tag.

## Installation
To play with this, make sure you have the prerequisites installed:
- Python 3 with virtualenv
- MongoDB

Then clone the repository and run:
```
npm install
cd api
virtualenv env
source env/bin/activate
pip install -r requirements.txt
cd ..
gulp dev
```
