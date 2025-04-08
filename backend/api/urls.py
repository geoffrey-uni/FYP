from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, SavingsGoalViewSet, RegisterView, CustomAuthToken, ExpensePredictionView, AISuggestionView

router = DefaultRouter()
router.register('transactions', TransactionViewSet, basename='transaction')
router.register('savings-goals', SavingsGoalViewSet, basename='savings-goal')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('expense-predictions/', ExpensePredictionView.as_view(), name='expense_predictions'),
    path('ai-suggestions/', AISuggestionView.as_view(), name='ai-suggestions'),
]