FROM registry.access.redhat.com/ubi9/nodejs-18
COPY . .
USER root
RUN npm i
RUN npm run build
CMD ["npm", "run", "serve"]
