FROM node:20-alpine

WORKDIR /app

# Install dependencies first so they get cached between code changes.
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
