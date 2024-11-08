import argparse
from datetime import datetime
import uuid
import os

from editor_session import EditorSession
from bash_session import BashSession
from session_logger import SessionLogger

SESSIONS_DIR = os.path.join(os.getcwd(), "sessions")


def setup_args():
    parser = argparse.ArgumentParser(description='AI Assistant')
    parser.add_argument('prompt', help='The prompt to send to AI Assistant')
    parser.add_argument('--mode', choices=['editor', 'bash'],
                        default='editor', help='Operation mode: editor or bash')
    return parser.parse_args()


def main():
    args = setup_args()
    print(f"Prompt: {args.prompt}")
    print(f"Mode: {args.mode}")

    session_id = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{
        str(uuid.uuid4())}"
    logger = SessionLogger(session_id=session_id, session_dir='.')

    if args.mode == 'editor':
        session = EditorSession()
    elif args.mode == 'bash':
        session = BashSession()

    # Set the logger for the session
    session.logger = logger


if __name__ == "__main__":
    # Main entry point
    main()
