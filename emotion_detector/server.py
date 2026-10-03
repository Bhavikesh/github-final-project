"""Flask web application for Watson NLP emotion detection."""

import os

from flask import Flask, render_template_string, request

from EmotionDetection.emotion_detection import emotion_detector


app = Flask(__name__)

PAGE = """
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Emotion Detector</title>
<style>body{font-family:Arial,sans-serif;margin:3rem;max-width:48rem}
textarea{width:100%;padding:.7rem}button{margin-top:1rem;padding:.6rem 1rem}
.error{color:#a00}.result{background:#eef7ee;padding:1rem;margin-top:1rem}</style>
</head><body><h1>Emotion Detector</h1>
<form method="post"><label for="text">Text to analyze</label>
<textarea id="text" name="text" rows="5">{{ text }}</textarea>
<button type="submit">Detect emotions</button></form>
{% if error %}<p class="error" role="alert">{{ error }}</p>{% endif %}
{% if result %}<section class="result"><h2>Result</h2>
<p>Dominant emotion: <strong>{{ result.dominant_emotion }}</strong></p>
<ul>{% for name in emotions %}<li>{{ name }}: {{ result[name] }}</li>{% endfor %}</ul>
</section>{% endif %}</body></html>
"""


@app.route("/", methods=["GET", "POST"])
def index():
    """Render the detector form and process submitted text."""
    text = ""
    result = None
    error = None
    if request.method == "POST":
        text = request.form.get("text", "").strip()
        if not text:
            error = "Please enter text to analyze."
        else:
            try:
                result = emotion_detector(text)
            except RuntimeError as exc:
                error = str(exc)
    return render_template_string(
        PAGE,
        text=text,
        result=result,
        error=error,
        emotions=("anger", "disgust", "fear", "joy", "sadness"),
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=False)
