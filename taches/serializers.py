from rest_framework import serializers
from .models import Taches ,Project ,Comment
from auths.serializers import UserSerializer



class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Pour afficher les détails de l'utilisateur

    class Meta:
        model = Comment
        fields = ['id', 'task', 'user', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class TacheSerializer(serializers.ModelSerializer):
  owner = UserSerializer(read_only=True)
  assigned_to = UserSerializer(read_only=True)  # Afficher les détails de l'utilisateur assigné
  comments = CommentSerializer(many=True, read_only=True)  # Afficher les commentaires liés
  class Meta:
    model = Taches
    fields = ('id', 'title', 'body', 'slug', 'catagory','due_date','project', 'owner', 'created_at', 'updated_at', 'assigned_to', 'comments')

class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'
        extra_kwargs = {
            'owner': {'read_only': True}  
        }
