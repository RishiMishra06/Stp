from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_studentprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentprofile',
            name='phone',
            field=models.CharField(blank=True, max_length=15),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='branch',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='semester',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='studentprofile',
            name='academic_year',
            field=models.CharField(blank=True, max_length=20),
        ),
    ]