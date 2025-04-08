from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from .models import Transaction, SavingsGoal
from .serializers import TransactionSerializer, SavingsGoalSerializer, UserSerializer, RegisterSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from . import prediction_service
from . import suggestion_service

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key
        })

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email
        })

class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavingsGoalViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SavingsGoalSerializer
    
    def get_queryset(self):
        return SavingsGoal.objects.filter(user=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpensePredictionView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        user_transactions = Transaction.objects.filter(
            user=request.user,
            type='expense'
        ).order_by('date')
        
        # Prepare data for prediction
        df_no_outliers, df_outliers = prediction_service.prepare_expense_data(user_transactions)
        
        # Generate predictions
        df_predictions = prediction_service.predict_expenses(df_no_outliers)

        # daily expense for the week, daily expense of the month, monthly expense for the year
        df_week, df_month, df_year = prediction_service.prepare_display_data(df_no_outliers, df_outliers, df_predictions)
        
        return Response({
            'this_week_expense': df_week.to_dict(orient='records'),
            'this_month_expense': df_month.to_dict(orient='records'),
            'this_year_expense': df_year.to_dict(orient='records')
        })
            
class AISuggestionView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request):

        response = suggestion_service.get_financial_suggestions(request.user)
        print(response)

        return Response({
            'suggestions': response
        })