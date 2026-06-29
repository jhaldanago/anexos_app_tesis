from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

import os
import uuid
import cv2

from model.preprocess import preprocess_image
from model.predictor import predict_image
from model.gradcam import generate_heatmap
from model.gradcam import create_gradcam_image


app = Flask(__name__)


UPLOAD_FOLDER = "static/uploads"

GRADCAM_FOLDER = "static/gradcam"


@app.route("/")
def home():

    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    file = request.files["image"]

    unique_name = f"{uuid.uuid4()}.jpg"

    upload_path = os.path.join(
        UPLOAD_FOLDER,
        unique_name
    )

    file.save(upload_path)

    try:

        img_array = preprocess_image(upload_path)

    except ValueError as e:

        return jsonify({
            "error": str(e)
        }), 400

    prediction_data = predict_image(img_array)

    heatmap = generate_heatmap(
        img_array,
        prediction_data["predicted_index"]
    )

    gradcam = create_gradcam_image(
        upload_path,
        heatmap
    )

    gradcam_name = f"gradcam_{unique_name}"

    gradcam_path = os.path.join(
        GRADCAM_FOLDER,
        gradcam_name
    )

    cv2.imwrite(
        gradcam_path,
        gradcam
    )

    return jsonify({

        "best_class":
            prediction_data["predicted_class"],

        "predictions":
            prediction_data["results"],

        "gradcam_image":
            f"/static/gradcam/{gradcam_name}"
    })


if __name__ == "__main__":

    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)