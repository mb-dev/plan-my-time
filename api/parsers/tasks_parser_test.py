import unittest
import datetime
import testing.helpers as test
import parsers.tasks_parser as parsers

def duration(hours, minutes=0, seconds=0):
    return hours * 60 * 60 + minutes * 60 + seconds

class TestStringMethods(unittest.TestCase):
    def setUp(self):
        with open(test.path('fixtures/tasksSample.md')) as f:
            self.content = f.read()
            self.parser = parsers.TasksParser('2015-01-01', self.content)
        with open(test.path('fixtures/tasksSampleSaved.md')) as f:
            self.expectedSavedContent = f.read()

    def test_tags(self):
        self.assertEqual(self.parser.tags, ['wakeup', 'lunch', 'yoga', 'party', 'sleep'])

    def test_people(self):
        self.assertEqual(self.parser.people, ['steve-lee'])

    def test_locations(self):
        self.assertEqual(self.parser.locations, ['blue-bottle'])

    def test_duration(self):
        self.assertEqual(self.parser.tasks[0]["duration"], duration(6))
        self.assertEqual(self.parser.tasks[1]["duration"], duration(1, 15))
        self.assertEqual(self.parser.tasks[2]["duration"], duration(8, 45))
        self.assertEqual(self.parser.tasks[3]["duration"], duration(2))
        self.assertEqual(self.parser.tasks[4]["duration"], None)

    def test_tasks(self):
        self.assertEqual(len(self.parser.tasks), 5)
        self.assertEqual(self.parser.tasks[0]["start_time"], '2015-01-01 07:00:00')
        self.assertEqual(self.parser.tasks[0]["tags"], ["wakeup"])
        self.assertEqual(self.parser.tasks[1]["people"], ["steve-lee"])

    def test_to_dict(self):
        self.assertIsNotNone(self.parser.to_dict())

    def test_summerize(self):
        metadata_arr = [self.parser.to_dict(), self.parser.to_dict()]
        summary = parsers.TasksParser.summerize(metadata_arr, datetime.datetime(2015, 1, 1))
        self.assertEqual(summary["tags"]["lunch"]["day"], duration(2, 30))
        self.assertEqual(summary["tags"]["lunch"]["week"], duration(2, 30))
        self.assertEqual(summary["tags"]["lunch"]["month"], duration(2, 30))
        self.assertEqual(summary["locations"]["blue-bottle"]["day"], duration(2, 30))
        self.assertEqual(summary["locations"]["blue-bottle"]["week"], duration(2, 30))
        self.assertEqual(summary["locations"]["blue-bottle"]["month"], duration(2, 30))

    def test_to_file(self):
        new_file_content = self.parser.to_tasks_file()
        self.assertEqual(self.expectedSavedContent.strip(), new_file_content.strip())

    def test_add_line(self):
        self.parser.add_line("- 3pm #yoga", False)
        self.assertEqual(self.parser.tasks[3]['line'], '- 3pm #yoga')
        # ensure previous task now has correct duration
        self.assertEqual(self.parser.tasks[2]['duration'], duration(0, 45))
        self.parser.add_line("- 12:30am #meditation", True)
        self.assertEqual(self.parser.tasks[5]['line'], '- 12:30am #meditation')

    def test_edit_line(self):
        self.assertEqual(self.parser.tasks[0]['duration'], duration(6, 0))
        self.parser.edit_line("- 7am #wakeup", "- 8am #wakeup")
        self.assertEqual(self.parser.tasks[0]['duration'], duration(5, 0))

if __name__ == '__main__':
    unittest.main()
