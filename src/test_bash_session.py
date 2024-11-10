import pytest
from unittest.mock import patch, MagicMock
from bash_session import BashSession

def test_run_tool_calls_success():
    session = BashSession()
    mock_logger = MagicMock()
    session.set_logger(mock_logger)
    
    # Mock successful command execution
    mock_process = MagicMock()
    mock_process.stdout = "command output"
    mock_process.stderr = ""
    mock_process.returncode = 0
    
    content = [{
        "type": "tool_use",
        "name": "bash",
        "parameters": {"command": "echo test"}
    }]
    
    with patch('subprocess.run', return_value=mock_process):
        results = session.run_tool_calls(content)
        
    assert len(results) == 1
    assert results[0]["output"] == "command output"
    assert results[0]["error"] is None

def test_run_tool_calls_error():
    session = BashSession()
    mock_logger = MagicMock()
    session.set_logger(mock_logger)
    
    # Mock failed command execution
    mock_process = MagicMock()
    mock_process.stdout = ""
    mock_process.stderr = "command failed"
    mock_process.returncode = 1
    
    content = [{
        "type": "tool_use",
        "name": "bash",
        "parameters": {"command": "invalid_command"}
    }]
    
    with patch('subprocess.run', return_value=mock_process):
        results = session.run_tool_calls(content)
        
    assert len(results) == 1
    assert results[0]["output"] == ""
    assert results[0]["error"] == "command failed"

def test_run_tool_calls_exception():
    session = BashSession()
    mock_logger = MagicMock()
    session.set_logger(mock_logger)
    
    content = [{
        "type": "tool_use",
        "name": "bash",
        "parameters": {"command": "echo test"}
    }]
    
    with patch('subprocess.run', side_effect=Exception("Test error")):
        results = session.run_tool_calls(content)
        
    assert len(results) == 1
    assert results[0]["output"] is None
    assert results[0]["error"] == "Test error"
