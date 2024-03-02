import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import AnonymousUser
from .models import Message
from django.utils.dateformat import DateFormat
import request

class ChatConsumer(WebsocketConsumer):
    def fetch_messages(self, data):
        messages = Message.last_10_messages()
        content = {
            'message': self.messages_to_json(messages)
        }
        self.send_chat_message(content)

    # def new_message(self, data):
    #     author = self.scope['user']
    #     message = Message.objects.create(
    #         author=author, 
    #         content=data['message'])
    #     content = {
    #         'type': 'new_message',
    #         'message': self.message_to_json(message)
    #     }
    #     return self.send_chat_message(content)
    def new_message(self, data):
        user = self.scope['user']
        if isinstance(user, AnonymousUser):
            token = data.get('token', None)
            if token is None:
                # Kullanıcı oturum açmamış, hata mesajı gönder veya kullanıcıyı oturum açma sayfasına yönlendir
                self.send(text_data=json.dumps({
                    'error': 'You must be logged in to send a message.'
                }))
                return
            #kullanıcı oluşuturulacak database
            # token doğrulanacak -backend
        message = Message.objects.create(
            author=user, 
            content=data['message'])
        content = {
            'type': 'new_message',
            'message': self.message_to_json(message)
        }
        return self.send_chat_message(content)

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result
    
    def message_to_json(self, message):
        if isinstance(message.author, AnonymousUser):
            author = "Anonymous"
        else:
            author = message.author.username
        timestamp = DateFormat(message.timestamp).format('Y-m-d H:i:s')
        return {
            'author': author,
            'content': message.content,
            'timestamp': timestamp
        }
    
    def connect(self):
        self.room_group_name = 'test'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()
    
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    types = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }
    def receive(self, text_data):
        data = json.loads(text_data)
        self.types[data['type']](self, data)
        
    def send_chat_message(self, message): 
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':message
            }
        )

    # def send_message(self, message):
    #     self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps(message))
