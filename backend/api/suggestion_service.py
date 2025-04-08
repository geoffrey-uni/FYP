from .models import Transaction, SavingsGoal
from django.db.models import Avg, Sum
from django.db.models.functions import TruncMonth
from datetime import date
from dateutil.relativedelta import relativedelta
import ollama
from .models import AIResponse

def get_financial_data(user):
    today = date.today()
    
    current_month_start = date(today.year, today.month, 1)
    next_month_start = current_month_start + relativedelta(months=1)
    last_month_end = current_month_start - relativedelta(days=1)
    last_month_start = date(last_month_end.year, last_month_end.month, 1)
    one_month_later = today + relativedelta(months=1)
    
    # Get some usefull data for the AI to anaylze
    # 1. Average expense per month before the current month
    avg_expense = Transaction.objects.filter(
        user=user,
        type='expense',
        date__lt=current_month_start
    ).annotate(
        month=TruncMonth('date')
    ).values('month').annotate(
        total=Sum('amount')
    ).aggregate(
        avg_monthly_expense=Avg('total')
    )['avg_monthly_expense'] or 0
    
    # 2. This month accumulated expense
    this_month_expense = Transaction.objects.filter(
        user=user,
        type='expense',
        date__gte=current_month_start,
        date__lt=next_month_start
    ).aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    # 3. Highest spending category and value for last month
    highest_category_last_month = Transaction.objects.filter(
        user=user,
        type='expense',
        date__gte=last_month_start,
        date__lte=last_month_end
    ).values('category').annotate(
        total=Sum('amount')
    ).order_by('-total').first() or {'category': None, 'total': 0}
    
    # 4. Highest spending category and value for this month
    highest_category_this_month = Transaction.objects.filter(
        user=user,
        type='expense',
        date__gte=current_month_start,
        date__lte=today
    ).values('category').annotate(
        total=Sum('amount')
    ).order_by('-total').first() or {'category': None, 'total': 0}
    
    # 5. Savings goals ending within a month
    upcoming_goals = list(SavingsGoal.objects.filter(
        user=user,
        target_date__gte=today,
        target_date__lte=one_month_later
    ).values('name', 'current_amount', 'target_amount', 'target_date'))
    
    return {
        'avg_monthly_expense': avg_expense,
        'this_month_expense': this_month_expense,
        'highest_category_last_month': highest_category_last_month,
        'highest_category_this_month': highest_category_this_month,
        'upcoming_goals': upcoming_goals
    }

def get_financial_suggestions(user):
    today = date.today()

    data = get_financial_data(user)

    ai_response = AIResponse(suggestions=[])

    example_suggestions = AIResponse(suggestions=[
        "Example Suggestion 1",
        "Example Suggestion 2",
        "Example Suggestion 3"
    ])
    
    # Format the prompt for the LLM
    prompt = f"""
    You are a financial advisor, generate exactly 3 suggestions after analyzing the following data and return them as a JSON object.

    The following is the average monthly expenses of the previous months:
    <average_monthly_expenses>
    ${data['avg_monthly_expense']}
    </average_monthly_expenses>

    The following is the current month expenses as of {today}:
    <current_month_expenses>
    ${data['this_month_expense']}
    </current_month_expenses>

    The following is the category of with the highest expense last month:
    <highest_category_last_month>
    {data['highest_category_last_month']['category']} (${data['highest_category_last_month']['total']})
    </highest_category_last_month>

    The following is the category of with the highest expense this month:
    <highest_category_this_month>
    {data['highest_category_this_month']['category']} (${data['highest_category_this_month']['total']})
    </highest_category_this_month>

    The following are upcoming savings goals due within a month:
    <savings_goals>
    """

    for goal in data['upcoming_goals']:
        remaining = float(goal['target_amount']) - float(goal['current_amount'])
        days_left = (goal['target_date'] - today).days
        prompt += f"   - {goal['name']}: {days_left} days left to save ${remaining} \n"

    prompt += f"""
    </savings_goals>

    The following is an example of the exact form your JSON response must be in:
    <example>
    {example_suggestions.model_dump_json(indent=4)}
    </example>

    Instructions you must follow:
    - Create a list of 3 suggestions after analyzing the data
    - Generate a valid JSON object by following the example
    - Do not include any explanation and markdown
    """

    response = ollama.chat(
        model='llama3.2',
        messages=[{'role': 'user', 'content': prompt}]
    )

    content = response['message']['content']

    ai_response = AIResponse.model_validate_json(content)

    return_response = [suggestion for suggestion in ai_response.suggestions]
    
    return return_response