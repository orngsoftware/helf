FROM python:3.12-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt && pip install python-dotenv

EXPOSE 5001

CMD ["flask", "--app", "user_service.user_service", "run", "--host=0.0.0.0", "--port=5001"]
