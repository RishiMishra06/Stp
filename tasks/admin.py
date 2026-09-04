from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for managing student tasks.
    """
    list_display = (
        'title',
        'user',
        'subject',
        'priority',
        'status',
        'deadline',
        'is_overdue_badge',
        'created_at'
    )
    list_filter = ('status', 'priority', 'subject', 'created_at', 'deadline')
    search_fields = (
        'title',
        'subject',
        'description',
        'user__username',
        'user__first_name',
        'user__last_name',
        'user__email'
    )
    ordering = ('-created_at',)
    date_hierarchy = 'deadline'
    list_per_page = 20

    fieldsets = (
        ('Task Details', {
            'fields': ('user', 'title', 'subject', 'description')
        }),
        ('Status & Priority', {
            'fields': ('priority', 'status', 'deadline')
        }),
    )

    @admin.display(description='Overdue?', boolean=True)
    def is_overdue_badge(self, obj):
        return obj.is_overdue


# Customize Admin Site Header and Title
admin.site.site_header = 'Student Task Management Administration'
admin.site.site_title = 'Student Task Manager Admin Portal'
admin.site.index_title = 'System Administration & Performance Overview'
