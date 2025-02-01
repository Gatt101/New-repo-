from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load Hugging Face text classifier
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

@app.route("/classify", methods=["POST"])
def classify_text():
    try:
        # Get input text from request
        data = request.get_json()
        input_text = data.get("text")

        if not input_text:
            return jsonify({"error": "No text provided"}), 400

        # Define candidate labels for classification
        candidate_labels = ["send message", "reminder", "greeting", "other"]

        # Classify the text using Hugging Face zero-shot classification
        classification_result = classifier(input_text, candidate_labels)

        # Extract the label with the highest score
        top_label = classification_result["labels"][0]

        # Extract username and message if the classification is 'send message'
        if top_label == "send message":
            try:
                # Extract the first word as the username
                username = input_text.split()[0]

                # Extract the message after the "text message" part
                message = input_text.split("text message", 1)[1].strip()

                # Check if a valid message is extracted
                if not message:
                    return jsonify({"error": "Message format is incorrect."}), 400

                # Return the username and message in the response
                return jsonify({"username": username, "message": message}), 200

            except IndexError:
                return jsonify({"error": "Could not extract username or message from input."}), 400

        # No need for else response, as you don't want to return any classification result
        return jsonify({}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)