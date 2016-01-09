import os

def path(file):
  rootpath = os.path.dirname(os.path.abspath('__file__'))
  return os.path.join(rootpath, 'testing/', file)
