"""Custom permissions for In Sri Lanka API."""
from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Only allows users with role=ADMIN."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ADMIN'
        )


class IsStaffOrAdmin(BasePermission):
    """Allows STAFF and ADMIN users."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in ('STAFF', 'ADMIN')
        )


class IsOwnerOrAdmin(BasePermission):
    """Object-level: owner or admin only."""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN':
            return True
        user_field = getattr(obj, 'user', None)
        return user_field == request.user
