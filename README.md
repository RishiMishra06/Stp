# Student Task & Performance Management System

A Django-based web application for students to organize academic tasks, track deadlines, monitor progress, and manage personal academic information.

## Features

### Student Portal
- Student registration, login, logout, and session management
- Dashboard with total, pending, in-progress, completed, and overdue task counts
- Create, view, update, and delete tasks
- Task priority: Low, Medium, High
- Task status: Pending, In Progress, Completed
- Deadline-based overdue detection
- Search, filter, and sort tasks
- Student profile with CGPA, phone, branch, semester, and academic year
- Profile completion percentage indicator
- Secure password change

### Administrator
- Django Admin panel for managing users and tasks
- Student and task records can be reviewed from the admin interface
- Task filtering and searching through Django Admin

## Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | Python, Django 5 |
| Database | SQLite for local development; PostgreSQL (Neon) for production |
| Frontend | HTML5, CSS3, Bootstrap 5 |
| Client-side scripting | Vanilla JavaScript |
| Charts | Chart.js |
| Icons | Bootstrap Icons |
| Deployment | Vercel |

## Project Structure

```text
Stp/
├── student_task_manager/       # Django project configuration
├── tasks/                      # Main Django application
│   └── migrations/             # Database migrations
├── templates/                  # HTML templates
│   └── tasks/                  # Application templates
├── static/                    # CSS and JavaScript assets
├── manage.py                  # Django management utility
├── requirements.txt           # Python dependencies
├── pyproject.toml             # Project/build configuration
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

## Database Design

The application uses Django's built-in `User` model for authentication. Each user can have multiple tasks and one student profile.

```text
User
 ├── 1 : N ──> Task
 └── 1 : 1 ──> StudentProfile
```

### Task
Stores the academic task title, subject, description, priority, status, deadline, and timestamps.

### StudentProfile
Stores additional student information such as CGPA, phone, branch, semester, and academic year.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/RishiMishra06/Stp.git
cd Stp
```

### 2. Create and activate a virtual environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file or set the required environment variables according to your deployment environment.

```text
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=your-database-url
```

Do not commit real secrets or database credentials to GitHub.

### 5. Run migrations

```bash
python manage.py migrate
```

### 6. Create an administrator

```bash
python manage.py createsuperuser
```

### 7. Start the development server

```bash
python manage.py runserver
```

Open `http://127.0.0.1:8000/` in a browser.

## Testing

Run the Django test suite with:

```bash
python manage.py test tasks
```

The tests cover important application behaviour including authentication, task operations, overdue handling, and student-level data isolation.

## Security

- Django authentication is used for login and session management.
- Passwords are stored using Django's password hashing system rather than plain text.
- Forms use Django's CSRF protection.
- Task queries are restricted to the authenticated student so users cannot access another student's tasks through normal application routes.
- Production secrets and database credentials are supplied through environment variables.

## Deployment

The application is deployed on Vercel. Production database configuration uses PostgreSQL through the `DATABASE_URL` environment variable, while local development can use SQLite.

Live application:

https://stp-one-nu.vercel.app/

## Future Enhancements

Possible future improvements include:

- Email or push notifications for approaching deadlines
- Calendar integration
- Mobile application
- Long-term academic analytics
- Additional user roles and permissions
- File attachments for tasks

## Author

Rishi Mishra

B.Tech Computer Science & Engineering

GitHub: https://github.com/RishiMishra06/Stp
