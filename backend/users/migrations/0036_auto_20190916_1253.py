# Generated by Django 2.2 on 2019-09-16 19:53

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
from django.contrib.auth import get_user_model


class Migration(migrations.Migration):

    dependencies = [
        ('college', '0005_delete_major'),
        ('utils', '0004_import_country_data_from_json'),
        ('company', '0002_auto_20190429_2110'),
        ('position', '0003_auto_20190510_2037'),
        ('major', '0001_initial'),
        ('users', '0035_delete_employmentauth'),
    ]

    def move_data(apps, schema_editor):
        Profile = apps.get_model('users', 'Profile')
        User = get_user_model()
        for profile in Profile.objects.all():
            user = profile.user
            user.gmail_last_update_time = profile.gmail_last_update_time
            user.user_type = profile.user_type
            user.is_gmail_read_ok = profile.is_gmail_read_ok
            user.synching = profile.synching
            user.gender = profile.gender
            user.dob = profile.dob
            user.student_email = profile.student_email
            user.phone_number = profile.phone_number
            user.profile_photo_social = profile.profile_photo_social
            user.profile_photo_custom = profile.profile_photo_custom
            user.emp_status = profile.emp_status
            user.college = profile.college
            user.major = profile.major
            user.grad_year = profile.grad_year
            user.company = profile.company
            user.job_position = profile.job_position
            user.country = profile.country
            user.state = profile.state
            user.save()

    operations = [
        migrations.AddField(
            model_name='user',
            name='college',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='college.College'),
        ),
        migrations.AddField(
            model_name='user',
            name='company',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='company.Company'),
        ),
        migrations.AddField(
            model_name='user',
            name='country',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='utils.Country'),
        ),
        migrations.AddField(
            model_name='user',
            name='dob',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='emp_status',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.EmploymentStatus'),
        ),
        migrations.AddField(
            model_name='user',
            name='gender',
            field=models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('N', 'None')], default='N', max_length=1),
        ),
        migrations.AddField(
            model_name='user',
            name='gmail_last_update_time',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='grad_year',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='is_gmail_read_ok',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='job_position',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='position.JobPosition'),
        ),
        migrations.AddField(
            model_name='user',
            name='major',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='major.Major'),
        ),
        migrations.AddField(
            model_name='user',
            name='phone_number',
            field=models.CharField(blank=True, max_length=17, validators=[django.core.validators.RegexValidator(message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.", regex='^\\+?1?\\d{9,15}$')]),
        ),
        migrations.AddField(
            model_name='user',
            name='profile_photo_custom',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='user',
            name='profile_photo_social',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='user',
            name='state',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='utils.State'),
        ),
        migrations.AddField(
            model_name='user',
            name='student_email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='student email address'),
        ),
        migrations.AddField(
            model_name='user',
            name='synching',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='user_type',
            field=models.IntegerField(choices=[(0, 'NONE'), (1, 'PUBLIC'), (2, 'STUDENT'), (3, 'ALUMNI'), (4, 'CAREER SERVICE')], default=0),
        ),
        migrations.RunPython(move_data, reverse_code=migrations.RunPython.noop),
    ]