# Use an official node runtime as a parent image
FROM node:8.9-alpine

# Set the working directory
WORKDIR /

# Copy the directory contents into container
ADD ./server /server
ADD ./bin/dev /bin/dev
ADD ./package.json /package.json
ADD ./.babelrc /.babelrc

# Install packages
RUN npm install

# Expose port
EXPOSE 3000

# Run tests
CMD ["npm", "start"]