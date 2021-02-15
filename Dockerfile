# Stage 1 - Build React App inside temporary Node container
FROM node:14.15.4-alpine3.12 as react-build

WORKDIR /usr/src/app
COPY . ./

RUN npm cache clean --force
RUN npm cache verify
RUN npm install
RUN npm run-script build --aot

# Stage 2 - Deploy with NGNIX
FROM nginx:1.15.2-alpine

COPY --from=react-build /usr/src/app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]
