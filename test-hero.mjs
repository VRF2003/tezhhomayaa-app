import fs from 'fs';
const homepage = JSON.parse(fs.readFileSync('./lib/homepage.json', 'utf-8'));
const hero = homepage.sections.find(s => s.type === 'hero-slider');
console.log("Hero data slides length:", hero.data.slides.length);
