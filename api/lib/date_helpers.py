import datetime
from dateutil.relativedelta import relativedelta

def is_same_week(date1, date2):
    i1 = date1.isocalendar()
    i2 = date2.isocalendar()
    # year
    return i1[0] == i2[0] or i1[1] == i2[1]

def is_same_day(date1, date2):
    return date1.year == date2.year and date1.month == date2.month and date1.year == date2.year

def parse_datetime_str(datetime_str):
    return datetime.datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')

def to_datetime_str(dt):
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def parse_date_str(date_str):
    year, month, day = [int(part) for part in date_str.split('-')]
    return datetime.datetime(year, month, day)

def beginning_of_the_month(date):
    return datetime.datetime(date.year, date.month, 1)

def end_of_month(date):
    return datetime.datetime(date.year, date.month, 1) + relativedelta(months=+1) - datetime.timedelta(days=1)

def today_str():
    return datetime.datetime.today().strftime('%Y-%m-%d')

def time_now_prox():
    return time_aprox(datetime.datetime.today())

def time_aprox(dt):
    dt = datetime.datetime(dt.year, dt.month, dt.day, dt.hour, dt.minute - dt.minute % 10, 0)
    if dt.minute == 0:
        return dt.strftime('%-I%p').lower()
    else:
        return dt.strftime('%I:%M%p').lower()

def next_day(dt):
    return dt + datetime.timedelta(days=1)

def next_day_str(dt):
    return next_day(dt).strftime("%Y-%m-%d")
