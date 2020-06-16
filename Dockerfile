FROM nginx:alpine

COPY /dist/ticket-system /usr/share/nginx/html

EXPOSE 9000