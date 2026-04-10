# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# Thêm hỗ trợ Globalization để tránh lỗi Status 139
USER root
RUN apt-get update && apt-get install -y icu-devtools libicu-dev
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
USER app
WORKDIR /app
EXPOSE 10000
ENV PORT=10000
ENV ASPNETCORE_ENVIRONMENT=Production

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Cấu trúc folder dự án: /ConnectDB/ConnectDB.csproj
COPY ["ConnectDB/ConnectDB.csproj", "ConnectDB/"]
RUN dotnet restore "./ConnectDB/ConnectDB.csproj"

COPY . .
WORKDIR "/src/ConnectDB"
RUN dotnet build "./ConnectDB.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ConnectDB.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ConnectDB.dll"]
