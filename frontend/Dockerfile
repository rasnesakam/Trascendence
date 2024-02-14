FROM python:3.12

RUN python -m venv ./venv
RUN source venv/bin/activate

#-r requirements de versiyon çakışması alındı
RUN pip install -r requirements.txt 

RUN python app/manage.py runserver

EXPOSE 8000
