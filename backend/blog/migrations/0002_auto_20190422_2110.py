# Generated by Django 2.1.5 on 2019-04-22 21:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='image',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='blog',
            name='is_html',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='blog',
            name='snippet',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
