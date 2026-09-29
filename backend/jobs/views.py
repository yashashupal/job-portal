from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q, Count
from .models import CustomUser, Job, Application
from .serializers import (
    UserRegistrationSerializer, UserDetailSerializer,
    JobSerializer, ApplicationSerializer, ApplicationStatusUpdateSerializer
)
from .permissions import IsHirer, IsApplicant, IsEmployerOrReadOnly


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserDetailSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserDetailSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsHirer()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Job.objects.filter(is_active=True).select_related('employer')
        
        # Search query
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(company__icontains=search) |
                Q(description__icontains=search) |
                Q(requirements__icontains=search) |
                Q(location__icontains=search)
            )

        # Filters
        job_type = self.request.query_params.get('job_type', None)
        if job_type and job_type != 'All':
            queryset = queryset.filter(job_type=job_type)

        experience_level = self.request.query_params.get('experience_level', None)
        if experience_level and experience_level != 'All':
            queryset = queryset.filter(experience_level=experience_level)

        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location__icontains=location)

        return queryset

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all().select_related('employer')
    serializer_class = JobSerializer
    permission_classes = [IsEmployerOrReadOnly]


class MyJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated, IsHirer]

    def get_queryset(self):
        return Job.objects.filter(employer=self.request.user).annotate(
            total_apps=Count('applications')
        ).order_by('-created_at')


class ApplyJobView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsApplicant]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk, is_active=True)
        except Job.DoesNotExist:
            return Response({'detail': 'Active job not found.'}, status=status.HTTP_404_NOT_FOUND)

        if Application.objects.filter(job=job, applicant=request.user).exists():
            return Response({'detail': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)

        resume = request.FILES.get('resume')
        if not resume:
            return Response({'detail': 'Resume file is required.'}, status=status.HTTP_400_BAD_REQUEST)

        application = Application.objects.create(
            job=job,
            applicant=request.user,
            resume=resume,
            cover_letter=request.data.get('cover_letter', ''),
            portfolio_url=request.data.get('portfolio_url', None)
        )

        serializer = ApplicationSerializer(application, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsApplicant]

    def get_queryset(self):
        return Application.objects.filter(applicant=self.request.user).select_related('job', 'applicant')


class HirerApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsHirer]

    def get_queryset(self):
        queryset = Application.objects.filter(job__employer=self.request.user).select_related('job', 'applicant')
        job_id = self.request.query_params.get('job_id', None)
        if job_id:
            queryset = queryset.filter(job_id=job_id)
        status_filter = self.request.query_params.get('status', None)
        if status_filter and status_filter != 'All':
            queryset = queryset.filter(status=status_filter)
        return queryset


class UpdateApplicationStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHirer]

    def patch(self, request, pk):
        try:
            application = Application.objects.get(pk=pk, job__employer=request.user)
        except Application.DoesNotExist:
            return Response({'detail': 'Application not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        valid_statuses = [s[0] for s in Application.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({'detail': f'Invalid status. Choose from: {valid_statuses}'}, status=status.HTTP_400_BAD_REQUEST)

        application.status = new_status
        application.save()
        return Response(ApplicationSerializer(application, context={'request': request}).data)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'hirer':
            jobs = Job.objects.filter(employer=user)
            total_jobs = jobs.count()
            active_jobs = jobs.filter(is_active=True).count()
            apps = Application.objects.filter(job__employer=user)
            total_apps = apps.count()
            shortlisted_apps = apps.filter(status='shortlisted').count()
            accepted_apps = apps.filter(status='accepted').count()
            return Response({
                'role': 'hirer',
                'total_jobs': total_jobs,
                'active_jobs': active_jobs,
                'total_applications': total_apps,
                'shortlisted': shortlisted_apps,
                'accepted': accepted_apps,
            })
        else:
            apps = Application.objects.filter(applicant=user)
            total_applied = apps.count()
            pending = apps.filter(status='pending').count()
            shortlisted = apps.filter(status='shortlisted').count()
            accepted = apps.filter(status='accepted').count()
            rejected = apps.filter(status='rejected').count()
            return Response({
                'role': 'applicant',
                'total_applied': total_applied,
                'pending': pending,
                'shortlisted': shortlisted,
                'accepted': accepted,
                'rejected': rejected,
            })
