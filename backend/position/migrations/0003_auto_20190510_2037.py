# Generated by Django 2.2 on 2019-05-10 20:37

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('position', '0002_auto_20190422_2320'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='jobposition',
            options={'ordering': ['job_title']},
        ),
    ]
