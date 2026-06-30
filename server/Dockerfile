FROM node:18-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Use migration script and start
CMD ["sh", "-c", "npx prisma db push && npm run start"]
