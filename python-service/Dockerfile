FROM python:3.12-slim
LABEL org.opencontainers.image.source https://github.com/mgra-fr/server-api
LABEL org.opencontainers.image.description run with server-api
WORKDIR /app
RUN mkdir -p /app/scripts & mkdir -p /app/data
RUN chmod -R 775 /app/scripts & chmod -R 775 /app/data 
COPY requirements.txt .
COPY app.py .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /sbin/nologin appuser


#COPY --chown=appuser:appuser . .

USER appuser
EXPOSE 5004
CMD ["python", "app.py"]
