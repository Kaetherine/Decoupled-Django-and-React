FROM python:3.8

ENV PYTHONUNBUFFERED 1

RUN mkdir /apiproject

WORKDIR /apiproject

ADD . /apiproject/

RUN python -m pip install --upgrade pip && \
    pip install Django djangorestframework django-cors-headers

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
 