from django.db import models


class Message(models.Model):

    author = models.CharField(max_length=50)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author
    
    @staticmethod
    def last_10_messages():
        return Message.objects.order_by('-timestamp').all()[:10]