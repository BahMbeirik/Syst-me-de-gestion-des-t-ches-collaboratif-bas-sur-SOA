from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'taches', views.TacheViewSet, basename='note')

urlpatterns = [
    path('', include(router.urls)),
    path('sprints-search/', views.search_sprints, name='sprints-search'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('projects/<int:project_id>/taches/', views.taches_list, name='taches_list'),
    
]