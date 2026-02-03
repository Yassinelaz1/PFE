from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Club, ClubPost
from .serializers import (
    ClubSerializer,
    ClubDetailSerializer,
    ClubPostSerializer,
    AdminClubSerializer,
)

# ===================== CLUBS =====================

class ClubListView(generics.ListAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}


class ClubDetailView(generics.RetrieveAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}


class ToggleFollowClubView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        club = get_object_or_404(Club, pk=pk)

        if club.followers.filter(id=request.user.id).exists():
            club.followers.remove(request.user)
            return Response({"followed": False})

        club.followers.add(request.user)
        return Response({"followed": True})


# ===================== POSTS =====================

class ClubPostListView(generics.ListAPIView):
    serializer_class = ClubPostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return ClubPost.objects.filter(
            club_id=self.kwargs["club_id"]
        ).order_by("-created_at")

    def get_serializer_context(self):
        return {"request": self.request}


class ClubPostCreateView(generics.CreateAPIView):
    serializer_class = ClubPostSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        club = get_object_or_404(Club, id=self.kwargs["club_id"])
        serializer.save(
            club=club,
            created_by=self.request.user
        )


class ToggleLikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(ClubPost, pk=pk)

        if post.liked_by.filter(id=request.user.id).exists():
            post.liked_by.remove(request.user)
            return Response({"liked": False})

        post.liked_by.add(request.user)
        return Response({"liked": True})


class MyLikedPostsView(generics.ListAPIView):
    serializer_class = ClubPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.liked_posts.all().order_by("-created_at")

    def get_serializer_context(self):
        return {"request": self.request}


# ===================== ADMIN =====================

class AdminClubListCreateView(generics.ListCreateAPIView):
    queryset = Club.objects.all()
    serializer_class = AdminClubSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class AdminClubDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Club.objects.all()
    serializer_class = AdminClubSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminClubPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ClubPost.objects.all()
    serializer_class = ClubPostSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
