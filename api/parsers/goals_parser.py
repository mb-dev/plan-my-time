import re

timesRegex = re.compile(r'(\d+) times')
freqRegex = re.compile(r'per (\w+)')
tagRegex = re.compile(r'(#[\w-]+)')

# How it works
# Step 1 - parse the file, generate rrule for each line
# Step 2 - generate for each day/month/quarter a list of hash tag and frequency
# Step 3 - return the above to the client
# Step 4 - for daily goals, the client compare the amount to the metadata. And keep it updated when metadata updates.
# Step 5 - for weekly/monthly/quarterly goals, the client compares the amount to metadata in the calendar view.
class GoalsParser:
    def __init__(self, content):
        lines = content.split('\n')
        goals = []
        for line in lines:
            times = timesRegex.findall(line)
            freq = freqRegex.findall(line)
            tag = tagRegex.findall(line)

            if not times or not freq or not tag:
                continue

            goal = {
                "tag": tag[0],
            }
            goal[freq[0]] = int(times[0])

            goals.append(goal)

        self.goals = goals

    def to_array(self):
        return self.goals
