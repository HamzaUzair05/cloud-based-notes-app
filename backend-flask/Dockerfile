FROM python:3.11-slim

WORKDIR /app

# Copy requirements first
COPY requirements.txt .

# Install dependencies with explicit installation of boto3
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir boto3

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5000

# Run the app
CMD ["python", "backend.py"]
