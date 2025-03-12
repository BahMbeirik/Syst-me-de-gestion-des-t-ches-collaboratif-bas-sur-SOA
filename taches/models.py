from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from django.contrib.auth.models import User

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE,default=1)

    def __str__(self):
        return self.name

class Taches(models.Model):
    def get_default_user():
      return User.objects.first().id
    CATAGORY = (
        ('FINISHED', 'finished'),
        ('IN PROGRESS', 'in progress'),
        ('TO DO', 'to do')
    )
    title = models.CharField(max_length=200)
    body = models.TextField()
    slug = models.SlugField(unique=True, blank=True, null=True)
    catagory = models.CharField(max_length=15, choices=CATAGORY, default='IN PROGRESS')
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    project = models.ForeignKey(Project, related_name='notes', on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name='notes', on_delete=models.CASCADE,default=get_default_user)

    assigned_to = models.ForeignKey(User, related_name='assigned_tasks', on_delete=models.SET_NULL, null=True, blank=True)


    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            slug_base = slugify(self.title)
            slug = slug_base
            if Taches.objects.filter(slug=slug).exists():
                slug = f'{slug_base}-{get_random_string(5)}'
            self.slug = slug
        super().save(*args, **kwargs)


class Comment(models.Model):
    task = models.ForeignKey(Taches, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.task.title}"