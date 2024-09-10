# Use an official Python runtime as a parent image
FROM python:3.9

# Install necessary packages for C++
RUN apt-get update && \
    apt-get install -y g++

# Set the working directory to /code
WORKDIR /code

# Copy the current directory contents into the container at /code
COPY ./arena /code
