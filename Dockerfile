FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- NGINX STAGE ----
FROM nginx:alpine

# copy React build
COPY --from=build /app/build /usr/share/nginx/html

# 👉 PUT THIS LINE HERE 👇
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]