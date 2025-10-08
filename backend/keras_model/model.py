from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import traceback
import requests
from io import BytesIO

app = Flask(__name__)
model = tf.keras.models.load_model("mobilenet_xenith_40.keras")

class_labels = ["Badminton", "Chess", "Cricket", "Football", "Kabaddi", "Table Tennis", "Volleyball"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if 'imageUrl' not in data:
            return jsonify({"error": "No imageUrl provided"}), 400

        image_url = data['imageUrl']

        response = requests.get(image_url)
        img = image.load_img(BytesIO(response.content), target_size=(224, 224))

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
