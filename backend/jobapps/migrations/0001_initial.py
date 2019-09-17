# Generated by Django 2.1.5 on 2019-01-29 07:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ApplicationStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='JobApplication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('jobTitle', models.CharField(max_length=200)),
                ('company', models.CharField(max_length=200)),
                ('companyLogo', models.CharField(blank=True, max_length=200, null=True)),
                ('applyDate', models.DateTimeField(blank=True)),
                ('msgId', models.CharField(max_length=200)),
                ('source', models.CharField(default='', max_length=200)),
                ('applicationStatus',
                 models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING,
                                   related_name='applicationStatus', to='jobapps.ApplicationStatus')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                                           to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='JobPostDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('posterInformation', models.TextField(blank=True, null=True)),
                ('decoratedJobPosting', models.TextField(blank=True, null=True)),
                ('topCardV2', models.TextField(blank=True, null=True)),
                ('job_post', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                                               to='jobapps.JobApplication')),
            ],
        ),
    ]
