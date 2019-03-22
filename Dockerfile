# Use an official Python runtime as a parent image
FROM python:3.7

# Set the working directory to /app
WORKDIR /web_app

# Copy the current directory contents into the container at /app
COPY . /web_app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 4200 available to the world outside this container
EXPOSE 5555

# Define environment variable
ENV NAME Monitor

# Run app.py when the container launches
CMD ["gunicorn", "--bind", "0.0.0.0:5555", "--log-level", " error", "wsgi:app"]

