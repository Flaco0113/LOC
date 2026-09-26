import fs from 'node:fs';
// Explicit allowlist: never publish server code, .local data, tests or credentials.
fs.mkdirSync('dist/assets',{recursive:true});
for(const file of ['index.html','styles.css','script.js','ui-state.js','product-model.js','product-ui.js','experience-model.js','experience-ui.js','favicon.svg','assets/loc-hero.png'])fs.copyFileSync(file,'dist/'+file);
