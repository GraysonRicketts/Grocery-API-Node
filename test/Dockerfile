# Use an official node runtime as a parent image
FROM node:8.9-alpine

# Create and set working directory
ENV HOME=/home/app
RUN mkdir -p $HOME/grocery
WORKDIR $HOME/grocery

# Copy files
COPY package.json .babelrc $HOME/grocery/

# Install dependencies
RUN npm install

# Run tests
CMD ["npm", "run", "test"]