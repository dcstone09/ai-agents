import anthropic
import os

BASH_SYSTEM_PROMPT = "You are a helpful assistant that can help with bash commands."

class BashSession:
    def __init__(self):
        self.logger = None
        self.client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    def run(self, prompt: str):
        messages = [
            {"role": "user", "content": prompt},
        ]
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            messages=messages,
            system=BASH_SYSTEM_PROMPT,
        )
        print(response)
