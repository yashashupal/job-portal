from rest_framework import permissions

class IsHirer(permissions.BasePermission):
    """
    Allows access only to authenticated users with the 'hirer' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'hirer')


class IsApplicant(permissions.BasePermission):
    """
    Allows access only to authenticated users with the 'applicant' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'applicant')


class IsEmployerOrReadOnly(permissions.BasePermission):
    """
    Allows safe methods for all, but modifying permissions only to the employer who posted the job.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.employer == request.user
