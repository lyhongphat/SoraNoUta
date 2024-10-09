# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.12.6-alpine3.20

EXPOSE 8000

# Install pip requirements
COPY BACKEND/requirements.txt .
RUN python -m pip install -r requirements.txt

WORKDIR /app
COPY . /app

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
# RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
# USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "BACKEND.main:app"]

CMD ["uvicorn", "BACKEND.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]