# Time Service

Provide time tracking services

## Main functions

### Tasks
GET /time-tracking/tasks/2015-01-01
0: 1pm dinner with #friend

POST /time-tracking/tasks/2015-01-01
1pm dinner with #friend

### People
GET /time-tracking/people/friend
{
  results: 1000,
  tasks: [
    {date: 2015-01-01, time: 13:00:00, duration: 30, raw: '1pm dinner with #friend'}
  ]
}

### Goals
