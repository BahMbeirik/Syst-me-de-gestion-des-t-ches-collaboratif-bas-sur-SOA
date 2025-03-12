from django.shortcuts import render
from .permissions import IsOwnerOrAdmin
from rest_framework.decorators import action
from taches.models import Comment, Project, Taches
from taches.serializers import CommentSerializer, ProjectSerializer, TacheSerializer
from rest_framework.permissions import AllowAny
from rest_framework import generics, viewsets, filters,status
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

# Create your views here.
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.none()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Project.objects.all()
        return Project.objects.filter(owner=user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

        

class TacheViewSet(viewsets.ModelViewSet):
    queryset = Taches.objects.all()
    serializer_class = TacheSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)




@api_view(['GET'])
def taches_list(request, project_id):
    notes = Taches.objects.filter(project_id=project_id)
    serializer = TacheSerializer(notes, many=True)
    return Response({'notes': serializer.data})
    

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


@api_view(['GET'])
def search_sprints(request):
    query = request.query_params.get("search")
    notes = Taches.objects.filter(Q(title__icontains=query) | Q(body__icontains=query) | Q(catagory__icontains=query))
    serializer = TacheSerializer(notes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ✅ API pour assigner une tâche à un utilisateur
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_task(request, task_id):
    try:
        task = Taches.objects.get(id=task_id)
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        assigned_user = User.objects.get(id=user_id)
        task.assigned_to = assigned_user
        task.save()

        return Response({"message": f"Tâche assignée à {assigned_user.username}."}, status=status.HTTP_200_OK)

    except Taches.DoesNotExist:
        return Response({"error": "Tâche non trouvée."}, status=status.HTTP_404_NOT_FOUND)
    except User.DoesNotExist:
        return Response({"error": "Utilisateur non trouvé."}, status=status.HTTP_404_NOT_FOUND)

# ✅ API pour ajouter un commentaire sur une tâche
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, task_id):
    try:
        task = Taches.objects.get(id=task_id)
        content = request.data.get("content")
        if not content:
            return Response({"error": "Le commentaire ne peut pas être vide."}, status=status.HTTP_400_BAD_REQUEST)

        comment = Comment.objects.create(task=task, user=request.user, content=content)

        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

    except Taches.DoesNotExist:
        return Response({"error": "Tâche non trouvée."}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def assigned_taches(request):
    """ إرجاع جميع المهام التي تم تعيينها للمستخدم الحالي """
    user = request.user
    tasks = Taches.objects.filter(assigned_to=user)
    serializer = TacheSerializer(tasks, many=True)
    return Response(serializer.data)