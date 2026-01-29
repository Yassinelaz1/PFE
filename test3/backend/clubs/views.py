from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Club, ClubPost
from .serializers import (
    ClubSerializer,
    ClubDetailSerializer,
    ClubPostSerializer,
    AdminClubSerializer,
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser

#  List clubs
class ClubListView(generics.ListCreateAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


#  Club detail + posts
class ClubDetailView(generics.RetrieveAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {"request": self.request}


#  Follow / Unfollow club
class ToggleFollowClubView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        club = get_object_or_404(Club, pk=pk)
        user = request.user

        if club.followers.filter(id=user.id).exists():
            club.followers.remove(user)
            return Response({"followed": False})
        else:
            club.followers.add(user)
            return Response({"followed": True})


#  Create post (ADMIN ONLY)
class ClubPostCreateView(generics.CreateAPIView):
    serializer_class = ClubPostSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        club = get_object_or_404(Club, id=self.kwargs["club_id"])
        serializer.save(
            created_by=self.request.user,
            club=club
        )



#  List posts by club
class ClubPostListView(generics.ListAPIView):
    serializer_class = ClubPostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        club_id = self.kwargs["club_id"]
        return ClubPost.objects.filter(club_id=club_id).order_by("-created_at")


# -------- ADMIN CLUB MANAGEMENT --------
class AdminClubListCreateView(generics.ListCreateAPIView):
    queryset = Club.objects.all()
    serializer_class = AdminClubSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)



class AdminClubDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Club.objects.all()
    serializer_class = AdminClubSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

class AdminClubPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ClubPost.objects.all()
    serializer_class = ClubPostSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
