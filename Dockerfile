FROM node:20-slim
ADD dist/* /brando-node/
WORKDIR /brando-node
RUN npm i sharp@0.33.5
CMD ["node", "app.js"]
