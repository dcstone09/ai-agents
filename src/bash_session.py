import anthropic
import os
import logging
from typing import List

BASH_SYSTEM_PROMPT = "You are a helpful assistant that can help with bash commands."


class BashSession:
    def __init__(self):
        self.logger = None
        self.session_logger = None
        self.client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
        self.log_prefix = "bash agent"
        self.messages = []

    def set_logger(self, logger):
        """Set the logger with a LoggerAdapter to prefix all logs with 'bash agent'"""
        self.session_logger = logger
        self.logger = logging.LoggerAdapter(self.session_logger.logger, {
                                            'prefix': self.log_prefix})

    def run_tool_calls(self, content: List[anthropic.types.ContentBlock]):
        """Execute any bash tool calls and return their results"""
        results = []
        for block in content:
            if block.type == "tool_use" and block.name == "bash":
                self.logger.info(f"Executing bash command: {block.parameters}")
                # TODO: Add actual bash command execution here
                # For now just return mock result
                results.append({
                    "output": f"Simulated output for: {block.parameters}",
                    "error": None
                })
        return results

    def run(self, prompt: str):
        self.messages.append({"role": "user", "content": prompt})

        response = self.client.beta.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            messages=self.messages,
            system=BASH_SYSTEM_PROMPT,
            tools=[{"type": "bash_20241022", "name": "bash"}],
            betas=["computer-use-2024-10-22"],
        )

        self.logger.info(f"Got response: {response}")

        # Add assistant response to conversation
        self.messages.append({
            "role": "assistant",
            "content": response.content
        })
        
        # Process any tool calls
        tool_results = self.run_tool_calls(response.content)
        if tool_results:
            # Add tool results to conversation
            self.messages.append({
                "role": "tool", 
                "content": tool_results
            })
            
            # Get final response after tool use
            response = self.client.beta.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4096,
                messages=self.messages,
                system=BASH_SYSTEM_PROMPT,
                tools=[{"type": "bash_20241022", "name": "bash"}],
                betas=["computer-use-2024-10-22"],
            )
            
            # Add final response to conversation
            self.messages.append({
                "role": "assistant",
                "content": response.content
            })
            
        return response
