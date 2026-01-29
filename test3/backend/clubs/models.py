from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

# Model for Clubs
class Club(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to="clubs/", blank=True, null=True)
    content = models.TextField(blank=True)
    files = models.JSONField(default=list, blank=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_clubs"
    )

    followers = models.ManyToManyField(
        User,
        related_name="followed_clubs",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def followers_count(self):
        return self.followers.count()

    def __str__(self):
        return self.name

# Model for Club Posts
class ClubPost(models.Model):
    club = models.ForeignKey(
        Club,
        on_delete=models.CASCADE,
        related_name="posts"
    )

    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to="club_posts/", blank=True, null=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="club_posts"
    )
    file = models.FileField(
        upload_to="club_posts/files/",
        blank=True,
        null=True
    )

    is_public = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.club.name})"
