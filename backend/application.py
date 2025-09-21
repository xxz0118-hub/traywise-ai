import os
import io
import uuid
import json
import datetime as dt

from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename

from PIL import Image, UnidentifiedImageError
import boto3
import botocore

# Optional for local development; EB will use environment variables + instance role
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

# ------------------------------------------------------------------------------
# Configuration
# ------------------------------------------------------------------------------
# Buckets and region should be set as environment variables in EB Configuration
INPUT_BUCKET = os.getenv("INPUT_BUCKET", "traywise-videos")
OUTPUT_BUCKET = os.getenv("OUTPUT_BUCKET", "traywise-outputs")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION", os.getenv("AWS_REGION", "us-east-1"))

# Rekognition tuning
MAX_LABELS = int(os.getenv("REK_MAX_LABELS", "10"))
MIN_CONFIDENCE = float(os.getenv("REK_MIN_CONFIDENCE", "50"))

# Upload constraints
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "bmp", "tiff", "webp"}
MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB

# ------------------------------------------------------------------------------
# Flask app (must be named 'application' for EB)
# ------------------------------------------------------------------------------
application = Flask(__name__)

# ------------------------------------------------------------------------------
# AWS clients: prefer IAM role; boto3 will pick up env vars automatically if set
# ------------------------------------------------------------------------------
session = boto3.session.Session(region_name=AWS_REGION)
rek = session.client("rekognition")
s3 = session.client("s3")


# ------------------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------------------
def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def now_prefix() -> str:
    # e.g., 2025/09/21
    today = dt.datetime.utcnow()
    return f"{today.year:04d}/{today.month:02d}/{today.day:02d}"


def ensure_rgb_jpeg(file_storage) -> bytes:
    """
    Open the uploaded file with PIL, convert to RGB if needed,
    and return JPEG bytes.
    """
    try:
        img = Image.open(file_storage.stream)
        if img.mode != "RGB":
            img = img.convert("RGB")

        out = io.BytesIO()
        img.save(out, format="JPEG", quality=90, optimize=True)
        return out.getvalue()
    except UnidentifiedImageError:
        raise ValueError("Uploaded file is not a valid image.")
    except Exception as e:
        raise ValueError(f"Image processing failed: {str(e)}")


def s3_put_bytes(bucket: str, key: str, body: bytes, content_type: str = "application/octet-stream") -> None:
    s3.put_object(Bucket=bucket, Key=key, Body=body, ContentType=content_type)


def s3_presign_get(bucket: str, key: str, expires: int = 3600) -> str:
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=expires,
    )


# ------------------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------------------
@application.route("/")
def index():
    return render_template("index.html")


@application.route("/upload", methods=["POST"])
def upload():
    """
    Handle image upload, run Rekognition, store original + results in S3,
    and return labels + a presigned URL to the results JSON.
    """
    error = None
    labels = None
    presigned_url = None

    if "image" not in request.files:
        error = "No file part in the request."
        return render_template("index.html", error=error)

    file = request.files["image"]

    if file.filename == "":
        error = "No file selected."
        return render_template("index.html", error=error)

    if not allowed_file(file.filename):
        error = f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        return render_template("index.html", error=error)

    cl = request.content_length or 0
    if cl and cl > MAX_IMAGE_BYTES * 2:  # allow multipart overhead
        error = f"File too large. Max {MAX_IMAGE_BYTES // (1024 * 1024)} MB."
        return render_template("index.html", error=error)

    try:
        # Normalize to JPEG bytes for Rekognition
        jpeg_bytes = ensure_rgb_jpeg(file)

        if len(jpeg_bytes) > MAX_IMAGE_BYTES:
            error = f"Image too large after processing. Max {MAX_IMAGE_BYTES // (1024 * 1024)} MB."
            return render_template("index.html", error=error)

        # Unique keys
        prefix = now_prefix()
        base_name = secure_filename(os.path.splitext(file.filename)[0]) or "upload"
        uid = uuid.uuid4().hex[:12]
        image_key = f"uploads/{prefix}/{base_name}-{uid}.jpg"
        result_key = f"results/{prefix}/{base_name}-{uid}.json"

        # Upload original image to INPUT bucket
        s3_put_bytes(INPUT_BUCKET, image_key, jpeg_bytes, content_type="image/jpeg")

        # Call Rekognition
        response = rek.detect_labels(
            Image={"Bytes": jpeg_bytes},
            MaxLabels=MAX_LABELS,
            MinConfidence=MIN_CONFIDENCE,
        )
        labels = [
            {"name": lbl["Name"], "confidence": round(lbl.get("Confidence", 0.0), 2)}
            for lbl in response.get("Labels", [])
        ]

        # Save labels JSON to OUTPUT bucket
        s3_put_bytes(
            OUTPUT_BUCKET,
            result_key,
            json.dumps(
                {
                    "image_bucket": INPUT_BUCKET,
                    "image_key": image_key,
                    "labels": labels,
                    "max_labels": MAX_LABELS,
                    "min_confidence": MIN_CONFIDENCE,
                    "timestamp": dt.datetime.utcnow().isoformat() + "Z",
                }
            ).encode("utf-8"),
            content_type="application/json",
        )

        # Presigned URL to results JSON
        presigned_url = s3_presign_get(OUTPUT_BUCKET, result_key)

    except rek.exceptions.InvalidImageFormatException:
        error = "Uploaded image format is invalid. Please use JPEG or PNG."
    except rek.exceptions.AccessDeniedException:
        error = "Rekognition access denied. Check IAM role/permissions for Rekognition."
    except botocore.exceptions.ClientError as ce:
        error = f"AWS client error: {ce.response.get('Error', {}).get('Message', str(ce))}"
    except ValueError as ve:
        error = str(ve)
    except Exception as e:
        error = f"Unexpected error: {str(e)}"

    return render_template("index.html", labels=labels, error=error, presigned_url=presigned_url)


@application.route("/results/<path:filename>")
def show_results(filename: str):
    """
    Return a page that links to a presigned URL for the JSON results.
    Accepts either a bare name or nested path; appends .json if missing.
    """
    try:
        clean = filename.strip("/")
        if not clean.endswith(".json"):
            clean = f"{clean}.json"
        if not clean.startswith("results/"):
            result_key = f"results/{clean}"
        else:
            result_key = clean

        presigned = s3_presign_get(OUTPUT_BUCKET, result_key)
        return render_template("view_results.html", result_url=presigned)
    except botocore.exceptions.ClientError as ce:
        msg = ce.response.get("Error", {}).get("Message", str(ce))
        return f"Error locating results for '{filename}': {msg}", 404
    except Exception as e:
        return f"Error generating results page for '{filename}': {str(e)}", 500


@application.route("/health")
def health():
    """
    Simple health check to help EB:
      - ensures S3 buckets are reachable
    """
    try:
        s3.head_bucket(Bucket=INPUT_BUCKET)
        s3.head_bucket(Bucket=OUTPUT_BUCKET)
        return jsonify(
            status="ok",
            region=AWS_REGION,
            input_bucket=INPUT_BUCKET,
            output_bucket=OUTPUT_BUCKET,
        ), 200
    except botocore.exceptions.ClientError as ce:
        return jsonify(status="error", message=str(ce)), 503
    except Exception as e:
        return jsonify(status="error", message=str(e)), 500


if __name__ == "__main__":
    application.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
