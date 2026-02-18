import json

REQUIRED_KEYS = ['category','obligations','ethics','knowledge','mistakes','duas','quran','hadith','reflections']

class ValidationError(Exception):
    pass

def validate_ai_response(data):
    """Lightweight validator that ensures the AI response matches the required
    structure. This avoids heavy jsonschema dependencies for local dev.
    """
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except Exception:
            raise ValidationError('Response is not valid JSON')

    if not isinstance(data, dict):
        raise ValidationError('Response must be a JSON object')

    for key in REQUIRED_KEYS:
        if key not in data:
            raise ValidationError(f'Missing required key: {key}')

    # check types
    if not isinstance(data.get('category'), str):
        raise ValidationError('`category` must be a string')

    for arr_key in ['obligations','ethics','knowledge','mistakes','duas','quran','hadith','reflections']:
        if not isinstance(data.get(arr_key), list):
            raise ValidationError(f'`{arr_key}` must be an array')

    return data
