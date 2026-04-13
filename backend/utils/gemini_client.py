import os
from dotenv import load_dotenv
from groq import Groq

# Load .env from correct path
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=dotenv_path)

api_key = os.getenv("GROQ_API_KEY")
print(f"✅ Groq key loaded: {api_key[:15] if api_key else '❌ NOT FOUND'}")

client = Groq(api_key=api_key)

SYSTEM_PROMPT = """You are AstroGeo AI, an expert assistant specializing in:

1. GEOGRAPHY — countries, capitals, rivers, mountains, lakes, oceans,
   continents, cities, borders, climate, volcanoes, earthquakes,
   world records (longest, highest, deepest, largest).

2. SPACE & ASTRONOMY — planets, moons, stars, galaxies, black holes,
   space missions, astronauts, rockets, satellites, solar system,
   comets, asteroids, solar flares, telescopes, exoplanets.

Rules:
- Answer ONLY geography or space questions.
- If asked about anything else say: "I specialize only in geography
  and space topics. Please ask me about Earth or the cosmos!"
- Be clear, factual, and engaging.
- Use bullet points when listing multiple facts.
- Add interesting fun facts to make answers more engaging.
- Always be friendly and enthusiastic about science and exploration.
"""

def ask_gemini(user_message: str, chat_history: list = None) -> str:
    """
    Send message to Groq LLaMA and return response.
    Function kept as ask_gemini so app.py doesn't need changes.
    """
    try:
        # Build messages list
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add conversation history if exists
        if chat_history:
            for turn in chat_history:
                role = "assistant" if turn.get("role") == "model" else "user"
                content = turn.get("parts", [""])[0]
                if content:
                    messages.append({"role": role, "content": content})

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"❌ Groq error: {type(e).__name__}: {e}")
        raise e