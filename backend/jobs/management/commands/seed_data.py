from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from jobs.models import CustomUser, Job, Application
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Seeds initial users, realistic jobs, and sample applications'

    def handle(self, *args, **options):
        self.stdout.write("Seeding database...")

        # 1. Create Demo Hirer
        hirer, created = CustomUser.objects.get_or_create(
            username='employer',
            defaults={
                'email': 'employer@example.com',
                'first_name': 'Sarah',
                'last_name': 'Jenkins',
                'role': 'hirer',
                'company_name': 'TechCorp Solutions',
                'company_website': 'https://techcorp.example.com',
                'bio': 'VP of Engineering at TechCorp Solutions, building future-ready SaaS platforms.',
                'phone': '+91 98765 43210'
            }
        )
        if created:
            hirer.set_password('password123')
            hirer.save()
            self.stdout.write(self.style.SUCCESS("Created demo employer: employer / password123"))
        else:
            hirer.set_password('password123')
            hirer.save()

        # 2. Create Demo Applicant
        applicant, created = CustomUser.objects.get_or_create(
            username='applicant',
            defaults={
                'email': 'applicant@example.com',
                'first_name': 'Aarav',
                'last_name': 'Sharma',
                'role': 'applicant',
                'phone': '+91 91234 56789',
                'bio': 'Passionate Full Stack Developer with 3+ years experience building web applications using React, Python, and Django.'
            }
        )
        if created:
            applicant.set_password('password123')
            applicant.save()
            self.stdout.write(self.style.SUCCESS("Created demo applicant: applicant / password123"))
        else:
            applicant.set_password('password123')
            applicant.save()

        # 3. Create Demo Jobs
        jobs_data = [
            {
                'title': 'Senior Full Stack Developer (React & Django)',
                'company': 'TechCorp Solutions',
                'location': 'Bengaluru (Hybrid)',
                'job_type': 'Full-time',
                'experience_level': 'Senior Level',
                'salary_min': 1800000,
                'salary_max': 2500000,
                'salary_currency': 'INR',
                'description': 'We are looking for a Senior Full Stack Engineer to lead the architecture and development of our flagship analytics platform. You will build highly responsive UI components in React and performant REST APIs with Django.',
                'requirements': '• 4+ years of hands-on experience with Python and Django / Django REST Framework.\n• 3+ years of expertise in React, TypeScript, and modern state management.\n• Solid understanding of relational databases (PostgreSQL, SQLite), query optimization, and caching.\n• Strong experience building and maintaining RESTful APIs and microservices.\n• Familiarity with Docker, CI/CD pipelines, and cloud hosting (AWS / GCP).',
                'benefits': '• Competitive compensation + annual performance bonus\n• Comprehensive health insurance for you and your family\n• Flexible hybrid working model and modern office space\n• Annual learning stipend for conferences, books, and courses\n• Home office workstation setup allowance',
                'deadline': date.today() + timedelta(days=30),
            },
            {
                'title': 'Frontend React Engineer',
                'company': 'PixelCraft Studio',
                'location': 'Remote',
                'job_type': 'Remote',
                'experience_level': 'Mid Level',
                'salary_min': 1200000,
                'salary_max': 1600000,
                'salary_currency': 'INR',
                'description': 'PixelCraft Studio is seeking a talented Frontend Engineer obsessed with crafting fast, accessible, and delightful digital user experiences using React, Tailwind CSS, and Next.js.',
                'requirements': '• 2+ years of professional React development.\n• Deep knowledge of CSS, Tailwind CSS, responsive design, and CSS animations.\n• Experience integrating REST/GraphQL APIs and handling client-side state.\n• Keen eye for UI/UX detail and pixel-perfect implementation.',
                'benefits': '• 100% remote work flexibility\n• Flexible working hours\n• Annual company offsites\n• Wellness allowance',
                'deadline': date.today() + timedelta(days=20),
            },
            {
                'title': 'Python Backend Developer',
                'company': 'DataFlow Systems',
                'location': 'Hyderabad (On-site)',
                'job_type': 'Full-time',
                'experience_level': 'Mid Level',
                'salary_min': 1000000,
                'salary_max': 1500000,
                'salary_currency': 'INR',
                'description': 'DataFlow is building real-time data pipelines and automation tools. We need a Backend Developer proficient in Python, Django, Celery, and Redis to scale our data ingestion layer.',
                'requirements': '• Strong proficiency in Python, Django ORM, and REST APIs.\n• Experience with background task workers like Celery and Redis.\n• Familiarity with message brokers and asynchronous architectures.\n• Good problem-solving and algorithmic thinking.',
                'benefits': '• Free daily lunch and snacks at our tech campus\n• Health and life insurance\n• Stock options (ESOPs)',
                'deadline': date.today() + timedelta(days=25),
            },
            {
                'title': 'UI/UX Product Designer',
                'company': 'DesignSphere',
                'location': 'Remote',
                'job_type': 'Remote',
                'experience_level': 'Senior Level',
                'salary_min': 1400000,
                'salary_max': 2000000,
                'salary_currency': 'INR',
                'description': 'Join our global product team to design clean, intuitive, and modern interfaces for enterprise and consumer web applications. You will create user journeys, wireframes, and design systems in Figma.',
                'requirements': '• 3+ years experience designing web and mobile applications.\n• Master of Figma, component libraries, and interactive prototyping.\n• Ability to conduct user research and translate feedback into design improvements.\n• Strong portfolio demonstrating clean, accessible, modern UI work.',
                'benefits': '• Flexible schedule & remote stipend\n• Modern MacBook Pro provided\n• Bi-annual performance bonuses',
                'deadline': date.today() + timedelta(days=15),
            },
            {
                'title': 'DevOps & Cloud Engineer',
                'company': 'CloudNine Tech',
                'location': 'Pune (Hybrid)',
                'job_type': 'Full-time',
                'experience_level': 'Senior Level',
                'salary_min': 1600000,
                'salary_max': 2400000,
                'salary_currency': 'INR',
                'description': 'Manage our cloud infrastructure across AWS, set up Kubernetes clusters, maintain CI/CD pipelines, and ensure 99.99% uptime for our applications.',
                'requirements': '• 3+ years in DevOps, SRE, or Cloud Infrastructure.\n• Strong hands-on experience with Docker, Kubernetes, and Terraform.\n• CI/CD pipeline automation (GitHub Actions, GitLab CI).\n• Proficiency in Linux system administration and scripting (Bash / Python).',
                'benefits': '• Hybrid work model\n• Top-tier medical cover\n• Regular hackathons and tech talks',
                'deadline': date.today() + timedelta(days=40),
            },
            {
                'title': 'Junior Web Developer (Internship)',
                'company': 'NextGen Innovators',
                'location': 'Remote',
                'job_type': 'Internship',
                'experience_level': 'Entry Level',
                'salary_min': 25000,
                'salary_max': 40000,
                'salary_currency': 'INR',
                'description': 'An exciting 6-month internship opportunity for passionate fresh graduates or self-taught coders to learn and contribute to production web apps using JavaScript, React, and Python.',
                'requirements': '• Fundamental knowledge of HTML, CSS, JavaScript, and Python.\n• Basic understanding of Git and version control.\n• Eagerness to learn, ask questions, and collaborate with experienced engineers.',
                'benefits': '• High pre-placement offer (PPO) conversion rate\n• Mentorship by senior architects\n• Certificate of completion and letter of recommendation',
                'deadline': date.today() + timedelta(days=10),
            },
            {
                'title': 'Product Marketing Manager',
                'company': 'GrowthWave Media',
                'location': 'Mumbai (On-site)',
                'job_type': 'Full-time',
                'experience_level': 'Mid Level',
                'salary_min': 1100000,
                'salary_max': 1700000,
                'salary_currency': 'INR',
                'description': 'Lead product go-to-market strategies, user acquisition campaigns, content marketing, and brand messaging for our fast-growing B2B product portfolio.',
                'requirements': '• 2-4 years experience in product marketing, growth marketing, or digital campaigns.\n• Excellent written communication and storytelling skills.\n• Analytical mindset with experience in Google Analytics, SEO, and social channels.',
                'benefits': '• Performance-linked commissions\n• Team travel and events\n• Premium health insurance',
                'deadline': date.today() + timedelta(days=35),
            }
        ]

        created_jobs = []
        for j_data in jobs_data:
            job, _ = Job.objects.get_or_create(
                title=j_data['title'],
                company=j_data['company'],
                employer=hirer,
                defaults=j_data
            )
            created_jobs.append(job)

        self.stdout.write(self.style.SUCCESS(f"Created {len(created_jobs)} sample job listings."))

        # 4. Create Sample Application for the first job
        if created_jobs:
            first_job = created_jobs[0]
            dummy_resume = ContentFile(b"%PDF-1.4 Mock resume content for Aarav Sharma", name="aarav_sharma_resume.pdf")
            app, app_created = Application.objects.get_or_create(
                job=first_job,
                applicant=applicant,
                defaults={
                    'resume': dummy_resume,
                    'cover_letter': 'Dear Hiring Team,\n\nI am thrilled to apply for the Senior Full Stack Developer role. With over 3 years of building production apps using React and Django, I am confident in delivering high impact results for TechCorp.\n\nBest regards,\nAarav Sharma',
                    'portfolio_url': 'https://github.com/aaravsharma',
                    'status': 'shortlisted'
                }
            )
            if app_created:
                self.stdout.write(self.style.SUCCESS(f"Created sample application for '{first_job.title}' by {applicant.username}."))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
