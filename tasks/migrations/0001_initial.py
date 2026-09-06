from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID'
                    )
                ),
                (
                    'title',
                    models.CharField(
                        help_text='Short title of the task',
                        max_length=200
                    )
                ),
                (
                    'description',
                    models.TextField(
                        blank=True,
                        help_text='Detailed instructions or notes'
                    )
                ),
                (
                    'subject',
                    models.CharField(
                        help_text='Subject, Course or Category (e.g. Data Structures, OS, DBMS)',
                        max_length=100
                    )
                ),
                (
                    'priority',
                    models.CharField(
                        choices=[
                            ('LOW', 'Low'),
                            ('MEDIUM', 'Medium'),
                            ('HIGH', 'High')
                        ],
                        default='MEDIUM',
                        help_text='Priority level of the task',
                        max_length=10
                    )
                ),
                (
                    'status',
                    models.CharField(
                        choices=[
                            ('PENDING', 'Pending'),
                            ('IN_PROGRESS', 'In Progress'),
                            ('COMPLETED', 'Completed')
                        ],
                        default='PENDING',
                        help_text='Current progress status',
                        max_length=20
                    )
                ),
                (
                    'deadline',
                    models.DateTimeField(
                        help_text='Target completion date and time'
                    )
                ),
                (
                    'created_at',
                    models.DateTimeField(auto_now_add=True)
                ),
                (
                    'updated_at',
                    models.DateTimeField(auto_now=True)
                ),
                (
                    'user',
                    models.ForeignKey(
                        help_text='Student who owns this task',
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='tasks',
                        to=settings.AUTH_USER_MODEL
                    )
                ),
            ],
            options={
                'verbose_name': 'Task',
                'verbose_name_plural': 'Tasks',
                'ordering': ['deadline', '-created_at'],
            },
        ),
    ]