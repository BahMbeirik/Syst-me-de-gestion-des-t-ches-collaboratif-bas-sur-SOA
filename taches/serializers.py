from rest_framework import serializers
from .models import Taches ,Project

class TacheSerializer(serializers.ModelSerializer):
  class Meta:
    model = Taches
    fields = ('id', 'title', 'body', 'slug', 'catagory','due_date','project', 'owner', 'created_at', 'updated_at')

class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'
        extra_kwargs = {
            'owner': {'read_only': True}  
        }