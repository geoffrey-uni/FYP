from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from pydantic import BaseModel, Field
from typing import List

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    name = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50)
    date = models.DateField()
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-date', '-created_at']

class SavingsGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='savings_goals')
    name = models.CharField(max_length=30)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2)
    target_date = models.DateField()
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']

# pydantic model for easier json verification of the ai suggestions
class AIResponse(BaseModel):
    suggestions: List[str] = Field([])