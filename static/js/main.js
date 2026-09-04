/**
 * Student Task & Performance Management System
 * Vanilla JavaScript Utilities
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize Bootstrap Tooltips if any exist
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 2. Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-danger)');
    alerts.forEach(function (alert) {
        setTimeout(function () {
            const bsAlert = new bootstrap.Alert(alert);
            try {
                bsAlert.close();
            } catch (e) {
                // Alert might have already been closed by the user
            }
        }, 5000);
    });

    // 3. Confirm Delete Prompts for safety
    const deleteButtons = document.querySelectorAll('.confirm-delete-action');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            const taskName = button.getAttribute('data-task-title') || 'this task';
            if (!confirm(`Are you sure you want to permanently delete "${taskName}"?`)) {
                event.preventDefault();
            }
        });
    });

    // 4. Highlight current datetime on task form if empty
    const deadlineInput = document.querySelector('input[type="datetime-local"]');
    if (deadlineInput && !deadlineInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 3);
        tomorrow.setHours(23, 59, 0, 0);
        
        // Format to YYYY-MM-DDTHH:MM
        const pad = (num) => String(num).padStart(2, '0');
        const year = tomorrow.getFullYear();
        const month = pad(tomorrow.getMonth() + 1);
        const day = pad(tomorrow.getDate());
        const hours = pad(tomorrow.getHours());
        const minutes = pad(tomorrow.getMinutes());
        
        deadlineInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
});
