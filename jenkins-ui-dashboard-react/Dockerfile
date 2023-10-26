FROM node:20.9.0-bullseye as builder
COPY . .
RUN npm i
RUN npm run build
FROM nginx:latest
COPY --from=builder /dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]