# Generated by Django 2.2 on 2019-08-05 21:03

import django.contrib.postgres.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('utils', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code2', models.CharField(blank=True, max_length=10)),
                ('code3', models.CharField(blank=True, max_length=10)),
                ('name', models.CharField(blank=True, max_length=200)),
                ('capital', models.CharField(blank=True, max_length=200)),
                ('region', models.CharField(blank=True, max_length=200)),
                ('subregion', models.CharField(blank=True, max_length=200)),
                ('states',
                 django.contrib.postgres.fields.ArrayField(base_field=django.contrib.postgres.fields.jsonb.JSONField(),
                                                           size=None)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(blank=True, max_length=20)),
                ('name', models.CharField(blank=True, max_length=200)),
                ('subdivision', models.CharField(blank=True, max_length=200)),
                ('country', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                                              to='utils.Country')),
            ],
            options={
                'ordering': ['name'],
            },
        ),
    ]
