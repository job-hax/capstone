# Generated by Django 2.1.5 on 2019-04-22 23:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('position', '0002_auto_20190422_2320'),
        ('company', '0001_initial'),
        ('jobapps', '0012_jobapplicationnote'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobapplication',
            name='companyObject',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING,
                                    related_name='jobapplication_company', to='company.Company'),
        ),
        migrations.AddField(
            model_name='jobapplication',
            name='position',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING,
                                    related_name='jobapplication_position', to='position.JobPosition'),
        ),
    ]
