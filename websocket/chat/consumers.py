import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import AnonymousUser
from .models import Message
from django.utils.dateformat import DateFormat
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
import requests
import jwt

# TODO: bu APP_NAME değerini .env dosyasından çek
APP_NAME = "localhost"

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
            response = requests.get(f'http://{APP_NAME}/api/auth/token', headers={"Authorization": f"Bearer {token}"})
            print(response)
            print(response.json())
            if response.status_code == 200:
                # Burada token geçerli
                #kullanıcı oluşcak
                try:
                    user_id = jwt.decode(token, algorithms=['HS256'])
                    user = User.objects.get(id = user_id)
                except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                    self.send(text_data=json.dumps({
                        'error': 'Invalid token or user not found.'
                    }))
                    return
            else:
                # burada token geçersiz
                self.send(text_data=json.dumps({
                    'error': 'Invalid token.'
                }))
                return

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
        message_type = data.get("type", None)
        if message_type is not None:
            self.types[data["type"]](self, data)
        else:
            self.send(json.dumps({"message": "You need to set type for message type"}))
        
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
