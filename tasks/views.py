from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.utils import timezone
from django.db.models import Q, Count
from django.core.paginator import Paginator

from .models import Task
from .forms import StudentRegistrationForm, StudentProfileForm, TaskForm, AddUserAdminForm


def register_view(request):
    """
    Handles new student account registration.
    Redirects to dashboard if already authenticated.
    """
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = StudentRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f'Welcome, {user.first_name or user.username}! Your account has been registered successfully.')
            return redirect('dashboard')
        else:
            messages.error(request, 'Please correct the errors in the registration form below.')
    else:
        form = StudentRegistrationForm()

    return render(request, 'tasks/register.html', {'form': form})


def login_view(request):
    """
    Handles student authentication and login sessions.
    Redirects to dashboard if already authenticated.
    """
    if request.user.is_authenticated:
        return redirect('dashboard')

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {user.first_name or user.username}!')
                next_url = request.GET.get('next')
                return redirect(next_url if next_url else 'dashboard')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Invalid username or password. Please verify your credentials.')
    else:
        form = AuthenticationForm()

    return render(request, 'tasks/login.html', {'form': form})


def logout_view(request):
    """
    Logs out the current student user and terminates session.
    """
    logout(request)
    messages.info(request, 'You have been successfully logged out.')
    return redirect('login')


@login_required
def dashboard_view(request):
    """
    Student Dashboard displaying academic metrics, task counts, completion rate,
    overdue warnings, recent tasks, and upcoming deadlines.
    """
    now = timezone.now()
    user_tasks = Task.objects.filter(user=request.user)

    total_tasks = user_tasks.count()
    pending_tasks = user_tasks.filter(status=Task.STATUS_PENDING).count()
    in_progress_tasks = user_tasks.filter(status=Task.STATUS_IN_PROGRESS).count()
    completed_tasks = user_tasks.filter(status=Task.STATUS_COMPLETED).count()

    # Overdue tasks: deadline has passed AND status is not Completed
    overdue_tasks_qs = user_tasks.filter(
        deadline__lt=now
    ).exclude(status=Task.STATUS_COMPLETED)
    overdue_tasks_count = overdue_tasks_qs.count()

    # Task completion percentage calculation
    completion_percentage = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0

    # Recent tasks (last 5 created or updated)
    recent_tasks = user_tasks.order_by('-updated_at')[:5]

    # Upcoming deadlines (deadlines in the future and not completed)
    upcoming_tasks = user_tasks.filter(
        deadline__gte=now
    ).exclude(status=Task.STATUS_COMPLETED).order_by('deadline')[:5]

    # Overdue tasks list (top 5 urgent)
    urgent_overdue = overdue_tasks_qs.order_by('deadline')[:5]

    # Tasks by priority for chart / stats breakdown
    priority_stats = {
        'high': user_tasks.filter(priority=Task.PRIORITY_HIGH).count(),
        'medium': user_tasks.filter(priority=Task.PRIORITY_MEDIUM).count(),
        'low': user_tasks.filter(priority=Task.PRIORITY_LOW).count(),
    }

    context = {
        'total_tasks': total_tasks,
        'pending_tasks': pending_tasks,
        'in_progress_tasks': in_progress_tasks,
        'completed_tasks': completed_tasks,
        'overdue_tasks': overdue_tasks_count,
        'completion_percentage': completion_percentage,
        'recent_tasks': recent_tasks,
        'upcoming_tasks': upcoming_tasks,
        'urgent_overdue': urgent_overdue,
        'priority_stats': priority_stats,
    }

    return render(request, 'tasks/dashboard.html', context)


@login_required
def task_list_view(request):
    """
    Listing page for student's tasks with search, status filter,
    priority filter, overdue filter, and sorting.
    """
    user_tasks = Task.objects.filter(user=request.user)

    # Search by title, subject, or description
    query = request.GET.get('q', '').strip()
    if query:
        user_tasks = user_tasks.filter(
            Q(title__icontains=query) |
            Q(subject__icontains=query) |
            Q(description__icontains=query)
        )

    # Filter by status
    status_filter = request.GET.get('status', '').strip()
    if status_filter in [Task.STATUS_PENDING, Task.STATUS_IN_PROGRESS, Task.STATUS_COMPLETED]:
        user_tasks = user_tasks.filter(status=status_filter)

    # Filter by priority
    priority_filter = request.GET.get('priority', '').strip()
    if priority_filter in [Task.PRIORITY_LOW, Task.PRIORITY_MEDIUM, Task.PRIORITY_HIGH]:
        user_tasks = user_tasks.filter(priority=priority_filter)

    # Filter overdue only
    overdue_filter = request.GET.get('overdue', '').strip().lower()
    if overdue_filter == 'true':
        user_tasks = user_tasks.filter(
            deadline__lt=timezone.now()
        ).exclude(status=Task.STATUS_COMPLETED)

    # Sorting
    sort = request.GET.get('sort', 'deadline_asc')
    if sort == 'deadline_desc':
        user_tasks = user_tasks.order_by('-deadline')
    elif sort == 'created_desc':
        user_tasks = user_tasks.order_by('-created_at')
    elif sort == 'created_asc':
        user_tasks = user_tasks.order_by('created_at')
    elif sort == 'priority':
        # Custom ordering by priority
        user_tasks = user_tasks.order_by('priority', 'deadline')
    else:  # default: deadline_asc
        user_tasks = user_tasks.order_by('deadline')

    # Pagination: 8 tasks per page
    paginator = Paginator(user_tasks, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'tasks': page_obj.object_list,
        'query': query,
        'status_filter': status_filter,
        'priority_filter': priority_filter,
        'overdue_filter': overdue_filter,
        'sort': sort,
        'total_filtered_count': user_tasks.count(),
    }

    return render(request, 'tasks/task_list.html', context)


@login_required
def task_detail_view(request, pk):
    """
    Displays complete details for a single task.
    Strictly isolated: returns 404 if the task belongs to another student.
    """
    task = get_object_or_404(Task, pk=pk, user=request.user)
    return render(request, 'tasks/task_detail.html', {'task': task})


@login_required
def task_create_view(request):
    """
    Creates a new task assigned to the logged-in student.
    """
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.save()
            messages.success(request, f'Task "{task.title}" has been successfully created.')
            return redirect('task_detail', pk=task.pk)
        else:
            messages.error(request, 'Please correct the errors in the task form.')
    else:
        form = TaskForm()

    return render(request, 'tasks/task_form.html', {'form': form, 'action': 'Add'})


@login_required
def task_update_view(request, pk):
    """
    Updates an existing task.
    Strictly isolated: returns 404 if the task belongs to another student.
    """
    task = get_object_or_404(Task, pk=pk, user=request.user)

    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            messages.success(request, f'Task "{task.title}" updated successfully.')
            return redirect('task_detail', pk=task.pk)
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = TaskForm(instance=task)

    return render(request, 'tasks/task_form.html', {'form': form, 'task': task, 'action': 'Edit'})


@login_required
def task_delete_view(request, pk):
    """
    Deletes an existing task.
    Requires POST request for final deletion; shows confirmation modal/page on GET.
    Strictly isolated: returns 404 if the task belongs to another student.
    """
    task = get_object_or_404(Task, pk=pk, user=request.user)

    if request.method == 'POST':
        task_title = task.title
        task.delete()
        messages.success(request, f'Task "{task_title}" has been deleted.')
        return redirect('task_list')

    return render(request, 'tasks/task_confirm_delete.html', {'task': task})


@login_required
def task_status_update_view(request, pk):
    """
    Quick status update endpoint (Pending -> In Progress -> Completed).
    Requires POST request to modify database.
    """
    task = get_object_or_404(Task, pk=pk, user=request.user)

    if request.method == 'POST':
        new_status = request.POST.get('status')
        if new_status in [Task.STATUS_PENDING, Task.STATUS_IN_PROGRESS, Task.STATUS_COMPLETED]:
            task.status = new_status
            task.save()
            messages.success(request, f'Status for "{task.title}" updated to {task.get_status_display()}.')
        else:
            messages.error(request, 'Invalid status choice.')

    # Redirect back to where user came from or to task list
    referer = request.META.get('HTTP_REFERER')
    return redirect(referer if referer else 'task_list')


@login_required
def profile_view(request):
    """
    Student profile view and update.
    Displays user details, statistics, and allows editing basic info.
    """
    user_tasks = Task.objects.filter(user=request.user)
    total_tasks = user_tasks.count()
    completed_tasks = user_tasks.filter(status=Task.STATUS_COMPLETED).count()
    completion_rate = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0

    if request.method == 'POST':
        form = StudentProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your profile has been updated successfully.')
            return redirect('profile')
        else:
            messages.error(request, 'Please correct the errors in the profile form.')
    else:
        form = StudentProfileForm(instance=request.user)

    context = {
        'form': form,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'completion_rate': completion_rate,
    }
    return render(request, 'tasks/profile.html', context)


def about_view(request):
    """
    Information and viva documentation page explaining the system architecture,
    technologies used, and core capabilities.
    """
    return render(request, 'tasks/about.html')


@user_passes_test(lambda u: u.is_staff)
def user_list_view(request):
    """
    Directory of registered students and administrators/faculty.
    Allows searching, filtering by role, and viewing task activity.
    """
    role_filter = request.GET.get('role', '').strip()
    search_query = request.GET.get('q', '').strip()

    users_qs = User.objects.annotate(
        task_count=Count('tasks'),
        completed_task_count=Count('tasks', filter=Q(tasks__status=Task.STATUS_COMPLETED))
    ).order_by('-date_joined')

    if role_filter == 'admin':
        users_qs = users_qs.filter(is_staff=True)
    elif role_filter == 'student':
        users_qs = users_qs.filter(is_staff=False)

    if search_query:
        users_qs = users_qs.filter(
            Q(username__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )

    student_count = User.objects.filter(is_staff=False).count()
    admin_count = User.objects.filter(is_staff=True).count()

    context = {
        'users_list': users_qs,
        'role_filter': role_filter,
        'search_query': search_query,
        'student_count': student_count,
        'admin_count': admin_count,
        'total_users': student_count + admin_count,
    }
    return render(request, 'tasks/user_list.html', context)


@user_passes_test(lambda u: u.is_staff)
def user_create_view(request):
    """
    View allowing the creation of new Student and Administrator/Faculty accounts.
    """
    if request.method == 'POST':
        form = AddUserAdminForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            role_name = 'Administrator' if new_user.is_staff else 'Student'
            messages.success(
                request,
                f'New {role_name} account "{new_user.username}" ({new_user.first_name} {new_user.last_name}) has been created successfully!'
            )
            return redirect('user_list')
        else:
            messages.error(request, 'Please correct the errors in the form below.')
    else:
        initial_role = request.GET.get('role', 'student')
        form = AddUserAdminForm(initial={'role': initial_role})

    return render(request, 'tasks/user_form.html', {'form': form})


def custom_404_view(request, exception=None):
    """
    Custom 404 error handler with friendly navigation options.
    """
    return render(request, '404.html', status=404)
