from django.urls import path, include

from auths.views import CurrentUserView, LoginView, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
]