import os
import pytest
import logging
from session_logger import SessionLogger


@pytest.fixture
def temp_session_dir(tmp_path):
    """Create a temporary directory for session data."""
    return str(tmp_path)


@pytest.fixture
def session_logger(temp_session_dir):
    """Create a SessionLogger instance for testing."""
    return SessionLogger("test_session", temp_session_dir)


def test_session_logger_initialization(session_logger):
    """Test if SessionLogger initializes correctly."""
    assert session_logger.session_id == "test_session"
    assert isinstance(session_logger.logger, logging.Logger)
    assert session_logger.logger.name == "session_test_session"


def test_log_directory_creation(temp_session_dir, session_logger):
    """Test if log directory is created."""
    log_dir = os.path.join(temp_session_dir, "logs")
    assert os.path.exists(log_dir)
    assert os.path.isdir(log_dir)


def test_log_file_creation(temp_session_dir, session_logger):
    """Test if log file is created and writable."""
    log_file = os.path.join(temp_session_dir, "logs", "test_session.log")
    assert os.path.exists(log_file)
    
    # Test writing to log
    test_message = "Test log message"
    session_logger.logger.info(test_message, extra={"prefix": "TEST"})
    
    with open(log_file, 'r') as f:
        log_content = f.read()
        assert "TEST" in log_content
        assert test_message in log_content


def test_logger_setter(session_logger):
    """Test if logger setter works."""
    new_logger = logging.getLogger("new_logger")
    session_logger.logger = new_logger
    assert session_logger.logger == new_logger


def test_logger_configuration(session_logger):
    """Test logger configuration."""
    logger = session_logger.logger
    
    assert logger.level == logging.INFO
    assert len(logger.handlers) == 1
    
    handler = logger.handlers[0]
    assert isinstance(handler, logging.FileHandler)
    assert handler.level == logging.INFO
    
    formatter = handler.formatter
    expected_format = '%(asctime)s - %(name)s - %(levelname)s - %(prefix)s - %(message)s'
    assert formatter._fmt == expected_format 