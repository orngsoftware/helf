FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt && pip install python-dotenv

EXPOSE 5000

CMD ["flask", "--app", "main.main", "run", "--host=0.0.0.0", "--port=5000"]
