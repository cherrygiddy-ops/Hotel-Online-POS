# Stage 1: Build frontend
FROM oven/bun:1 AS build
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
