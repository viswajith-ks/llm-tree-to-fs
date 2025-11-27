import os
import pathlib
import argparse
import sys

PIPE_I = "│"
PIPE_T = "├"
PIPE_L = "└"


def main():
    args = parse_args()
    structure_path = args.structure_file
    if not os.path.exists(structure_path):
        print(f"Error: Cant find the file: {structure_path}")
        sys.exit(1)
    print("DISCLAIMER: This script assumes your filenames dont contain whitespaces!")
    with open(structure_path, "r", encoding="utf-8") as file:
        structure = file.read()

    lines = structure.split("\n")
    dirs: list[str] = []
    parent_indent = -1
    trail_flag = False  # fixes a bug where a subfolder is the last item in its parent (handles a missing pipe)
    trail_indent = 0

    for line in lines:
        words = line.split(" ")
        indent = line.count(PIPE_I)
        indent += line.count(PIPE_T)
        indent += line.count(PIPE_L)
        for word in words:
            if word != "" and "│" not in word and "─" not in word:
                if trail_flag == True:
                    indent += 1
                    if trail_indent + 1 != indent:
                        trail_flag = False
                        indent -= 1

                if word[-1] == "/":
                    if line.count(PIPE_L) > 0:
                        trail_flag = True
                        trail_indent = indent

                    if dirs == []:
                        dirs.append(word)
                        parent_indent += 1
                    elif parent_indent > indent:
                        while parent_indent >= indent:
                            dirs.pop()
                            parent_indent -= 1
                        dirs.append(word)
                        parent_indent = indent
                    elif parent_indent < indent:
                        parent_indent += 1
                        dirs.append(word)
                    else:
                        dirs.pop()
                        dirs.append(word)

                    file_path = pathlib.Path("".join(dirs))
                    file_path.mkdir(parents=True, exist_ok=True)
                else:
                    if parent_indent + 1 > indent:
                        while parent_indent + 1 > indent:
                            dirs.pop()
                            parent_indent -= 1
                        parent_indent = indent - 1

                    file_path = pathlib.Path("".join(dirs) + word)
                    file_path.parent.mkdir(parents=True, exist_ok=True)
                    file_path.touch()
                break


def parse_args():
    parser = argparse.ArgumentParser(
        description="Creates a directory structure from a file definition."
    )
    parser.add_argument(
        "structure_file",
        nargs="?",
        default="structure.md",
        help="Path to the project structure file (default: structure.md)",
    )
    return parser.parse_args()


if __name__ == "__main__":
    main()
