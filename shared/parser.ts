// shared/parser.ts

export interface FileSystemNode {
  path: string;
  name: string;
  type: 'file' | 'folder';
  depth: number;
}

export interface ParseResult {
  nodes: FileSystemNode[];
  errors: string[];
  success: boolean;
}

export class TreeParser {
  private static readonly INDENT_BLOCK_SIZE = 4;

  public static parse(structure: string): ParseResult {
    const lines = structure.split('\n');
    const nodes: FileSystemNode[] = [];
    const errors: string[] = [];

    let dirStack: string[] = [];
    let currentStackDepth = -1;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trimEnd();
      if (!line.trim()) continue;

      try {
        // --- STEP 1: Determine Indentation ---
        const prefixMatch = line.match(/^[\s│├└─]*/);
        const prefixLength = prefixMatch ? prefixMatch[0].length : 0;
        const indentLevel = Math.floor(prefixLength / this.INDENT_BLOCK_SIZE);

        // --- STEP 2: Extract Filename & Remove Comments ---
        // Get the part of the line after the tree structure
        let rawName = line.substring(prefixLength);

        // [FIX] Strip Comments
        // Look for the first occurrence of " #" or "# " or just "#"
        // Adjust regex based on strictness. This catches " # comment" and "  #comment"
        const commentIndex = rawName.indexOf(' #');
        if (commentIndex !== -1) {
          rawName = rawName.substring(0, commentIndex);
        }

        // Also handle cases where a user might use "//" for comments
        const slashCommentIndex = rawName.indexOf(' //');
        if (slashCommentIndex !== -1) {
          rawName = rawName.substring(0, slashCommentIndex);
        }

        // Final trim to remove the space before the comment
        rawName = rawName.trim();

        if (!rawName) continue;

        // --- STEP 3: Stack Management ---
        while (currentStackDepth >= indentLevel) {
          dirStack.pop();
          currentStackDepth--;
        }

        // --- STEP 4: Classify & Store ---
        const isFolder = rawName.endsWith('/');
        const cleanName = isFolder ? rawName.slice(0, -1) : rawName;

        if (isFolder) {
          dirStack.push(cleanName);
          currentStackDepth = indentLevel;

          nodes.push({
            path: dirStack.join('/'),
            name: cleanName,
            type: 'folder',
            depth: indentLevel,
          });
        } else {
          const fullPath = [...dirStack, cleanName].join('/');
          nodes.push({
            path: fullPath,
            name: cleanName,
            type: 'file',
            depth: indentLevel,
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Line ${i + 1}: ${msg}`);
      }
    }

    return {
      nodes,
      errors,
      success: errors.length === 0,
    };
  }
}
