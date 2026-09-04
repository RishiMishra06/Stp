"""
URL configuration for student_task_manager project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('tasks.urls')),
]

# Custom 404 error handler
handler404 = 'tasks.views.custom_404_view'
