FROM python:3.7

RUN apt-get -y update \
  && apt-get install -y sysstat \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Define environment variable
ENV NAME Monitor


