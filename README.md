[![Build Status](https://travis-ci.org/mb-dev/plan-my-time.svg?branch=master)](https://travis-ci.org/mb-dev/plan-my-time/)

# About Plan My Time
Plan My Time is a is free, open-source time management app built in React/Python.

The main goal of the application is to be able to assist with tracking of short repeat tasks.
Examples:
- Doing Yoga for 10 minutes every day
- Working on side project for an hour a week
- Writing a blog post for 30 minutes a day.

Tracking which task got it's allotted time during the week can be a challenge that this app aims to solve.

***This is still a work in progress.***

## Architecture

React Client <-> Python API Server       <-> Dropbox
             <-> Node.JS Static Server

The main data source in the app is a "day journal" which records which tasks got done at which time.

Example:
```
- 7am #wakeup
- 1pm #lunch with @steve-lee at $blue-bottle
- 2:15pm #yoga
- 11pm #sleep
```

These day journals are stored as markdown files in dropbox with a file name date.md.

Internally those files are converted to json journal files, that contain #tags, $locations and @people.

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
