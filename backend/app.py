from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

print("🚀 Starting AstroGeo Gemini backend...")
from utils.gemini_client import ask_gemini
from utils.formatter import clean_response
print("✅ Gemini client ready!")


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "message": "AstroGeo Gemini AI is running"
    })


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()

    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400

    query = data['message'].strip()

    if not query:
        return jsonify({'reply': 'Please ask a question!'}), 400

    if len(query) > 1000:
        return jsonify({'reply': 'Please keep your question under 1000 characters.'}), 400

    # Get conversation history from request (for multi-turn chat)
    history = data.get('history', [])

    try:
        raw_reply = ask_gemini(query, history)
        reply = clean_response(raw_reply)

        return jsonify({
            'reply': reply,
            'status': 'ok'
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            'reply': 'Something went wrong. Please try again.',
            'status': 'error'
        }), 500


if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, port=port)
    