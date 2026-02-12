from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    # Add this ready() method
    def ready(self):
        import core.signals # This line imports and activates your signals
