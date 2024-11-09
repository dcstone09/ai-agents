import anthropic
import os
import logging


class EditorSession:
    def __init__(self):
        self.logger = None
        self.session_logger = None
        self.client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY"))
        self.log_prefix = "editor agent"

    def set_logger(self, logger):
        """Set the logger with a LoggerAdapter to prefix all logs with 'bash agent'"""
        self.session_logger = logger
        self.logger = logging.LoggerAdapter(self.session_logger.logger, {
                                            'prefix': self.log_prefix})

    def run(self, prompt: str):
        pass
