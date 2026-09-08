# Student Task & Performance Management System

A full-stack web application developed using Python, Django, SQLite, Bootstrap 5, and Vanilla JavaScript. The system enables students to manage academic assignments, track upcoming deadlines, monitor performance progress metrics, and automatically detect overdue coursework.

---

## 1. Project Overview

Academic success requires consistent planning and milestone tracking. The **Student Task & Performance Management System** provides college and university students with a centralized workspace to log, track, prioritize, and complete subject-wise assignments, laboratory tasks, and semester projects.

The application incorporates strict student-level data privacy, automated overdue task detection, performance percentage tracking, and a comprehensive Django Admin portal for faculty and system administrators.

---

## 2. Key Features

### A. Student Portal
* **Secure Authentication:** Student registration, login, logout, and session management with hashed passwords using Django's built-in authentication system.
* **Interactive Dashboard:**
  * Real-time metrics: Total Tasks, Pending Tasks, In Progress Tasks, Completed Tasks, and Overdue Tasks.
  * Live academic completion progress bar.
  * Priority distribution chart powered by Chart.js.
  * Recent activity and upcoming deadlines tables.
* **Complete Task CRUD:**
  * Create tasks with Title, Subject, Priority (Low, Medium, High), Status (Pending, In Progress, Completed), Target Deadline, and Description.
  * View detailed task breakdown with timestamps.
  * Edit and update existing tasks.
  * Safe task deletion with CSRF protection and confirmation.
  * Quick status switcher right from tables and detail views.
* **Search, Filter & Sort:**
  * Real-time search across task titles, subjects, and descriptions.
  * Filter by Status (Pending, In Progress, Completed).
  * Filter by Priority (High, Medium, Low).
  * One-click "Show Overdue Only" toggle.
  * Sort by Deadline (earliest/latest), Created Date, or Priority.
* **Automated Overdue Detection:**
  * Dynamically flags any task whose deadline has passed and status is not `Completed`.
  * Visual badge alerts and prominent notification banners on the dashboard.
* **Student Profile:**
  * View user account details (Full name, Username, Email, Registration date).
  * Edit contact details.
  * View personal completion statistics.

### B. Administrator Features (Django Admin)
* Secure administrative access at `/admin/`.
* Complete oversight of all students and their respective tasks.
* Filter tasks by status, priority, subject, and deadline hierarchy.
* Search across student names, usernames, emails, task titles, and subjects.
* Quick boolean indicators showing whether any student's task is overdue.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Framework** | Python 3 + Django 5 | Model-View-Template (MVT) architecture, routing, ORM, authentication |
| **Database** | SQLite 3 | Embedded, zero-configuration relational database |
| **Frontend UI** | HTML5 + CSS3 + Bootstrap 5.3 | Responsive mobile-first UI components, modals, and grid system |
| **Icons** | Bootstrap Icons | Vector indicators for statuses, priorities, and actions |
| **Client Scripting** | Vanilla JavaScript | Alert dismissal, form validation, date handling |
| **Visual Charts** | Chart.js | Priority distribution doughnut visualization |

---

## 4. System Requirements

* Python 3.10, 3.11, or 3.12+
* `pip` (Python package installer)
* Web Browser (Chrome, Firefox, Safari, Edge)
* Operating System: Windows, macOS, or Linux

---

## 5. Installation & Setup Guide

### Step 1: Clone or Download the Project
Extract the project folder into your desired directory:
```bash
cd student_task_manager
```

### Step 2: Create a Virtual Environment
**On Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
```

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run Database Migrations
Initialize the SQLite database schema and authentication tables:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 5: Create an Administrator (Superuser) Account
```bash
python manage.py createsuperuser
```
Follow the interactive prompts to enter:
* Username (e.g., `admin`)
* Email (e.g., `admin@college.edu`)
* Password (e.g., `Admin@12345`)

### Step 6: Start the Development Server
```bash
python manage.py runserver
```
The server will boot at: **`http://127.0.0.1:8000/`**

---

## 6. Sample Demo Accounts & Demonstration Data

You can register students directly via the registration page, or use the Django admin or shell to populate demo accounts.

### Suggested Demo Accounts:

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin@12345` | Manages students and monitors system via `/admin/` |
| **Student 1** | `rohit_sharma` | `Student@123` | B.Tech CSE Student (has completed and in-progress tasks) |
| **Student 2** | `priya_verma` | `Student@123` | B.Tech IT Student (demonstrating data isolation) |

### Quick Seed Script (Optional)
To quickly populate sample students and tasks, run:
```bash
python manage.py shell
```
And paste:
```python
from django.contrib.auth.models import User
from tasks.models import Task
from django.utils import timezone
from datetime import timedelta

# 1. Create Student
user1, _ = User.objects.get_or_create(
    username='rohit_sharma',
    defaults={'first_name': 'Rohit', 'last_name': 'Sharma', 'email': 'rohit@college.edu'}
)
user1.set_password('Student@123')
user1.save()

# 2. Add Tasks
Task.objects.get_or_create(
    user=user1,
    title='Binary Search Tree Implementation',
    subject='Data Structures',
    priority='HIGH',
    status='IN_PROGRESS',
    deadline=timezone.now() + timedelta(days=2),
    description='Implement insertion, deletion and traversals in C++'
)

Task.objects.get_or_create(
    user=user1,
    title='Database Normalization Report',
    subject='DBMS',
    priority='MEDIUM',
    status='COMPLETED',
    deadline=timezone.now() - timedelta(days=1),
    description='Prepare notes on 1NF, 2NF, 3NF and BCNF with examples'
)

Task.objects.get_or_create(
    user=user1,
    title='Operating System Semaphores Lab',
    subject='Operating Systems',
    priority='HIGH',
    status='PENDING',
    deadline=timezone.now() - timedelta(days=2),
    description='Producer-consumer problem using POSIX semaphores'
)
print("Demo data seeded successfully!")
```

---

## 7. Project Structure

```
student_task_manager/
│
├── manage.py                          # Django command line management utility
├── requirements.txt                   # Project Python dependencies
├── db.sqlite3                         # Local SQLite database
├── README.md                          # Project documentation
│
├── student_task_manager/              # Project Configuration Package
│   ├── __init__.py
│   ├── settings.py                    # Database, templates, static & auth settings
│   ├── urls.py                        # Root URL routing
│   ├── asgi.py                        # ASGI entry point
│   └── wsgi.py                        # WSGI entry point
│
├── tasks/                             # Core Application
│   ├── __init__.py
│   ├── admin.py                       # Django Admin ModelAdmin customization
│   ├── apps.py                        # App configuration
│   ├── forms.py                       # Registration, Profile, and Task forms
│   ├── models.py                      # Task database model with overdue property
│   ├── urls.py                        # Task, Profile, and Auth routes
│   ├── views.py                       # View logic, authorization, filtering & stats
│   └── tests.py                       # Unit tests (Auth, CRUD, Isolation, Overdue)
│
├── templates/                         # HTML Templates
│   ├── base.html                      # Primary layout with Navbar, Messages & Footer
│   ├── 404.html                       # Friendly 404 error page
│   └── tasks/
│       ├── login.html                 # Student login page
│       ├── register.html              # Student registration page
│       ├── dashboard.html             # Main student dashboard with metrics & chart
│       ├── task_list.html             # Searchable, filterable task list with pagination
│       ├── task_detail.html           # Detailed task view
│       ├── task_form.html             # Add and Edit task form
│       ├── task_confirm_delete.html   # Safe deletion confirmation modal/page
│       ├── profile.html               # Student profile and account settings
│       └── about.html                 # Architecture and viva reference page
│
└── static/                            # Static Assets
    ├── css/
    │   └── style.css                  # Custom styling overrides
    └── js/
        └── main.js                    # Vanilla JS interactions
```

---

## 8. Database Architecture

### Entity Relationship Model:

```
+--------------------------------------------------+
|                   django_user                    |
+--------------------------------------------------+
| id (PK)                                          |
| username (unique)                                |
| first_name, last_name, email                     |
| password (PBKDF2 SHA256 hashed)                  |
| is_staff, is_superuser, date_joined              |
+--------------------------------------------------+
                         |
                         | 1 : N (One user has many tasks)
                         v
+--------------------------------------------------+
|                    tasks_task                    |
+--------------------------------------------------+
| id (PK, AutoField)                               |
| user_id (FK -> django_user.id, CASCADE)          |
| title (CharField, max 200)                       |
| subject (CharField, max 100)                     |
| description (TextField, optional)                |
| priority (CharField: LOW / MEDIUM / HIGH)        |
| status (CharField: PENDING / IN_PROGRESS / DONE)   |
| deadline (DateTimeField)                         |
| created_at (DateTimeField, auto_now_add)         |
| updated_at (DateTimeField, auto_now)             |
+--------------------------------------------------+
```

---

## 9. Running Automated Tests

Run the included automated tests to verify authentication, task operations, privacy boundaries, and overdue calculations:

```bash
python manage.py test tasks
```

Expected output:
```
Found 6 test(s).
Creating test database for alias 'default'...
......
----------------------------------------------------------------------
Ran 6 tests in 0.42s

OK
Destroying test database for alias 'default'...
```

---

## 10. Viva & Interview Questions Reference

* **Q1: Why did you choose SQLite for this project?**
  * *Answer:* SQLite is serverless, requires zero configuration, stores data in a self-contained single file, and is natively supported by Python and Django, making it ideal for standard student academic systems.
* **Q2: How is user data isolation guaranteed?**
  * *Answer:* In `tasks/views.py`, every database query explicitly filters by the logged-in user: `Task.objects.filter(user=request.user)`. When accessing a single task, `get_object_or_404(Task, pk=pk, user=request.user)` ensures that if student A tries to view, edit, or delete student B's task ID in the URL, Django returns a `404 Not Found`.
* **Q3: How is a task determined to be overdue?**
  * *Answer:* The `Task` model defines an `@property` named `is_overdue`. It evaluates `self.deadline < timezone.now() and self.status != 'COMPLETED'`. This requires zero manual updates and computes dynamically.
* **Q4: How does password security work in Django?**
  * *Answer:* Passwords are never stored in plain text. Django automatically hashes passwords using PBKDF2 with SHA-256 and a cryptographic salt via `user.set_password()`.
Admin setup
