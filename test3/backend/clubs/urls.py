from django.urls import path
from .views import (
    ClubListView,
    ClubDetailView,
    ToggleFollowClubView,
    ClubPostCreateView,
    ClubPostListView,
    AdminClubListCreateView,
    AdminClubDetailView,
    AdminClubPostDetailView,
)

urlpatterns = [
    path("", ClubListView.as_view(), name="club-list"),
    path("<int:pk>/", ClubDetailView.as_view(), name="club-detail"),
    path("<int:pk>/follow/", ToggleFollowClubView.as_view(), name="club-follow"),

    path("<int:club_id>/posts/", ClubPostListView.as_view(), name="club-posts"),
    path("<int:club_id>/posts/create/", ClubPostCreateView.as_view(), name="club-post-create"),

    # Admin routes
    path("admin/clubs/", AdminClubListCreateView.as_view(), name="admin-club-list"),
    path("admin/clubs/<int:pk>/", AdminClubDetailView.as_view(), name="admin-club-detail"),
    path("posts/<int:pk>/", AdminClubPostDetailView.as_view(), name="admin-post-detail"),
    

]
