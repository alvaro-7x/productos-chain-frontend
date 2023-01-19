# etapa de construccion
FROM node:14-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
ENV PATH /app/node_modules/.bin:$PATH
# Se utiliza el archivo web3-token.d.ts para evitar errores al momento de construir la aplicación
COPY web3-token/web3-token.d.ts /app/node_modules/web3-token/dist/web3-token.d.ts
COPY . .
RUN npm run build --configuration development

# etapa de despliegue
FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/* /usr/share/nginx/html
EXPOSE 8080
#CMD ["nginx", "-g", "daemon off;"]
