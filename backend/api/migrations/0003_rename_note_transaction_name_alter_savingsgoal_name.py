# Generated by Django 5.1.5 on 2025-04-08 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_savingsgoal_transaction_delete_expense'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transaction',
            old_name='note',
            new_name='name',
        ),
        migrations.AlterField(
            model_name='savingsgoal',
            name='name',
            field=models.CharField(max_length=30),
        ),
    ]
