import pytest
from unittest.mock import Mock, patch
from editor_session import EditorSession
import logging

@pytest.fixture
def editor_session():
    return EditorSession()

@pytest.fixture
def mock_logger():
    logger = Mock(spec=logging.Logger)
    session_logger = Mock()
    session_logger.logger = logger
    return session_logger

def test_editor_session_initialization():
    session = EditorSession()
    assert session.logger is None
    assert session.session_logger is None
    assert session.log_prefix == "editor agent"
    assert session.client is not None

@patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'})
def test_editor_session_with_api_key():
    session = EditorSession()
    assert session.client is not None

def test_set_logger(editor_session, mock_logger):
    editor_session.set_logger(mock_logger)
    assert editor_session.session_logger == mock_logger
    assert editor_session.logger is not None
    assert editor_session.logger.logger == mock_logger.logger
    assert editor_session.logger.extra == {'prefix': 'editor agent'} 