# Use an official node runtime as a parent image
FROM node:8.9-alpine

# # Create a user so that app doesn't run as root
# RUN useradd --user-group --create-home --shell /bin/false app

# # Sets command to be run as user
# USER app

# Create and set working directory
ENV HOME=/home/app
RUN mkdir -p $HOME/grocery
WORKDIR $HOME/grocery

# Copy files
COPY package.json .babelrc $HOME/grocery/
COPY bin/test $HOME/grocery/bin
COPY seeds $HOME/grocery/seeds
COPY server $HOME/grocery/server
COPY test $HOME/grocery/test

# Make directory for modules
# RUN mkdir $HOME/grocery/node_modules

# Install dependencies
RUN npm install

# Run tests
CMD ["npm", "run", "test"]