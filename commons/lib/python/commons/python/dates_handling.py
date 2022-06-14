import datetime
from dateutil.relativedelta import relativedelta
from dateutil.parser import parse



def compute_date_forecast_target(date, forecast_time_granularity, forecast_horizon):
    if forecast_time_granularity in ["days", "weeks"]:
        if forecast_time_granularity == "days":
            date_forecast_target = compute_future_date(date, "days", forecast_horizon)
        else:
            days_to_add_to_date = 7 * forecast_horizon
            date_forecast_target = compute_future_date(date, "days", days_to_add_to_date)
            
    elif forecast_time_granularity == "months":
        days_to_add_to_date = 31 * forecast_horizon
        date_forecast_target = compute_future_date(date, "days", days_to_add_to_date)
        date_forecast_target = datetime.datetime(date_forecast_target.year,
                                                 date_forecast_target.month,
                                                 1, 0, 0)
    return date_forecast_target


def extract_datetime_components(datetime_date, list_of_components_to_extract):
    datetime_components = {}

    if "microsecond" in list_of_components_to_extract:
        datetime_components["microsecond"] = datetime_date.microsecond

    if "second" in list_of_components_to_extract:
        datetime_components["second"] = datetime_date.second

    if "minute" in list_of_components_to_extract:
        datetime_components["minute"] = datetime_date.minute

    if "hour" in list_of_components_to_extract:
        datetime_components["hour"] = datetime_date.hour

    if "day_of_week" in list_of_components_to_extract:
        datetime_components["day_of_week"] = datetime_date.weekday() + 1

    if "day_of_month" in list_of_components_to_extract:
        datetime_components["day_of_month"] = datetime_date.day

    if "day_of_year" in list_of_components_to_extract:
        datetime_components["day_of_year"] = datetime_date.timetuple().tm_yday

    if "week_of_year" in list_of_components_to_extract:
        datetime_components["week_of_year"] = int(datetime_date.strftime("%V"))

    if "month" in list_of_components_to_extract:
        datetime_components["month"] = datetime_date.month

    if "year" in list_of_components_to_extract:
        datetime_components["year"] = datetime_date.year

    return datetime_components


def compute_difference_between_datetime_timestamps(timestamp_1, timestamp_2,
                                                   time_unit, bool_return_absolute_delta,
                                                   bool_log_errors):
    try:
        delta = timestamp_1 - timestamp_2

        if time_unit == "days":
            difference = delta.days

        elif time_unit == "seconds":
            difference = delta.seconds

        elif time_unit == "microseconds":
            difference = delta.microseconds

        else:
            log_message = "time unit '{}' is not handled by this function".format(time_unit)
            raise Exception(log_message)

        if bool_return_absolute_delta:
            difference = abs(difference)
            pass

    except Exception as e:
        exception_message = ". ".join(arg for arg in e.args)
        log_message = "Exception met during the computation : 'None' will be returned.\n"\
        "Exception was '{}'".format(exception_message)
        if bool_log_errors:
            print(log_message)
        difference = None

    return difference

def compute_antecedent_date(reference_date, time_unit, time_value):
    if time_unit=="years":
        time_delta = relativedelta(years=-time_value)
        
    elif time_unit=="months":
        time_delta = relativedelta(months=-time_value)
        
    elif time_unit=="weeks":
        time_delta = relativedelta(weeks=-time_value)
        
    elif time_unit=="days":
        time_delta = relativedelta(days=-time_value)
        
    elif time_unit=="hours":
        time_delta = relativedelta(hours=-time_value)
        
    antecedent_date = reference_date + time_delta
    return antecedent_date


def compute_future_date(reference_date, time_unit, time_value):
    return compute_antecedent_date(reference_date, time_unit, -time_value)


def from_dss_string_date_to_datetime(dss_string_date):
    return parse(dss_string_date)


def fatten_time_value(time_value):
    str_time_value = str(time_value)
    if len(str_time_value) <2:
        return "0{}".format(str_time_value)
    else:
        return str_time_value

    
def from_datetime_to_dss_string_date(datetime_value):
    year = datetime_value.year
    month = fatten_time_value(datetime_value.month)
    day = fatten_time_value(datetime_value.day)
    hour = fatten_time_value(datetime_value.hour)
    minute = fatten_time_value(datetime_value.minute)
    return "{}-{}-{}T{}:{}:00.000Z".format(year, month, day, hour, minute)


def simplify_datetime_date(datetime_date, list_of_components_to_simplify):
    """
    list_of_components_to_simplify : choices in ["month", "day", "hour", "minute", "second", "microsecond"]
    """
    time_delta = relativedelta()
    
    if "month" in list_of_components_to_simplify:
        time_delta += relativedelta(months=-datetime_date.month + 1)
    
    if "day" in list_of_components_to_simplify:
        time_delta += relativedelta(days=-datetime_date.day + 1)
    
    if "hour" in list_of_components_to_simplify:
        time_delta += relativedelta(hours=-datetime_date.hour)
    
    if "minute" in list_of_components_to_simplify:
        time_delta += relativedelta(minutes=-datetime_date.minute)
    
    if "second" in list_of_components_to_simplify:
        time_delta += relativedelta(seconds=-datetime_date.second)
    
    if "microsecond" in list_of_components_to_simplify:
        time_delta += relativedelta(microseconds=-datetime_date.microsecond)
    
    simplified_date = datetime_date + time_delta
    
    return simplified_date


class datesFilteringManager():
    
    def __init__(self, dates_filtering_strategy, filtering_reference_date, filtering_time_unit,
                 filtering_time_frame, oldest_date, newest_date):
        
        self.dates_filtering_strategy = dates_filtering_strategy
        self.filtering_reference_date = self.preprocess_dss_string_date(filtering_reference_date)
        self.filtering_time_unit = filtering_time_unit
        self.filtering_time_frame = filtering_time_frame
        self.oldest_date = self.preprocess_dss_string_date(oldest_date)
        self.newest_date = self.preprocess_dss_string_date(newest_date)
    
    def preprocess_dss_string_date(self, dss_string_date):
        if dss_string_date is not None:
            return from_dss_string_date_to_datetime(dss_string_date)
        else:
            return None
    
    def recompute_filtering_parameters(self):
        if self.dates_filtering_strategy == "keep_dates_in_a_range_before_today":
            self.newest_date = datetime.datetime.now()
            self.oldest_date = compute_antecedent_date(self.newest_date,
                                                       self.filtering_time_unit,
                                                       self.filtering_time_frame)
        
        elif self.dates_filtering_strategy == "keep_dates_in_a_range_before_a_past_date":
            self.newest_date = self.filtering_reference_date
            self.oldest_date = compute_antecedent_date(self.newest_date,
                                                       self.filtering_time_unit,
                                                       self.filtering_time_frame)
        
        elif self.dates_filtering_strategy == "keep_all_dates_before_a_reference_date":
            self.newest_date = self.filtering_reference_date
            self.oldest_date = from_dss_string_date_to_datetime("1900-01-01T00:00:00.000Z")
        
        elif self.dates_filtering_strategy == "keep_all_dates_after_a_reference_date":
            self.newest_date = from_dss_string_date_to_datetime("2999-12-31T23:59:59.999Z")
            self.oldest_date = self.filtering_reference_date
        
        elif self.dates_filtering_strategy == "keep_all_dates":
            self.oldest_date = from_dss_string_date_to_datetime("1900-01-01T00:00:00.000Z")
            self.newest_date = from_dss_string_date_to_datetime("2999-12-31T23:59:59.999Z")
        pass