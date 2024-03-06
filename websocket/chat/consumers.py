import json
from channels.generic.websocket import WebsocketConsumer
from channels.auth import login, logout
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
import re

# TODO: bu APP_NAME değerini .env dosyasından çek
APP_NAME = "localhost"

"""
    Fiiller
    fetch: mesajları çekme
    send: mesaj gönderme
    ping: durum görüntüleme
"""

class ChatConsumer(WebsocketConsumer):

    def send_chat_message(self, message, sendto): 
        async_to_sync(self.channel_layer.group_send)(
            sendto,
            {
                'type':'chat_message',
                'message':{
                    "message": message,
                    "from": self.room_group_name
                }
            }
        )


    def chat_message(self, event):
        message = event['message']

        self.send(text_data=json.dumps(message))


    def connect(self):
        path = self.scope["path"]
        url_pattern = r"^/ws/socket-server/(.*)$"
        username = re.match(url_pattern, path).group(1)
        
        self.room_group_name = username
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


    def receive(self, text_data):
        data = json.loads(text_data)
        #self.send(json.dumps({"message": data.get("message"), "to": data.get("to") }))
        message_type = data.get("type", None)
        if message_type is not None:
            self.send_chat_message(data.get("message"), data.get("to"))
        else:
            self.send(json.dumps({"message": "You need to set type for message type"}))
