from django.urls import path
from . import views

urlpatterns = [
    # Dashboard & Navigation
    path('', views.dashboard_view, name='dashboard'),
    path('about/', views.about_view, name='about'),

    # Authentication
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # Task Management
    path('tasks/', views.task_list_view, name='task_list'),
    path('tasks/add/', views.task_create_view, name='task_create'),
    path('tasks/<int:pk>/', views.task_detail_view, name='task_detail'),
    path('tasks/<int:pk>/edit/', views.task_update_view, name='task_update'),
    path('tasks/<int:pk>/delete/', views.task_delete_view, name='task_delete'),
    path('tasks/<int:pk>/status/', views.task_status_update_view, name='task_status_update'),

    # Student Profile
    path('profile/', views.profile_view, name='profile'),
path(
    'password-change/',
    views.password_change_view,
    name='password_change'
),

    # User Management (Students & Admins)
    path('users/', views.user_list_view, name='user_list'),
    path('users/add/', views.user_create_view, name='user_create'),
]
