FROM python:3.9-slim

WORKDIR /python-docker

COPY requirements.txt requirements.txt
COPY products.json products.json
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]
