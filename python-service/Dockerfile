FROM python:3.12-slim
LABEL org.opencontainers.image.source https://github.com/mgra-fr/server-api
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN mkdir -p /app/scripts & mkdir -p /app/data
RUN chmod -R 775 /app/scripts & chmod -R 775 /app/data 
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5004
CMD ["python", "app.py"]
