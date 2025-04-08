from django.contrib import admin
from .models import Transaction, SavingsGoal

admin.site.register(Transaction)
admin.site.register(SavingsGoal)