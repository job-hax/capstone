# Generated by Django 2.2 on 2019-08-20 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0033_auto_20190807_0847'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
