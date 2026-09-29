from rest_framework import serializers
from .models import CustomUser, Job, Application

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'role', 'first_name', 'last_name', 'phone', 'company_name', 'company_website', 'bio')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name', 'phone', 'company_name', 'company_website', 'bio')


class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.get_full_name', read_only=True)
    employer_email = serializers.EmailField(source='employer.email', read_only=True)
    applications_count = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = (
            'id', 'employer', 'employer_name', 'employer_email',
            'title', 'company', 'location', 'job_type', 'experience_level',
            'salary_min', 'salary_max', 'salary_currency',
            'description', 'requirements', 'benefits', 'is_active',
            'created_at', 'updated_at', 'deadline',
            'applications_count', 'has_applied'
        )
        read_only_fields = ('id', 'employer', 'created_at', 'updated_at', 'applications_count', 'has_applied')

    def get_applications_count(self, obj):
        return obj.applications.count()

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.role == 'applicant':
            return obj.applications.filter(applicant=request.user).exists()
        return False


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_company = serializers.CharField(source='job.company', read_only=True)
    job_location = serializers.CharField(source='job.location', read_only=True)
    job_type = serializers.CharField(source='job.job_type', read_only=True)
    applicant_name = serializers.CharField(source='applicant.get_full_name', read_only=True)
    applicant_username = serializers.CharField(source='applicant.username', read_only=True)
    applicant_email = serializers.EmailField(source='applicant.email', read_only=True)
    applicant_phone = serializers.CharField(source='applicant.phone', read_only=True)

    class Meta:
        model = Application
        fields = (
            'id', 'job', 'job_title', 'job_company', 'job_location', 'job_type',
            'applicant', 'applicant_name', 'applicant_username', 'applicant_email', 'applicant_phone',
            'resume', 'cover_letter', 'portfolio_url', 'status',
            'applied_at', 'updated_at'
        )
        read_only_fields = ('id', 'applicant', 'applied_at', 'updated_at')


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('status',)
