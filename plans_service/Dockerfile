FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt && pip install python-dotenv

CMD ["flask", "--app", "plans_service.plans_service", "run", "--host=0.0.0.0", "--port=5002"]