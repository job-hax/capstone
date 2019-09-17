# Generated by Django 2.2 on 2019-05-11 23:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0020_auto_20190511_2341'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='itu_email',
        ),
        migrations.AddField(
            model_name='profile',
            name='student_email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='student email address'),
        ),
    ]
