FROM python:3.14.4 AS backend
WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD [ "fastapi", "dev", "main.py", "--host", "0.0.0.0", "--port", "8000" ]
