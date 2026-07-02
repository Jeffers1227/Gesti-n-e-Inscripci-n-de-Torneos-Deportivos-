# 1. Usar una máquina virtual oficial que ya tiene Java 21
FROM eclipse-temurin:21-jdk

# 2. Crear una carpeta de trabajo dentro de la máquina virtual
WORKDIR /app

# 3. Copiar todo el código de tu backend adentro
COPY . .

# 4. Dar permisos y compilar el proyecto (igual que hiciste en tu Mac)
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# 5. Exponer el puerto de tu API
EXPOSE 8090

# 6. Encender el servidor Spring Boot
CMD ["sh", "-c", "java -jar target/*.jar"]