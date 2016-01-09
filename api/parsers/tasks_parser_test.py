import unittest
import testing.helpers as test
import parsers.tasks_parser as parsers

class TestStringMethods(unittest.TestCase):
  def setUp(self):
    with open(test.path('fixtures/validTasks.md')) as f: content = f.read()
    self.parser = parsers.TasksParser('2015-01-01', content)

  def test_tags(self):
    self.assertEqual(self.parser.tags, ['wakeup', 'lunch', 'yoga', 'sleep'])

  def test_people(self):
    self.assertEqual(self.parser.people, ['barak-obama'])

  def test_locations(self):
    self.assertEqual(self.parser.locations, ['blue-bottle'])

  def test_tasks(self):
    self.assertEqual(self.parser.tasks[0]["start_time"], '2015-01-01 07:00:00')
    self.assertEqual(self.parser.tasks[0]["duration"], None)

if __name__ == '__main__':
    unittest.main()
