from flask import Flask, render_template, request
import boto3
import os
from dotenv import load_dotenv
from PIL import Image
import io
import json

# Load local .env variables (optional for EB)
load_dotenv()

# Flask app instance (must be called 'application' for EB)
application = Flask(__name__)

# AWS clients
rek = boto3.client(
    'rekognition',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_DEFAULT_REGION')
)

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_DEFAULT_REGION')
)

# S3 bucket names
INPUT_BUCKET = "traywise-videos"
OUTPUT_BUCKET = "traywise-outputs"

@application.route('/')
def index():
    """Home page with upload form"""
    return render_template('index.html')

@application.route('/upload', methods=['POST'])
def upload():
    """Handle image upload, Rekognition, and save results to S3"""
    error = None
    labels = None

    if 'image' not in request.files:
        error = "No file part in the request."
        return render_template('index.html', error=error)

    file = request.files['image']

    if file.filename == '':
        error = "No file selected."
        return render_template('index.html', error=error)

    try:
        # Open image with Pillow
        img = Image.open(file)
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Save image into bytes
        img_bytes_io = io.BytesIO()
        img.save(img_bytes_io, format="JPEG")
        img_bytes = img_bytes_io.getvalue()

        # Upload original image to S3
        s3_client.put_object(Bucket=INPUT_BUCKET, Key=f"test.jpg", Body=img_bytes)
        print(f"Uploaded image to S3: {INPUT_BUCKET}/test.jpg")

        # AWS Rekognition
        response = rek.detect_labels(
            Image={'Bytes': img_bytes},
            MaxLabels=10,
            MinConfidence=50
        )

        labels = [label['Name'] for label in response['Labels']]
        print(f"Detected labels: {labels}")

        # Save labels JSON to S3
        result_key = "results/test.jpg.json"
        s3_client.put_object(Bucket=OUTPUT_BUCKET, Key=result_key, Body=json.dumps(labels))
        print(f"Saved Rekognition results to S3: {OUTPUT_BUCKET}/{result_key}")

        # Generate presigned URL for viewing
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': OUTPUT_BUCKET, 'Key': result_key},
            ExpiresIn=3600
        )
        print(f"Presigned URL: {presigned_url}")

    except rek.exceptions.InvalidImageFormatException:
        error = "Uploaded image format is invalid. Please use JPEG or PNG."
    except rek.exceptions.UnrecognizedClientException:
        error = "AWS credentials invalid. Check your .env file or EB environment variables."
    except Exception as e:
        error = f"Error processing image: {str(e)}"

    return render_template('index.html', labels=labels, error=error, presigned_url=presigned_url if 'presigned_url' in locals() else None)

@application.route('/results/<filename>')
def show_results(filename):
    """Serve a results page for a given uploaded image filename"""
    try:
        result_key = f"results/{filename}.json"
        result_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': OUTPUT_BUCKET, 'Key': result_key},
            ExpiresIn=3600
        )
        print(f"[DEBUG] Presigned URL: {result_url}")
        return render_template('view_results.html', result_url=result_url)
    except Exception as e:
        return f"Error generating results page for '{filename}': {str(e)}"

if __name__ == "__main__":
    application.run(debug=True)
