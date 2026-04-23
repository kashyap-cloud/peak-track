FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .

# Set placeholders so Vite bakes them into the static files
ENV VITE_NEON_DATABASE_URL=__VITE_NEON_DATABASE_URL_PLACEHOLDER__
ENV VITE_NEON_PROJECT_ID=__VITE_NEON_PROJECT_ID_PLACEHOLDER__
ENV VITE_NEON_API_KEY=__VITE_NEON_API_KEY_PLACEHOLDER__
ENV VITE_GOOGLE_TRANSLATE_API_KEY=__VITE_GOOGLE_TRANSLATE_API_KEY_PLACEHOLDER__

RUN npm run build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy the static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html/focus_tracker
# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

# Add runtime env injection script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the port that Nginx will listen on
EXPOSE 80

# Use the entrypoint script to replace placeholders at runtime
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
