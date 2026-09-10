from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Task(models.Model):
    """
    Task model representing an academic task assigned to or created by a student.
    Linked to Django's built-in User model.
    """
    PRIORITY_LOW = 'LOW'
    PRIORITY_MEDIUM = 'MEDIUM'
    PRIORITY_HIGH = 'HIGH'

    PRIORITY_CHOICES = [
        (PRIORITY_LOW, 'Low'),
        (PRIORITY_MEDIUM, 'Medium'),
        (PRIORITY_HIGH, 'High'),
    ]

    STATUS_PENDING = 'PENDING'
    STATUS_IN_PROGRESS = 'IN_PROGRESS'
    STATUS_COMPLETED = 'COMPLETED'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_COMPLETED, 'Completed'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks',
        help_text='Student who owns this task'
    )
    title = models.CharField(max_length=200, help_text='Short title of the task')
    description = models.TextField(blank=True, help_text='Detailed instructions or notes')
    subject = models.CharField(max_length=100, help_text='Subject, Course or Category (e.g. Data Structures, OS, DBMS)')
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default=PRIORITY_MEDIUM,
        help_text='Priority level of the task'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        help_text='Current progress status'
    )
    deadline = models.DateTimeField(help_text='Target completion date and time')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['deadline', '-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'

    def __str__(self):
        return f"{self.title} ({self.subject}) - {self.user.username}"

    @property
    def is_overdue(self):
        """
        A task is overdue if its deadline has passed and its status is not 'COMPLETED'.
        """
        if self.status == self.STATUS_COMPLETED or not self.deadline:
            return False
        return self.deadline < timezone.now()

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)
    phone = models.CharField(max_length=15, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    semester = models.PositiveIntegerField(null=True, blank=True)
    academic_year = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"