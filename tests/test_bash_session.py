import pytest
from unittest.mock import Mock, patch
from bash_session import BashSession
import anthropic
import logging

@pytest.fixture
def bash_session():
    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
        return BashSession()

@pytest.fixture
def mock_logger():
    logger = Mock(spec=logging.Logger)
    session_logger = Mock()
    session_logger.logger = logger
    return session_logger

def test_set_logger(bash_session, mock_logger):
    bash_session.set_logger(mock_logger)
    assert bash_session.session_logger == mock_logger
    assert isinstance(bash_session.logger, logging.LoggerAdapter)
    assert bash_session.logger.extra['prefix'] == 'bash agent'

def test_run_tool_calls(bash_session):
    # Mock content blocks
    mock_content = [
        anthropic.types.ContentBlock(
            type="tool_use",
            name="bash",
            text="ls -la"
        ),
        anthropic.types.ContentBlock(
            type="text",
            text="Some regular text"
        )
    ]
    
    with patch.object(bash_session, 'run_tool_call') as mock_run_tool_call:
        mock_run_tool_call.return_value = "mocked bash output"
        results = bash_session.run_tool_calls(mock_content)
        
        assert len(results) == 1
        assert results[0] == "mocked bash output"
        mock_run_tool_call.assert_called_once()

def test_run(bash_session, mock_logger):
    bash_session.set_logger(mock_logger)
    
    mock_response = Mock()
    mock_response.content = []
    
    with patch.object(bash_session.client.beta.messages, 'create') as mock_create:
        mock_create.return_value = mock_response
        
        with patch.object(bash_session, 'run_tool_calls') as mock_run_tool_calls:
            mock_run_tool_calls.return_value = ["command output"]
            
            bash_session.run("test prompt")
            
            # Verify the message was added to the messages list
            assert bash_session.messages[-1] == {
                "role": "user",
                "content": "test prompt"
            }
            
            # Verify Claude API was called with correct parameters
            mock_create.assert_called_once_with(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4096,
                messages=bash_session.messages,
                system="You are a helpful assistant that can help with bash commands.",
                tools=[{"type": "bash_20241022", "name": "bash"}],
                betas=["computer-use-2024-10-22"],
            )
            
            # Verify logging occurred
            bash_session.logger.info.assert_called_once_with(mock_response) 