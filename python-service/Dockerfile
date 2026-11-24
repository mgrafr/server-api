FROM python:3.12-slim
#LABEL org.opencontainers.image.source https://github.com/mgra-fr/server-api

WORKDIR /app
RUN mkdir -p /app/scripts & mkdir -p /app/data
RUN chmod -R 775 /app/scripts & chmod -R 775 /app/data 
COPY requirements.txt .
COPY app.py .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt



# Configure the Flask application to listen on port 5004
EXPOSE 5004

CMD ["gunicorn", "-w", "4", "--bind", "0.0.0.0:5004", "--access-logfile", "-", "app:app"]
