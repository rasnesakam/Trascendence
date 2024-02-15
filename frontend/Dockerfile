# FROM python:3.12

# WORKDIR /app

# COPY . .

# #eğer gerekli sürüm yoksa onun indirilmesi gerekio
# #RUN python3 -m venv ./venv
# #RUN source venv/bin/active

# #COPY requirements.txt .

# ENV PATH="/venv/bin:$PATH"

# COPY ./requirements.txt .

# RUN pip install -r requirements.txt

# EXPOSE  8000

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


FROM python:3.12

WORKDIR /app

COPY . .

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install dependencies:
COPY requirements.txt .
RUN pip install -r requirements.txt

EXPOSE  8000
CMD ["ls", "-al"]