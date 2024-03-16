#!/bin/bash
service nginx status;
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/app.key -out /etc/ssl/certs/app.crt -subj "/C=DE/CN=localhost";