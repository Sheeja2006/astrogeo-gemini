def clean_response(text: str) -> str:
    """Clean up LLM response for frontend display."""
    if not text:
        return "I couldn't generate a response. Please try again."
    return text.strip()