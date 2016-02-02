import unittest
import datetime
import testing.helpers as test
import parsers.tasks_parser as parsers

def duration(hours, minutes=0, seconds=0):
  return hours*60*60 + minutes * 60 + seconds

class TestStringMethods(unittest.TestCase):
  def setUp(self):
    with open(test.path('fixtures/tasksSample.md')) as f: 
      self.content = f.read()
    self.parser = parsers.TasksParser('2015-01-01', self.content)

  def test_tags(self):
    self.assertEqual(self.parser.tags, ['wakeup', 'lunch', 'yoga', 'sleep'])

  def test_people(self):
    self.assertEqual(self.parser.people, ['steve-lee'])

  def test_locations(self):
    self.assertEqual(self.parser.locations, ['blue-bottle'])

  def test_duration(self):
    self.assertEqual(self.parser.tasks[0]["duration"], duration(6))
    self.assertEqual(self.parser.tasks[1]["duration"], duration(1, 15))
    self.assertEqual(self.parser.tasks[2]["duration"], duration(8, 45))
    self.assertEqual(self.parser.tasks[3]["duration"], None)

  def test_tasks(self):
    self.assertEqual(len(self.parser.tasks), 4)
    self.assertEqual(self.parser.tasks[0]["start_time"], '2015-01-01 07:00:00')
    self.assertEqual(self.parser.tasks[0]["tags"], ["wakeup"])
    self.assertEqual(self.parser.tasks[1]["people"], ["steve-lee"])

  def test_to_dict(self):
    self.assertIsNotNone(self.parser.to_dict())

  def test_summerize(self):
    metadata_arr = [self.parser.to_dict(), self.parser.to_dict()]
    summary = parsers.TasksParser.summerize(metadata_arr, datetime.datetime(2015, 1, 1))
    self.assertEqual(summary["lunch"]["day"], duration(2, 30))
    self.assertEqual(summary["lunch"]["week"], duration(2, 30))
    self.assertEqual(summary["lunch"]["month"], duration(2, 30))

  def test_to_file(self):
    lines = self.content.split("\n")
    n = len(lines)
    content_without_last_two_lines = "\n".join(lines[:n-3])
    new_file_content = self.parser.to_tasks_file()
    self.assertEqual(new_file_content.strip(), content_without_last_two_lines)

  def test_add_line(self):
    self.parser.add_line(datetime.datetime(2015, 1, 1, 15, 0, 0), '#yoga')
    self.assertEqual(self.parser.tasks[3]['line'], '3pm #yoga')
    # ensure previous task now has correct duration
    self.assertEqual(self.parser.tasks[2]['duration'], duration(0, 45))

if __name__ == '__main__':
    unittest.main()
