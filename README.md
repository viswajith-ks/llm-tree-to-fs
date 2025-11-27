# LLM Tree to file system structures

will read your ai generated ascii project structure and bring it to life.

## Example usage

### your favorite llm's output

```plaintext
my-project/
   ├── src/
   │   ├── components/
   │   │   └── Header.jsx
   │   └── utils/
   └── README.md
```

- copy the content to a file, say ```output.txt```
- run the script ```python3 output.txt```

by default, reads from ```structure.md``` housed at the script's home

```bash
usage: main.py [-h] [structure_file]
```

### disclaimer

the script assumes your filnames dont contain whitespaces
