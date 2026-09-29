from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, CurrentUserView,
    JobListCreateView, JobDetailView, MyJobsView,
    ApplyJobView, MyApplicationsView, HirerApplicationsView,
    UpdateApplicationStatusView, DashboardStatsView
)

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),

    # Jobs endpoints
    path('jobs/', JobListCreateView.as_view(), name='job_list_create'),
    path('jobs/my-jobs/', MyJobsView.as_view(), name='my_jobs'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job_detail'),
    path('jobs/<int:pk>/apply/', ApplyJobView.as_view(), name='apply_job'),

    # Applications endpoints
    path('applications/my-applications/', MyApplicationsView.as_view(), name='my_applications'),
    path('applications/hirer-applications/', HirerApplicationsView.as_view(), name='hirer_applications'),
    path('applications/<int:pk>/status/', UpdateApplicationStatusView.as_view(), name='update_application_status'),

    # Dashboard Statistics
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
