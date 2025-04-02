from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import requests
from io import BytesIO

app = Flask(__name__)

# Load the trained AI model
model = tf.keras.models.load_model("mobilenet_xenith_40.keras")

# Define categories
class_labels = ["Cricket", "Football", "Table Tennis", "Chess", "Kabaddi", "Carrom", "Volleyball"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        image_url = data["imageUrl"]

        # Load image from URL
        response = requests.get(image_url)
        img = image.load_img(BytesIO(response.content), target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0  # Normalize

        # Make prediction
        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions)
        confidence = np.max(predictions)

        # If confidence is low, assign "Others"
        category = class_labels[predicted_index] if confidence > 0.5 else "Others"

        return jsonify({"category": category, "confidence": float(confidence)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
