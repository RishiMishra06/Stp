from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import Task, StudentProfile


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


class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    extra = 0
    can_delete = False
    fields = (
        'cgpa',
        'phone',
        'branch',
        'semester',
        'academic_year',
    )


admin.site.unregister(User)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines = [StudentProfileInline]

    list_display = (
        'username',
        'get_full_name_display',
        'email',
        'get_phone',
        'get_branch',
        'get_semester',
        'get_academic_year',
        'get_cgpa',
        'is_active',
    )

    search_fields = (
        'username',
        'first_name',
        'last_name',
        'email',
        'profile__phone',
        'profile__branch',
        'profile__academic_year',
    )

    @admin.display(description='Student Name')
    def get_full_name_display(self, obj):
        return obj.get_full_name() or obj.username

    @admin.display(description='Phone')
    def get_phone(self, obj):
        try:
            return obj.profile.phone or '—'
        except StudentProfile.DoesNotExist:
            return '—'

    @admin.display(description='Branch')
    def get_branch(self, obj):
        try:
            return obj.profile.branch or '—'
        except StudentProfile.DoesNotExist:
            return '—'

    @admin.display(description='Semester')
    def get_semester(self, obj):
        try:
            return f"{obj.profile.semester}th" if obj.profile.semester else '—'
        except StudentProfile.DoesNotExist:
            return '—'

    @admin.display(description='Academic Year')
    def get_academic_year(self, obj):
        try:
            return obj.profile.academic_year or '—'
        except StudentProfile.DoesNotExist:
            return '—'

    @admin.display(description='CGPA')
    def get_cgpa(self, obj):
        try:
            return obj.profile.cgpa
        except StudentProfile.DoesNotExist:
            return '—'


# Customize Admin Site Header and Title
admin.site.site_header = 'Student Task Management Administration'
admin.site.site_title = 'Student Task Manager Admin Portal'
admin.site.index_title = 'System Administration & Performance Overview'
