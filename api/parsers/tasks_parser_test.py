import unittest
import testing.helpers as test
import parsers.tasks_parser as parsers

class TestStringMethods(unittest.TestCase):
  def setUp(self):
    with open(test.path('fixtures/tasksSample.md')) as f: content = f.read()
    self.parser = parsers.TasksParser('2015-01-01', content)

  def test_tags(self):
    self.assertEqual(self.parser.tags, ['wakeup', 'lunch', 'yoga', 'sleep'])

  def test_people(self):
    self.assertEqual(self.parser.people, ['barak-obama'])

  def test_locations(self):
    self.assertEqual(self.parser.locations, ['blue-bottle'])

  def test_duration(self):
    self.assertEqual(str(self.parser.tasks[0]["duration"]), "6:00:00")
    self.assertEqual(str(self.parser.tasks[1]["duration"]), "1:15:00")
    self.assertEqual(str(self.parser.tasks[2]["duration"]), "8:45:00")
    self.assertEqual(self.parser.tasks[3]["duration"], None)

  def test_tasks(self):
    self.assertEqual(len(self.parser.tasks), 4)
    self.assertEqual(self.parser.tasks[0]["start_time"], '2015-01-01 07:00:00')
    self.assertEqual(self.parser.tasks[0]["tags"], ["wakeup"])
    self.assertEqual(self.parser.tasks[1]["people"], ["barak-obama"])

  def test_to_dict(self):
    self.assertIsNotNone(self.parser.to_dict())

  def test_summerize(self):
    metadata_arr = [self.parser.to_dict(), self.parser.to_dict()]
    summary = parsers.TasksParser.summerize(metadata_arr)
    self.assertEqual(str(summary["lunch"]), "2:30:00")

if __name__ == '__main__':
    unittest.main()
