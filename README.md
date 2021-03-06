[ ![Codeship Status for mb-dev/plan-my-time](https://codeship.com/projects/ca5bd430-a3a3-0133-00d6-3641d785a31d/status?branch=master)](https://codeship.com/projects/129305)

# About Plan My Time
Plan My Time is a is an open-source time management app built in React/Python. 
Just like Mint manages money, this app allows recording time spent per category and get a monthly report of where time was spent.

## Architecture

React Client <-> Python API Server       <-> Dropbox
Browser      <-> Node.JS Static Server   <-> MongoDB

The main data source is a **daily activity journal** written in Markdown stored in Dropbox. Daily journal looks like this:
```markdown
- 7am #wakeup
- 1pm #lunch with @steve-lee at $blue-bottle
- 2:15pm #yoga
- 11pm #sleep
```

- Each day journal is stored in a file [date].md, Example: 2016-03-20.md. 
- Metadata parsed from the journal files are stored in MongoDB. The json representation contain #tags, $locations and @people as a list.

## Metrics
Task tags are counted on a monthly basis.
```json
[
  {tag: 'yoga', day: 600, week: 4200, month: 16800}
]
```

## Break notification
Version 1 allows turning on break notifications at predefined interval. 
There will be notification every 10 minutes and then every :50 minutes a special "take a break notification"

## API

### GET /journal?date=YYYY-MM-DD
Retrieves the markdown file from dropbox and returns it.

### POST /journal
{text: 'content here', date: 'YYYY-MM-DD'}
Updates the markdown file on dropbox with new journal

### GET /journal/metadata
Summarizes all journals (TODO: limit to a time period) and return JSON metadata. Also contains summary of time spent per #tag.

## Installation
To use locally, make sure you have the prerequisites installed:
- Python 3.5.1 with pyenv and pyenv-virtualenv
- MongoDB

Clone the repository and run:
```bash
npm install
pyenv install 3.5.1
pyenv virtualenv 3.5.1 plan-my-time-3.5
cd ..
cd plan-my-time
```
You should see a message: "pyenv-virtualenv: activate plan-my-time-3.5"
```bash
cd api
pip install -r requirements.txt
cd ..
gulp dev
```
