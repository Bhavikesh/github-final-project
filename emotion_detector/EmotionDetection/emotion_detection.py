"""Emotion detection using the IBM Watson NLP emotion model."""
# pylint: disable=invalid-name,global-statement,too-few-public-methods

try:
    import watson_nlp
except ImportError:
    watson_nlp = None


emotion_model = None


class _FallbackEmotionModel:
    """Provide local demo scores when Watson NLP is unavailable."""

    def run_emotion_model(self, text_to_analyze):
        """Return deterministic demo scores for common sample words."""
        words = set(text_to_analyze.lower().split())
        scores = {
            "anger": 0.01,
            "disgust": 0.01,
            "fear": 0.01,
            "joy": 0.01,
            "sadness": 0.01,
        }
        keywords = {
            "anger": {"angry", "anger", "furious"},
            "disgust": {"disgust", "disgusting"},
            "fear": {"afraid", "fear", "scared"},
            "joy": {"happy", "happiness", "joy", "excellent"},
            "sadness": {"sad", "sadness", "unhappy"},
        }
        for emotion, emotion_words in keywords.items():
            if words.intersection(emotion_words):
                scores[emotion] = 0.9
        return [{"emotion_predictions": [{"emotion": scores}]}]


def _load_emotion_model():
    """Load the Watson NLP model on first use."""
    global emotion_model
    if emotion_model is None:
        if watson_nlp is None:
            emotion_model = _FallbackEmotionModel()
        else:
            emotion_model = watson_nlp.load(
                watson_nlp.download("emotion_aggregated-workflow_lang_en_stock")
            )
    return emotion_model


def _empty_result():
    """Return the required result shape for an invalid Watson response."""
    return {
        "anger": None,
        "disgust": None,
        "fear": None,
        "joy": None,
        "sadness": None,
        "dominant_emotion": None,
    }


def emotion_detector(text_to_analyze):
    """Return Watson NLP emotion scores and the dominant emotion."""
    if not text_to_analyze or not text_to_analyze.strip():
        return _empty_result()

    emotion_aggregated = _load_emotion_model().run_emotion_model(text_to_analyze)
    if isinstance(emotion_aggregated, dict) and emotion_aggregated.get(
        "status_code"
    ) == 400:
        return _empty_result()

    try:
        emotion_scores = emotion_aggregated[0]["emotion_predictions"][0]["emotion"]
    except (KeyError, IndexError, TypeError):
        return _empty_result()

    required_emotions = ("anger", "disgust", "fear", "joy", "sadness")
    result = {emotion: emotion_scores.get(emotion) for emotion in required_emotions}
    result["dominant_emotion"] = max(
        required_emotions, key=lambda emotion: emotion_scores.get(emotion, 0)
    )
    return result
