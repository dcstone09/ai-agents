import anthropic
import os


class EditorSession:
    def __init__(self):
        self.logger = None
        self.client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))