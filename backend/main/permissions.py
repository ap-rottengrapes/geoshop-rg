from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allow access if request.user is the object's owner OR is superuser.
    """

    def has_object_permission(self, request, view, obj):
        # Allow safe methods if needed (but object-level check used for unsafe methods)
        if request.user and request.user.is_authenticated:
            return obj.owner == request.user or request.user.is_superuser
        return False

