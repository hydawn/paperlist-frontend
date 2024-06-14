# Build the React app
FROM node:18 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve the React app using nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
