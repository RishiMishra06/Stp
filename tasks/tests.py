from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from .models import Task


class StudentTaskManagementTests(TestCase):
    """
    Automated test suite covering authentication, task CRUD, isolation, and overdue calculation.
    """

    def setUp(self):
        self.client = Client()

        # Create two distinct student users
        self.student1 = User.objects.create_user(
            username='rohit_sharma',
            email='rohit@college.edu',
            password='Password123!',
            first_name='Rohit',
            last_name='Sharma'
        )

        self.student2 = User.objects.create_user(
            username='priya_verma',
            email='priya@college.edu',
            password='Password123!',
            first_name='Priya',
            last_name='Verma'
        )

        # Create sample tasks for student1
        self.task1 = Task.objects.create(
            user=self.student1,
            title='Data Structures Assignment',
            description='Implement Red-Black tree insertion',
            subject='Data Structures',
            priority=Task.PRIORITY_HIGH,
            status=Task.STATUS_PENDING,
            deadline=timezone.now() + timedelta(days=3)
        )

        # Create an overdue task for student1
        self.overdue_task = Task.objects.create(
            user=self.student1,
            title='Submit Physics Lab Record',
            description='Experiments 1 to 5 writeup',
            subject='Physics',
            priority=Task.PRIORITY_MEDIUM,
            status=Task.STATUS_PENDING,
            deadline=timezone.now() - timedelta(days=2)
        )

        # Create a task for student2
        self.task_student2 = Task.objects.create(
            user=self.student2,
            title='Database Normalization Quiz',
            description='BCNF and 4NF questions',
            subject='DBMS',
            priority=Task.PRIORITY_LOW,
            status=Task.STATUS_IN_PROGRESS,
            deadline=timezone.now() + timedelta(days=5)
        )

    def test_user_authentication_login_and_logout(self):
        """Test student login and logout workflows."""
        login_successful = self.client.login(username='rohit_sharma', password='Password123!')
        self.assertTrue(login_successful)

        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Rohit')

        # Logout
        self.client.logout()
        response_after_logout = self.client.get(reverse('dashboard'))
        # Should redirect to login page
        self.assertEqual(response_after_logout.status_code, 302)
        self.assertIn(reverse('login'), response_after_logout.url)

    def test_task_creation(self):
        """Test task creation for authenticated student."""
        self.client.login(username='rohit_sharma', password='Password123!')
        response = self.client.post(reverse('task_create'), {
            'title': 'New OS Lab Exercise',
            'subject': 'Operating Systems',
            'priority': Task.PRIORITY_MEDIUM,
            'status': Task.STATUS_PENDING,
            'deadline': (timezone.now() + timedelta(days=4)).strftime('%Y-%m-%dT%H:%M'),
            'description': 'Process synchronization using semaphores'
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Task.objects.filter(title='New OS Lab Exercise', user=self.student1).exists())

    def test_task_editing(self):
        """Test editing a student's own task."""
        self.client.login(username='rohit_sharma', password='Password123!')
        edit_url = reverse('task_update', kwargs={'pk': self.task1.pk})
        response = self.client.post(edit_url, {
            'title': 'Data Structures Assignment (Updated)',
            'subject': 'Advanced Data Structures',
            'priority': Task.PRIORITY_HIGH,
            'status': Task.STATUS_IN_PROGRESS,
            'deadline': self.task1.deadline.strftime('%Y-%m-%dT%H:%M'),
            'description': 'Updated description with deletion code'
        })
        self.assertEqual(response.status_code, 302)
        self.task1.refresh_from_db()
        self.assertEqual(self.task1.title, 'Data Structures Assignment (Updated)')
        self.assertEqual(self.task1.status, Task.STATUS_IN_PROGRESS)

    def test_task_deletion(self):
        """Test deleting a student's task via POST."""
        self.client.login(username='rohit_sharma', password='Password123!')
        delete_url = reverse('task_delete', kwargs={'pk': self.task1.pk})
        response = self.client.post(delete_url)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Task.objects.filter(pk=self.task1.pk).exists())

    def test_unauthorized_access_to_another_student_task(self):
        """
        CRITICAL SECURITY TEST: Ensure student1 cannot view, edit, or delete student2's tasks.
        """
        self.client.login(username='rohit_sharma', password='Password123!')

        # Attempt to view student2's task
        view_url = reverse('task_detail', kwargs={'pk': self.task_student2.pk})
        response = self.client.get(view_url)
        self.assertEqual(response.status_code, 404)

        # Attempt to edit student2's task
        edit_url = reverse('task_update', kwargs={'pk': self.task_student2.pk})
        response_edit = self.client.post(edit_url, {
            'title': 'Malicious Edit',
            'subject': 'DBMS',
            'priority': Task.PRIORITY_HIGH,
            'status': Task.STATUS_COMPLETED,
            'deadline': timezone.now().strftime('%Y-%m-%dT%H:%M'),
            'description': 'Attempting unauthorized modification'
        })
        self.assertEqual(response_edit.status_code, 404)

        # Attempt to delete student2's task
        delete_url = reverse('task_delete', kwargs={'pk': self.task_student2.pk})
        response_delete = self.client.post(delete_url)
        self.assertEqual(response_delete.status_code, 404)

        # Verify student2's task remains untouched in database
        self.task_student2.refresh_from_db()
        self.assertEqual(self.task_student2.title, 'Database Normalization Quiz')

    def test_overdue_task_logic(self):
        """
        Verify that tasks are correctly identified as overdue when:
        deadline has passed AND status is not Completed.
        """
        # Overdue task is pending with past deadline -> must be overdue
        self.assertTrue(self.overdue_task.is_overdue)

        # If completed, even if deadline has passed, it should NOT be overdue
        self.overdue_task.status = Task.STATUS_COMPLETED
        self.overdue_task.save()
        self.assertFalse(self.overdue_task.is_overdue)

        # Future task is not overdue
        self.assertFalse(self.task1.is_overdue)
