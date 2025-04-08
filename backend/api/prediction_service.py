import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import calendar

# Data preparation before prediction
def prepare_expense_data(expenses):
    if not expenses.exists():
        print('No expenses')
        return None
        
    df = pd.DataFrame([
        {'date': e.date, 'amount': float(e.amount)} 
        for e in expenses
    ])
    
    # Convert date to datetime if needed
    if not pd.api.types.is_datetime64_any_dtype(df['date']):
        df['date'] = pd.to_datetime(df['date'])
    
    # Group by date and sum the amount to create accumulated expense for that specific date
    df = df.groupby('date').agg({'amount': 'sum'}).reset_index()

    df['ordinal_date'] = df['date'].apply(lambda x: x.toordinal())
    df = df.set_index('ordinal_date')

    # Remove outliers
    Q1 = df['amount'].quantile(0.25)
    Q3 = df['amount'].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    df_no_outliers = df[(df['amount'] >= lower_bound) & (df['amount'] <= upper_bound)]
    df_no_outliers['accumulated_expense'] = df_no_outliers['amount'].cumsum()

    df_outliers = df[(df['amount'] < lower_bound) | (df['amount'] > upper_bound)]    
    df_outliers['accumulated_outliers'] = df_outliers['amount'].cumsum()

    df_no_outliers = df_no_outliers[['date', 'accumulated_expense']]
    df_outliers = df_outliers[['date', 'accumulated_outliers']]

    return df_no_outliers, df_outliers

def predict_expenses(df):
    today = datetime.now()
    tomorrow = today + timedelta(days=1)
    last_date_of_year = datetime(today.year, 12, 31)

    original_index = df.index.copy()
    df.index = range(0, len(df))

    # Train model
    X_train = df.index.values.reshape(-1, 1) 
    y_train = df['accumulated_expense']
    model = LinearRegression()
    model.fit(X_train, y_train)

    predict_dates = pd.date_range(start=tomorrow, end=last_date_of_year + timedelta(days=1))
    predict_dates_ordinal = np.array([d.toordinal() for d in predict_dates])

    # Prediction
    X_predict = range(len(df), len(df) + len(predict_dates))
    X_predict = np.array(X_predict).reshape(-1, 1)
    y_predict = model.predict(X_predict)

    # Align predictions with actual accumulated expense
    # If omitted, the first predicted value is twice as high as it should have been
    last_actual_expense = df['accumulated_expense'].iloc[-1]
    first_predicted_expense = y_predict[0]
    adjustment = first_predicted_expense - model.coef_[0] - last_actual_expense
    y_predict = y_predict - adjustment

    # Pack it as a dataframe for post processing of data later
    df_predictions = pd.DataFrame({
        'date': predict_dates,
        'accumulated_expense': y_predict,
    }, index=predict_dates_ordinal)
    
    df_predictions.index.name = 'ordinal_date'

    df.index = original_index

    return df_predictions
    
def prepare_display_data(df_no_outliers, df_outliers, df_predictions):
    today = datetime.now()
    first_date_of_year = datetime(today.year, 1, 1)
    last_date_of_year = datetime(today.year, 12, 31)

    all_dates = pd.date_range(start=first_date_of_year, end=last_date_of_year)
    all_dates_ordinal = np.array([d.toordinal() for d in all_dates])

    # Create empty dataframe with all dates
    df_final = pd.DataFrame({
        'date': all_dates,
        'accumulated_expense': np.nan
    }, index=all_dates_ordinal)
    
    df_final.index.name = 'ordinal_date'

    # Update with actual and predicted data
    df_final.update(df_no_outliers)
    df_final.update(df_predictions)

    # Forward fill missing values to carry forward accumulated expense values
    df_final['accumulated_expense'] = df_final['accumulated_expense'].ffill()
    
    # Fill with 0 in case there are dates before the first actual expense data point
    first_valid_index = df_final['accumulated_expense'].first_valid_index()
    df_final.loc[df_final.index < first_valid_index, 'accumulated_expense'] = 0.0
    
    # Add the previously removed outliers back so that the displayed data does not omit any expenses
    add_outliers = pd.Series(index=df_final.index, dtype=float)
    add_outliers[df_outliers.index] = df_outliers['accumulated_outliers']
    add_outliers = add_outliers.fillna(method='ffill').fillna(0)
    df_final['accumulated_expense'] = df_final['accumulated_expense'] + add_outliers
    print(df_final.to_string())

    # Data for this week only
    first_day_of_week = today - timedelta(days=today.weekday())
    first_day_of_week_ordinal = first_day_of_week.toordinal()
    last_day_of_week = first_day_of_week + timedelta(days=6)
    last_day_of_week_ordinal = last_day_of_week.toordinal()
    last_day_of_previous_week = first_day_of_week - timedelta(days=1)
    last_day_of_previous_week_ordinal = last_day_of_previous_week.toordinal()
    
    # Get accumulated expense on the last day of the previous week
    previous_week_expense = df_final.loc[last_day_of_previous_week_ordinal, 'accumulated_expense']
    
    # Grab the 7 days of this week
    this_week_expense = df_final.loc[first_day_of_week_ordinal:last_day_of_week_ordinal].copy()
    
    # Subtract accumulated expense from last week from each of these 7 days to only show the accumulated expense for this week
    this_week_expense['accumulated_expense'] -= previous_week_expense
    
    this_week_expense = this_week_expense[['date', 'accumulated_expense']]

    print(this_week_expense)
    
    # Data for this month only
    first_day_of_month = datetime(today.year, today.month, 1)
    first_day_of_month_ordinal = first_day_of_month.toordinal()
    last_day_of_month = datetime(today.year, today.month, calendar.monthrange(today.year, today.month)[1])
    last_day_of_month_ordinal = last_day_of_month.toordinal()
    last_day_of_previous_month = datetime(today.year, today.month - 1, calendar.monthrange(today.year, today.month - 1)[1])
    last_day_of_previous_month_ordinal = last_day_of_previous_month.toordinal()
    
    # Get accumulated expense on the last day of the previous month
    previous_month_expense = df_final.loc[last_day_of_previous_month_ordinal, 'accumulated_expense']
    
    # Grab all days of this month
    this_month_expense = df_final.loc[first_day_of_month_ordinal:last_day_of_month_ordinal].copy()

    # Subtract accumulated expense from last month from each of these days to only show the accumulated expense for this month
    this_month_expense['accumulated_expense'] -= previous_month_expense
    
    this_month_expense = this_month_expense[['date', 'accumulated_expense']]

    print(this_month_expense)
    
    # Data for this year only
    this_year_expense = df_final.copy()
    
    this_year_expense['month'] = this_year_expense['date'].dt.month

    # Group by month, use max instead of sum here because the max of each month is already the accumulated expense
    this_year_expense = this_year_expense.groupby('month').agg({'accumulated_expense': 'max'}).reset_index()

    this_year_expense = this_year_expense[['month', 'accumulated_expense']]

    print(this_year_expense)
    
    return this_week_expense, this_month_expense, this_year_expense