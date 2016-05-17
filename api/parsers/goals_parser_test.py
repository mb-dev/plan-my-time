import unittest
import testing.helpers as test
import parsers.goals_parser as parsers

class GoalsParserTest(unittest.TestCase):
    def setUp(self):
        with open(test.path('fixtures/goalsSample.md')) as f:
            self.content = f.read()
            self.parser = parsers.GoalsParser(self.content)

    def test_daily_goals(self):
        self.assertEqual(self.parser.dailyGoals(), [
            {"tag": '#meditation', "daily": 2},
        ])
        pass


if __name__ == '__main__':
    unittest.main()
