from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_events"
    )
    followers = models.ManyToManyField(
        User,
        related_name="followed_events",
        blank=True
    )

    def __str__(self):
        return self.title
