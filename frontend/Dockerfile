#
# (1) this is a temporary build docker
#
FROM node:18-alpine as build
LABEL MAINTAINER="Raphael Buchmüller <raphael.buchmueller@dbvis.inf.uni-konstanz.de>"

# set workdir for building the app
WORKDIR /app

# prepare environment
ENV PATH /app/node_modules/.bin:$PATH
RUN apk add --no-cache yarn

# install and cache app dependencies
RUN yarn install --silent

# copy local content to docker for building
COPY . /app

# build frontend
WORKDIR /app
RUN yarn build

#
# (2) the actual docker image using nginx
#
FROM nginx:mainline-alpine
EXPOSE 80

# nginx extended runner
#COPY nginx/run_nginx.sh /usr/run_nginx.sh
#RUN chmod +x /usr/run_nginx.sh
# add nginx specific configuration
#COPY nginx/nginx_default.conf.template /etc/nginx/conf.d/default.conf.template

# copy built app
COPY --from=build /app/dist /usr/share/nginx/html

FROM python:3.6-slim

RUN apt-get clean \
    && apt-get -y update

RUN apt-get -y install \
    nginx \
    python3-dev \
    build-essential

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt --src /usr/local/src

COPY . .

EXPOSE 5000
CMD [ "python", "app.py" ]