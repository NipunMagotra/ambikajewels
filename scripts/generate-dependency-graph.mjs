import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { Graphviz } from '@hpcc-js/wasm-graphviz';

async function main() {
  console.log('Running madge to analyze TypeScript dependencies...');
  const jsonOutput = execSync(
    'npx -y madge --ts-config ./tsconfig.json --json --extensions ts,tsx src',
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
  );

  const dependencies = JSON.parse(jsonOutput);
  console.log(`Analyzed ${Object.keys(dependencies).length} source files.`);

  // Categorize nodes into clusters
  const clusters = {
    app: { label: 'Next.js App & API Routes', color: '#1e293b', font: '#f8fafc', nodes: [] },
    components: { label: 'React UI Components', color: '#0f766e', font: '#ffffff', nodes: [] },
    lib: { label: 'Core Libraries & Security', color: '#7c2d12', font: '#ffffff', nodes: [] },
    data_context: { label: 'Context, Data & Config', color: '#431407', font: '#ffffff', nodes: [] },
  };

  const allFiles = new Set(Object.keys(dependencies));
  for (const deps of Object.values(dependencies)) {
    for (const d of deps) allFiles.add(d);
  }

  function getNodeCluster(file) {
    if (file.startsWith('app/')) return 'app';
    if (file.startsWith('components/')) return 'components';
    if (file.startsWith('lib/')) return 'lib';
    return 'data_context';
  }

  function getNodeStyle(file) {
    if (file.startsWith('app/api/')) {
      return 'fillcolor="#312e81" fontcolor="#ffffff" color="#4338ca" style="filled,rounded"';
    }
    if (file.startsWith('app/')) {
      return 'fillcolor="#1e293b" fontcolor="#f8fafc" color="#334155" style="filled,rounded"';
    }
    if (file.startsWith('components/')) {
      return 'fillcolor="#064e3b" fontcolor="#ecfdf5" color="#047857" style="filled,rounded"';
    }
    if (file.startsWith('lib/')) {
      return 'fillcolor="#7c2d12" fontcolor="#ffedd5" color="#c2410c" style="filled,rounded"';
    }
    return 'fillcolor="#78350f" fontcolor="#fef3c7" color="#d97706" style="filled,rounded"';
  }

  let dot = `digraph AmbikaJewelsDependencies {
  graph [rankdir=LR, bgcolor="#0a0a0c", pad="0.5", nodesep="0.4", ranksep="0.8", fontname="Helvetica"];
  node [shape=box, style="filled,rounded", fontname="Helvetica", fontsize=10, margin="0.15,0.08"];
  edge [color="#64748b", arrowsize=0.6, penwidth=1.0];

`;

  // Define nodes
  for (const file of Array.from(allFiles).sort()) {
    const cleanLabel = file.replace(/\\/g, '/');
    dot += `  "${cleanLabel}" [label="${cleanLabel}", ${getNodeStyle(file)}];\n`;
  }

  dot += '\n';

  // Define edges
  for (const [file, deps] of Object.entries(dependencies)) {
    const cleanSrc = file.replace(/\\/g, '/');
    for (const dep of deps) {
      const cleanDep = dep.replace(/\\/g, '/');
      dot += `  "${cleanSrc}" -> "${cleanDep}";\n`;
    }
  }

  dot += '}\n';

  console.log('Rendering DOT graph to SVG using WebAssembly Graphviz...');
  const graphviz = await Graphviz.load();
  const svg = graphviz.dot(dot);

  if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs', { recursive: true });
  }

  fs.writeFileSync('docs/dependency-graph.svg', svg, 'utf-8');

  console.log('Successfully generated docs/dependency-graph.svg');
}

main().catch(err => {
  console.error('Failed to generate dependency graph:', err);
  process.exit(1);
});
