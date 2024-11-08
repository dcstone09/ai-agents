import argparse
from editor_session import EditorSession
from bash_session import BashSession

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

    # TODO: Initialize logging here

    if args.mode == 'editor':
        session = EditorSession()
    elif args.mode == 'bash':
        session = BashSession()

if __name__ == "__main__":
    # Main entry point
    main()
