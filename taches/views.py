from django.shortcuts import render
from .permissions import IsOwnerOrAdmin
from rest_framework.decorators import action
from taches.models import Project, Taches
from taches.serializers import ProjectSerializer, TacheSerializer
from rest_framework.permissions import AllowAny
from rest_framework import generics, viewsets, filters,status
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated

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

