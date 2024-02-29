import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Message


class ChatConsumer(WebsocketConsumer):
    
    def fetch_messages(self, data):
        messages = Message.last_10_messages()
        content = {
            'message': self.messages_to_json(messages)
        }
        self.send_chat_message(content)

    def new_message(self, data):
        author = self.scope['user']
        message = Message.objects.create(
            author=author, 
            content=data['message'])
        content = {
            'command': 'new_message',
            'message': self.message_to_json(message)
        }
        return self.send_chat_message(content)

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result
    
    def message_to_json(self, message):
        print('deneme')
        return {
            'author': message.author,
            'content': message.content,
            'timestamp': message.timestamp
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
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

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)
        
    def send_chat_message(self, message): 
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def chat_message(self, event):
        message = event['message']
        #self.send(text_data=json.dumps(message))

        # self.send(text_data=json.dumps({
        #     'type':'chat',
        #     'message':message
        # }))