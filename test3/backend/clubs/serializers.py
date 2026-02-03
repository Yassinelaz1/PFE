from rest_framework import serializers
from .models import Club, ClubPost
from users.models import User


class ClubPostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="created_by.username", read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = ClubPost
        fields = [
            "id",
            "title",
            "content",
            "author_username",
            "likes_count",
            "is_liked",
            "created_at",
        ]

    def get_likes_count(self, obj):
        return obj.liked_by.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        return obj.liked_by.filter(id=request.user.id).exists()


class ClubSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    is_followed = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = [
            "id",
            "name",
            "description",
            "image",
            "followers_count",
            "is_followed",
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_is_followed(self, obj):
        request = self.context.get("request")
        if not request or request.user.is_anonymous:
            return False
        return obj.followers.filter(id=request.user.id).exists()


class ClubDetailSerializer(ClubSerializer):
    posts = ClubPostSerializer(many=True, read_only=True)

    class Meta(ClubSerializer.Meta):
        fields = ClubSerializer.Meta.fields + ["posts"]


class AdminClubSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(
        source="created_by.username", read_only=True
    )

    class Meta:
        model = Club
        fields = [
            "id",
            "name",
            "description",
            "image",
            "created_by",
            "created_by_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]
