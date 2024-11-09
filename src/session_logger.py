import logging
import os


class SessionLogger:
    def __init__(self, session_id: str, session_dir: str):
        """Initialize a new session logger.

        Args:
            session_id (str): Unique identifier for this session.
            session_dir (str): Directory path for session data.
        """
        self.session_id = session_id
        self.session_dir = session_dir
        self._logger = self.setup_logging()

    @property
    def logger(self):
        """Get the logger instance."""
        return self._logger

    @logger.setter
    def logger(self, logger):
        """Set the logger instance."""
        self._logger = logger

    def setup_logging(self):
        """Set up and return a configured logger instance.

        Returns:
            logging.Logger: Configured logger instance for this session
        """

        # Create logs directory if it doesn't exist
        log_dir = os.path.join(self.session_dir, "logs")
        os.makedirs(log_dir, exist_ok=True)

        # Configure logger
        logger = logging.getLogger(f"session_{self.session_id}")
        logger.setLevel(logging.INFO)

        # Create file handler
        log_file = os.path.join(log_dir, f"{self.session_id}.log")
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)

        # Create formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(prefix)s - %(message)s')
        file_handler.setFormatter(formatter)

        # Add handler to logger
        logger.addHandler(file_handler)

        return logger
