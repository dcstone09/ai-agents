class SessionLogger:
    def __init__(self, session_id: str, session_dir: str):
        """Initialize a new session logger.
        
        Args:
            session_id (str): Unique identifier for this session.
            session_dir (str): Directory path for session data.
        """
        self.session_id = session_id
        self.session_dir = session_dir
        self._logger = None
    
    @property
    def logger(self):
        """Get the logger instance."""
        return self._logger
    
    @logger.setter 
    def logger(self, logger):
        """Set the logger instance."""
        self._logger = logger
