from .models import AuditLog

class AuditService:
    @staticmethod
    def log_action(admin, entity_type, entity_id, action, previous_data=None, new_data=None, request=None):
        """
        Record an administrative action in the audit log.
        """
        ip = None
        ua = ""
        if request:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            ua = request.META.get('HTTP_USER_AGENT', '')

        AuditLog.objects.create(
            entity_type=entity_type,
            entity_id=entity_id,
            action=action,
            admin=admin,
            previous_data=previous_data,
            new_data=new_data,
            ip_address=ip,
            user_agent=ua
        )
