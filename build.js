const fs = require('fs');
const path = require('path');

const targets = process.argv[2]
  ? [process.argv[2]]
  : ['lorax-pairs/o/of04'];

for (const target of targets) {
  buildTarget(target);
}

function buildTarget(targetDir) {
  const srcDir = path.join(targetDir, 'src');
  const componentsDir = path.join(srcDir, 'components');
  const stylesDir = path.join(srcDir, 'styles');

  if (!fs.existsSync(srcDir)) {
    console.error(`No src/ directory found in ${targetDir}`);
    process.exit(1);
  }

  // --- Build HTML ---
  const templatePath = path.join(srcDir, 'page.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  html = html.replace(/@@include\(['"](.+?)['"]\)/g, (match, includePath) => {
    const fullPath = path.join(srcDir, includePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`  [warn] include not found: ${fullPath}`);
      return `<!-- missing: ${includePath} -->`;
    }
    return fs.readFileSync(fullPath, 'utf8');
  });

  const outHtml = path.join(targetDir, 'index.html');
  fs.writeFileSync(outHtml, html, 'utf8');
  console.log(`Built ${outHtml}`);

  // --- Build CSS ---
  if (!fs.existsSync(stylesDir)) {
    console.log(`  No styles/ directory, skipping CSS build.`);
    return;
  }

  const cssFiles = fs.readdirSync(stylesDir)
    .filter(f => f.endsWith('.css'))
    .sort()
    .map(f => path.join(stylesDir, f));

  const css = cssFiles.map(f => {
    const name = path.relative(stylesDir, f);
    return `/* ===== ${name} ===== */\n${fs.readFileSync(f, 'utf8')}`;
  }).join('\n\n');

  const outCss = path.join(targetDir, 'index.css');
  fs.writeFileSync(outCss, css, 'utf8');
  console.log(`Built ${outCss} (${cssFiles.length} files)`);
}
