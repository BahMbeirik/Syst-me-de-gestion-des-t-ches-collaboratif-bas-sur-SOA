from rest_framework.permissions import BasePermission

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        # إذن السماح بالوصول فقط إذا كان المستخدم هو المالك أو مشرف
        return request.user == obj.owner or request.user.is_staff
