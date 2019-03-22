# Use an official Python runtime as a parent image
FROM python:3.7

# Set the working directory to /app
WORKDIR /worker

# Copy the current directory contents into the container at /app
COPY . /worker

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt


# Define environment variable
ENV NAME MonitorWorker

# Run app.py when the container launches
CMD ["python", "cpudata.py", "&&", "python", "ramdata.py", "&&", "python", "diskdata.py"]

