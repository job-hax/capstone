# Generated by Django 2.2 on 2019-08-07 08:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('major', '0001_initial'),
        ('users', '0032_auto_20190807_0601'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='major',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL,
                                    to='major.Major'),
        ),
    ]