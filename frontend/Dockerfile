# Ubah juga menjadi versi standar
FROM node:22

WORKDIR /app

COPY package*.json ./

# Gunakan --legacy-peer-deps agar lebih aman
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]