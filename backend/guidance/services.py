
import os
import re
import json
import importlib
from django.conf import settings
from .validators import validate_ai_response

SYSTEM_PROMPT = """
You are DeenInContext – an Islamic Life Context Guidance system. When given a user's real-life situation, you MUST RETURN STRICT JSON matching the schema exactly. Do NOT return explanatory text outside the JSON. The JSON must include keys: category, obligations, ethics, knowledge, mistakes, duas, quran, hadith, reflections. Each value must be arrays except category which is a string.
"""

def extract_json_from_text(text):
    # try to find the first JSON object in text
    m = re.search(r"(\{.*\})", text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
    # fallback: try parse whole text
    try:
        return json.loads(text)
    except Exception:
        raise ValueError('No JSON found')

def _mock_response(user_input):
    # Simple deterministic mock for local development when OPENAI_API_KEY not set
    return {
        'category': 'General Guidance',
        'obligations': [f'Fulfill obligatory duties related to the situation: {user_input[:80]}'],
        'ethics': ['Act with patience and kindness.'],
        'knowledge': ['Seek knowledge from reliable scholars.'],
        'mistakes': ['Avoid hasty decisions without consultation.'],
        'duas': ['"Rabbi zidni ilma" (Make Dua for guidance)'],
        'quran': ['Surah Al-Fatiha (general supplication)'],
        'hadith': ['Seek counsel; Prophet ﷺ emphasized consultation.'],
        'reflections': ['Reflect on intentions and possible outcomes.']
    }

def call_ai_for_guidance(user_input):
    # If OpenAI package or API key not available, use a safe mocked response for local demo
    openai_spec = importlib.util.find_spec('openai')
    openai_key = settings.OPENAI_API_KEY or os.getenv('OPENAI_API_KEY')
    if not openai_spec or not openai_key:
        validated = validate_ai_response(_mock_response(user_input))
        return validated

    # import openai lazily to avoid requiring pydantic_core at module import time
    openai = importlib.import_module('openai')
    openai.api_key = openai_key

    prompt = SYSTEM_PROMPT + "\nUser input:\n" + user_input + "\nReturn only JSON."
    try:
        resp = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[{'role':'system','content':SYSTEM_PROMPT},{'role':'user','content':user_input}],
            max_tokens=800,
            temperature=0.2,
        )
    except Exception:
        # if OpenAI call fails, fallback to mock
        validated = validate_ai_response(_mock_response(user_input))
        return validated

    text = resp['choices'][0]['message']['content']
    try:
        data = extract_json_from_text(text)
    except Exception:
        raise ValueError('AI did not return valid JSON')
    # validate
    validated = validate_ai_response(data)
    return validated
