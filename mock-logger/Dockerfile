FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --registry=https://registry.npm.taobao.org

COPY . .

# node -r esm app
CMD [ "node", "-r", "esm","app" ]
# CMD [ "node", "--max-old-space-size=4096","-r", "esm","app" ]