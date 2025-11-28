import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { TreeParser } from '../../shared/parser';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'ai-tree-scaffolder.generate',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      // Get text
      const text = editor.document.getText(editor.selection);
      if (!text.trim()) {
        vscode.window.showErrorMessage(
          'Please highlight the tree structure first.'
        );
        return;
      }

      // Parse
      const result = TreeParser.parse(text);
      const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      if (!rootPath) return;

      // Create
      let count = 0;
      for (const node of result.nodes) {
        const fullPath = path.join(rootPath, node.path);
        if (node.type === 'folder') {
          fs.mkdirSync(fullPath, { recursive: true });
        } else {
          fs.mkdirSync(path.dirname(fullPath), { recursive: true });
          if (!fs.existsSync(fullPath)) fs.writeFileSync(fullPath, '');
        }
        count++;
      }
      vscode.window.showInformationMessage(`Created ${count} items.`);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
