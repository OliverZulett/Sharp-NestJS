FROM node:16.16 AS builder
LABEL stage=builder

ARG port=$port
ENV PORT ${port}

WORKDIR /app
COPY ["package.json", "./"]
RUN npm install
COPY . .
RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]
