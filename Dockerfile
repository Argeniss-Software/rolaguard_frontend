FROM node:12.2-alpine as build-stage

# Set the working directory to /frontend_app
WORKDIR /frontend_app

# Copy the current directory contents into the container at /frontend_app
COPY . /frontend_app

RUN yarn
RUN yarn build

FROM nginx:1.16-alpine

COPY --from=build-stage /frontend_app/build/ /usr/share/nginx/html
COPY --from=build-stage /frontend_app/start-nginx.sh /opt
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

USER root

RUN chmod +x /opt/start-nginx.sh \
  && dos2unix /opt/start-nginx.sh

ENTRYPOINT [ "sh", "/opt/start-nginx.sh" ]
