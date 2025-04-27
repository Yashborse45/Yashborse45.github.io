from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import traceback
from io import BytesIO

app = Flask(__name__)

# Load the trained AI model
model = tf.keras.models.load_model("mobilenet_xenith_40.keras")

# Define categories
class_labels = ["Badminton", "Chess", "Cricket", "Football", "Kabaddi", "Table Tennis", "Volleyball"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files['image']
        img = image.load_img(BytesIO(file.read()), target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions)
        confidence = np.max(predictions)

        category = class_labels[predicted_index] if confidence > 0.5 else "Others"

        return jsonify({"category": category, "confidence": float(confidence)})

    except Exception as e:
        print("🔥 Prediction error:")
        traceback.print_exc()
        return jsonify({"error": "Flask prediction failed"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
