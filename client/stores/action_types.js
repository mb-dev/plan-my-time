const ActionType = {
  TASKS: {
    TEXT_CHANGED_FROM_SERVER: 'TEXT_CHANGED_FROM_SERVER',
    TEXT_UPDATE_SUCCESS: 'TEXT_UPDATE_SUCCESS',
    TEXT_UPDATED: 'TEXT_UPDATED',
    TEXT_UPDATING: 'TEXT_UPDATING',
    GET_METADATA: 'GET_METADATA',
    GET_REPORT_METADATA: 'GET_REPORT_METADATA',
    CHANGE_DATE: 'CHANGE_DATE',
    CURRENT_PERCENT_CHANGED: 'CURRENT_PERCENT_CHANGED',
    NEXT_TASK_CHANGED: 'NEXT_TASK_CHANGED',
    CURRENT_TASK_CHANGED: 'CURRENT_TASK_CHANGED',
    SERVER_ERROR: 'SERVER_ERROR',
    TAGS: 'TAGS',
  },
  DETAILS_PAGE: {
    ENTRIES: 'ENTRIES',
  },
  REPORT: {
    CHANGE_DATE: 'CHANGE_DATE',
  },
  REQUEST: {
    REQUEST_STATE: 'REQUEST_STATE',
  },
  GOALS: {
    OPEN_GOALS_DIALOG: 'OPEN_GOALS_DIALOG',
    CLOSE_GOALS_DIALOG: 'CLOSE_GOALS_DIALOG',
    GOALS_RECEIVED: 'GOALS_RECEIVED',
    GOAL_FILE_RECEIVED: 'GOAL_FILE_RECEIVED',
    GOALS_UPDATING: 'GOALS_UPDATING',
    SAVE_GOALS_SUCCESS: 'SAVE_GOALS_SUCCESS',
    SERVER_ERROR: 'SERVER_ERROR',
  },
  USER: {
    INFO: 'INFO',
    LOGOUT: 'LOGOUT',
  },
};

export default ActionType;
