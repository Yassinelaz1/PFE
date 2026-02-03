from django.urls import path
from .views import (
    ClubListView,
    ClubDetailView,
    ToggleFollowClubView,
    ClubPostListView,
    ClubPostCreateView,
    ToggleLikePostView,
    MyLikedPostsView,
    AdminClubListCreateView,
    AdminClubDetailView,
    AdminClubPostDetailView,
)

urlpatterns = [
    # Public
    path("", ClubListView.as_view()),
    path("<int:pk>/", ClubDetailView.as_view()),
    path("<int:pk>/follow/", ToggleFollowClubView.as_view()),
    # Posts
    path("<int:club_id>/posts/", ClubPostListView.as_view()),
    path("<int:club_id>/posts/create/", ClubPostCreateView.as_view()),
    # Likes
    path("posts/<int:pk>/like/", ToggleLikePostView.as_view()),
    path("me/liked-posts/", MyLikedPostsView.as_view()),

    # Admin
    path("admin/clubs/", AdminClubListCreateView.as_view()),
    path("admin/clubs/<int:pk>/", AdminClubDetailView.as_view()),
    path("admin/posts/<int:pk>/", AdminClubPostDetailView.as_view()),

]
