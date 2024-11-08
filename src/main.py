import argparse

def setup_args():
    parser = argparse.ArgumentParser(description='Claude interaction tool')
    parser.add_argument('prompt', help='The prompt to send to Claude')
    parser.add_argument('--mode', choices=['editor', 'bash'], 
                       default='editor', help='Operation mode: editor or bash')
    return parser.parse_args()

def main():
    args = setup_args()
    print(f"Prompt: {args.prompt}")
    print(f"Mode: {args.mode}")

if __name__ == "__main__":
    # Main entry point
    main()
