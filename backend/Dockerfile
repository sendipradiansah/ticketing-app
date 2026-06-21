# Hapus kata '-alpine', gunakan versi penuhnya
FROM node:22

WORKDIR /app

COPY package*.json ./

# Tambahkan --legacy-peer-deps untuk mencegah error bentrok versi antar package
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]