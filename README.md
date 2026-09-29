# JobPortal - Full-Stack Job Board Application (Django + React)

A modern, clean, and responsive Job Portal application built with **Django REST Framework** (Backend) and **React + Tailwind CSS** (Frontend).

---

## 🌟 Key Features

### For Candidates / Applicants:
- **Search & Filter**: Find jobs by keywords (title, company, description), location, job type (Full-time, Remote, Internship, Part-time), and experience level.
- **Detailed Job Views**: Comprehensive overview, company specs, requirements, and benefits.
- **1-Click Apply**: Upload resume (PDF, DOCX) and write a cover note.
- **Applicant Dashboard**: Real-time status tracking (Pending Review, Reviewed, Shortlisted, Accepted, Rejected).

### For Employers / Hirers:
- **Publish Job Openings**: Post jobs with title, salary range, location, requirements, and deadlines.
- **Manage Job Postings**: Toggle job status (Active / Closed) or delete listings.
- **Applications Inbox**: Review applicants, inspect resumes, and change status (Shortlisted, Accepted, Rejected) in real time.
- **Overview Metrics**: Active jobs, candidate count, shortlisted candidates, and hires.

---

## 🔑 Demo Credentials (Pre-seeded)

| Role | Username | Password | Email | Notes |
|---|---|---|---|---|
| **Employer / Hirer** | `employer` | `password123` | `employer@example.com` | Has 7 active job listings & applicants |
| **Applicant / Seeker** | `applicant` | `password123` | `applicant@example.com` | Has submitted application with status |

*(You can also register brand new accounts anytime using the Register page)*

---

## 🚀 How to Run the Application

### Option 1: One-Click Run (Recommended)
Double-click:
```
run_all.bat
```
This automatically starts both the Django backend and React frontend dev server, and opens your browser at `http://localhost:5173`.

### Option 2: Run Individually

**Backend:**
Double-click `run_backend.bat` or run:
```bash
venv\Scripts\activate
cd backend
python manage.py runserver 127.0.0.1:8000
```

**Frontend:**
Double-click `run_frontend.bat` or run:
```bash
cd frontend
npm run dev
```

---

## 🌐 URLs
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://127.0.0.1:8000/api/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`
