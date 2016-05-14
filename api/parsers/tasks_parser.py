import re
import dateutil.parser
import lib.date_helpers as date_helpers

timeRegex = re.compile(r'([0-9:]+(am|pm)?)')
peopleRegex = re.compile(r'@([\w-]+)')
tagRegex = re.compile(r'#([\w-]+)')
locationRegex = re.compile(r'\$([\w-]+)')

def convert_time_line_to_task(time, line):
    people = peopleRegex.findall(line)
    tags = tagRegex.findall(line)
    locations = locationRegex.findall(line)
    return {
        "start_time": str(time),
        "duration": None,
        "line": line,
        "comment": "",
        "people": people,
        "tags": tags,
        "locations": locations
    }

def update_durations(tasks):
    last_date = None

    for idx, task in enumerate(tasks):
        task_date = date_helpers.parse_datetime_str(task["start_time"])
        if last_date is not None:
            duration = task_date - last_date
            tasks[idx - 1]["duration"] = duration.seconds
        last_date = task_date


def convert_line_to_task(last_date, date_str, line):
    time = timeRegex.search(line)
    if time is None:
        return None, None
    time_str = time.group(0)
    if not time_str.endswith('am') and not time_str.endswith('pm'):
        time_str += 'am'
    try:
        time = dateutil.parser.parse(date_str + ' ' + time_str)
    except ValueError:
        return None, None

    # time is before last date, maybe it crossed midnight
    if last_date and time < last_date:
        next_day_str = date_helpers.next_day_str(time)
        time = dateutil.parser.parse(next_day_str + ' ' + time_str)

    return time, convert_time_line_to_task(time, line)

class TasksParser:
    def __init__(self, date_str, content):
        self.date_str = date_str
        self.content = content
        self.tags = []
        self.people = []
        self.locations = []
        self.tasks = []
        self.header = ''

        # parse
        lines = content.split('\n')
        last_comment = ''
        last_date = None
        for line in lines:
            # lines that don't start with - are comments to the previous line, or headers.
            if not line.startswith('-'):
                last_comment = last_comment + line + "\n"
                continue

            time, new_task = convert_line_to_task(last_date, date_str, line)
            if time is None:
                continue

            # check if the current date is before the previous date
            if last_date and time < last_date:
                raise(ValueError("Invalid file, date is going backwards"))

            if last_date is None:
                self.header = last_comment
            else:
                self.tasks[-1]["comment"] = last_comment.strip()
                last_comment = ''

            last_date = time
            self.people += new_task["people"]
            self.tags += new_task["tags"]
            self.locations += new_task["locations"]
            self.tasks.append(new_task)
        update_durations(self.tasks)

    def add_line(self, line, is_after_midnight):
        pos = len(self.tasks)
        last_date = None
        if is_after_midnight:
            last_date = dateutil.parser.parse(self.date_str)
            last_date = date_helpers.next_day(last_date)
        time, new_task = convert_line_to_task(last_date, self.date_str, line)
        for idx, task in enumerate(self.tasks):
            task_date = date_helpers.parse_datetime_str(task["start_time"])
            if task_date > time:
                pos = idx
                break
        self.tasks.insert(pos, new_task)
        update_durations(self.tasks)

    def edit_line(self, prev_line, new_line):
        for idx, task in enumerate(self.tasks):
            if task["line"] == prev_line:
                last_date = None
                if idx > 0:
                    last_date = date_helpers.parse_datetime_str(self.tasks[idx - 1]["start_time"])
                time, new_task = convert_line_to_task(last_date, self.date_str, new_line)
                self.tasks[idx] = new_task
                break
        update_durations(self.tasks)

    def to_tasks_file(self):
        content = self.header
        lines = []
        for task in self.tasks:
            lines.append(task["line"])
            if task["comment"]:
                lines.append(task["comment"])
        return content + "\n".join(lines)

    def from_dict(self, metadata):
        self.tasks = metadata["tasks"]
        self.people = metadata["people"]
        self.locations = metadata["locations"]
        self.tags = metadata["tags"]
        self.header = metadata["header"]

    def to_dict(self):
        return {
            "date": self.date_str,
            "people": self.people,
            "tags": self.tags,
            "locations": self.locations,
            "tasks": self.tasks,
            "header": self.header
        }

    # summerize the metadata relative to date.
    # metadata should contain only elements that are in the same month as date
    @staticmethod
    def summerize(metadata_arr, date):
        def summerize_task_item(summary, task, metadata_date, key, val):
            if val not in summary[key]:
                summary[key][val] = {"day": 0, "week": 0, "month": 0}

            if date_helpers.is_same_week(date, metadata_date):
                summary[key][val]["week"] += task["duration"]

            if date_helpers.is_same_day(date, metadata_date):
                summary[key][val]["day"] += task["duration"]

            summary[key][val]["month"] += task["duration"]

        summary = {'tags': {}, 'people': {}, 'locations': {}}
        for metadata in metadata_arr:
            if "tasks" not in metadata:
                continue
            metadata_date = date_helpers.parse_date_str(metadata["date"])

            for task in metadata["tasks"]:
                if task["duration"] is None:
                    continue
                for tag in task["tags"]:
                    summerize_task_item(summary, task, metadata_date, 'tags', tag)
                for person in task["people"]:
                    summerize_task_item(summary, task, metadata_date, 'people', person)
                for location in task["locations"]:
                    summerize_task_item(summary, task, metadata_date, 'locations', location)
        return summary
