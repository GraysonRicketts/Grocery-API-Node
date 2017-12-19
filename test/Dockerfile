# Use an official node runtime as a parent image
FROM node:8.9

# Set the working directory
WORKDIR /

# Copy the directory contents into container
ADD ./test /test
ADD ./seeds /seeds
ADD ./server /server
ADD ./bin/test /bin/test
ADD ./package.json /package.json
ADD ./.babelrc /.babelrc
ADD ./wait-for-it.sh /wait-for-it.sh

# Install dependencies
RUN npm install