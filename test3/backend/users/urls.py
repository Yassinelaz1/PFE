from django.urls import path
from .views import RegisterView, LogoutView, MeView
from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView
from .views import AdminUserListCreateView, AdminUserDetailView

urlpatterns = [
    path("register/", RegisterView.as_view()),
     path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("admin/users/", AdminUserListCreateView.as_view()),
    path("admin/users/<int:pk>/", AdminUserDetailView.as_view()),
]
