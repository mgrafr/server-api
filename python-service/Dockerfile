FROM python:3.11-slim

RUN mkdir -p ./scripts
RUN chmod -R 775 ./scripts
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5000
CMD ["python", "app.py"]
