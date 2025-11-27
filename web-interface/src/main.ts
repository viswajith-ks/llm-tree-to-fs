import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { TreeParser } from '../../shared/parser';
import './style.css';

// Clean HTML Structure referencing the classes in style.css
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>LLM tree to life</h1>
    <p class="subtitle">Paste your ASCII folder structure below to generate a project structure.</p>

    <textarea
      id="input"
      placeholder="root/&#10;├── src/&#10;│   └── main.ts&#10;└── README.md"
      spellcheck="false"
    ></textarea>

    <div class="actions">
      <pre id="log"></pre>
      <button id="downloadBtn">Download .ZIP Archive</button>
    </div>
  </div>
`;

// ... keep your existing event listener logic below ...
const btn = document.getElementById('downloadBtn') as HTMLButtonElement;
const input = document.getElementById('input') as HTMLTextAreaElement;
const log = document.getElementById('log') as HTMLPreElement;

btn.addEventListener('click', async () => {
  // Clear previous logs
  log.innerText = '';

  const result = TreeParser.parse(input.value);

  if (result.errors.length > 0) {
    log.innerText = `⚠️ Parsed with ${result.errors.length} warnings (check console)`;
    console.warn(result.errors);
  }

  if (result.nodes.length === 0) {
    log.innerText = '❌ No valid files found.';
    return;
  }

  const zip = new JSZip();
  result.nodes.forEach((node) => {
    if (node.type === 'folder') zip.folder(node.path);
    else zip.file(node.path, '');
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'project-structure.zip');

  // Success feedback
  const originalText = btn.innerText;
  btn.innerText = 'Downloaded! ✅';
  setTimeout(() => (btn.innerText = originalText), 2000);
});
