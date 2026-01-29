from django.urls import path
from .views import (
    EventListCreateView,
    EventRetrieveUpdateDeleteView,
    ToggleFollowEventView,
    MyFollowedEventsView,
)

urlpatterns = [
    path("", EventListCreateView.as_view(), name="event-list-create"),
    path("<int:pk>/", EventRetrieveUpdateDeleteView.as_view(), name="event-detail"),
    path("<int:event_id>/toggle-follow/", ToggleFollowEventView.as_view(), name="toggle-follow-event"),
    path("me/followed-events/", MyFollowedEventsView.as_view(), name="my-followed-events"),
]
