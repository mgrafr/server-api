FROM python:3.12-slim
#LABEL org.opencontainers.image.source https://github.com/mgra-fr/server-api

WORKDIR /app
RUN mkdir -p /app/scripts & mkdir -p /app/data
RUN chmod -R 775 /app/scripts & chmod -R 775 /app/data 
COPY requirements.txt .
#RUN python -m venv /opt/venv
#RUN /opt/venv/bin/pip install --upgrade pip \
 #   && /opt/venv/bin/pip install -r requirements.txt

RUN pip  install --no-cache-dir -r requirements.txt
COPY app.py .
# Ajouter l'environnement virtuel au PATH
#ENV PATH="/opt/venv/bin:$PATH"


EXPOSE 5004
CMD ["python", "app.py"]
