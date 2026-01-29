from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from .models import Event
from .serializers import EventSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


# 🔐 Permission custom : admin uniquement
class IsAdminCustom(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_superuser  # ou is_staff
        )


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by("date")
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsAdminCustom()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

# Retrieve / Update / Delete
class EventRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsAdminCustom()]

# Follow / Unfollow
class ToggleFollowEventView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        event = get_object_or_404(Event, id=event_id)
        user = request.user
        if user in event.followers.all():
            event.followers.remove(user)
            return Response({"followed": False})
        else:
            event.followers.add(user)
            return Response({"followed": True})

# My Followed Events
class MyFollowedEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = request.user.followed_events.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)