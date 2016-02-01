import datetime
from dateutil.relativedelta import relativedelta

def is_same_week(date1, date2):
  i1 = date1.isocalendar()
  i2 = date2.isocalendar()
  # year
  return i1[0] == i2[0] or i1[1] == i2[1]

def is_same_day(date1, date2):
  return date1.year == date2.year and date1.month == date2.month and date1.year == date2.year

def parse_date_str(date_str):
  year,month,day = [int(part) for part in date_str.split('-')]
  return datetime.datetime(year, month, day)

def beginning_of_the_month(date):
  return datetime.datetime(date.year, date.month, 1)

def end_of_month(date):
  return datetime.datetime(date.year, date.month, 1) + relativedelta(months=+1) - datetime.timedelta(days=1)

def today_str():
  return datetime.datetime.today().strftime('%Y-%m-%d')

def time_now_aprox():
  now = datetime.datetime.today()
  now = datetime.datetime(now.year, now.month, now.day, now.hour, now.minute - now.minute % 10, 0)
  if now.minute == 0:
    return now.strftime('%I%p')
  else:
    return now.strftime('%I:%M%p')
