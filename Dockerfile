# frontend/Dockerfile

# 1. Usamos una versión ligera de Node (la misma que el backend para evitar líos)
FROM node:22-alpine

# 2. Carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos todas las dependencias (incluyendo 'vite' y 'devDependencies')
RUN npm install

# 5. Copiamos el resto del código fuente
COPY . .

# 6. Exponemos el puerto de Vite (5173 por defecto)
EXPOSE 5173

# 7. COMANDO CLAVE: 
# --host 0.0.0.0 es OBLIGATORIO para que Docker deje entrar conexiones desde tu Windows
CMD ["npm", "run", "dev", "--", "--host"]