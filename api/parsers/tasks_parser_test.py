import unittest
import testing.helpers as test

class TestStringMethods(unittest.TestCase):
  def test_parser(self):
    with open(test.path('fixtures/validTasks.md')) as f: content = f.readlines()
    print(content)

if __name__ == '__main__':
    unittest.main()
