"""Unit tests for the Emotion Detection application."""
# pylint: disable=duplicate-code

import unittest
from unittest.mock import patch

from EmotionDetection.emotion_detection import emotion_detector


class TestEmotionDetector(unittest.TestCase):
    """Test normal and invalid Watson NLP responses."""

    @staticmethod
    def _response(joy=0.9, anger=0.02, disgust=0.01, fear=0.03, sadness=0.04):
        return [
            {
                "emotion_predictions": [
                    {
                        "emotion": {
                            "anger": anger,
                            "disgust": disgust,
                            "fear": fear,
                            "joy": joy,
                            "sadness": sadness,
                        }
                    }
                ]
            }
        ]

    @patch("EmotionDetection.emotion_detection.emotion_model")
    def test_joy_is_dominant(self, model):
        """Return joy as the dominant emotion for happy text."""
        model.run_emotion_model.return_value = self._response()
        result = emotion_detector("I am very happy")
        self.assertEqual(result["dominant_emotion"], "joy")
        self.assertEqual(result["joy"], 0.9)

    @patch("EmotionDetection.emotion_detection.emotion_model")
    def test_anger_is_dominant(self, model):
        """Return anger as the dominant emotion for angry text."""
        model.run_emotion_model.return_value = self._response(
            joy=0.1, anger=0.8, disgust=0.05, fear=0.02, sadness=0.03
        )
        result = emotion_detector("This makes me angry")
        self.assertEqual(result["dominant_emotion"], "anger")

    @patch("EmotionDetection.emotion_detection.emotion_model")
    def test_status_400_returns_empty_result(self, model):
        """Return the required empty shape for a Watson 400 response."""
        model.run_emotion_model.return_value = {"status_code": 400}
        self.assertEqual(
            emotion_detector("invalid response"),
            {
                "anger": None,
                "disgust": None,
                "fear": None,
                "joy": None,
                "sadness": None,
                "dominant_emotion": None,
            },
        )


if __name__ == "__main__":
    unittest.main()
