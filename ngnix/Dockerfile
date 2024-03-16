FROM debian:11

RUN apt-get update
RUN apt-get install -y nginx openssl

COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf
COPY ./nginx_start.sh /etc/nginx/

EXPOSE 443

RUN chmod +x /etc/nginx/nginx_start.sh
RUN sh /etc/nginx/nginx_start.sh

ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;"]