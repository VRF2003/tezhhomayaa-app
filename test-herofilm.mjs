import fs from 'fs';
const homepageData = JSON.parse(fs.readFileSync('./lib/homepage.json', 'utf-8'));
const defaultHeroSection = homepageData.sections.find(s => s.type === "hero-slider");
const cmsData = defaultHeroSection.data;

console.log("cmsData:", JSON.stringify(cmsData, null, 2));

const slides = [];

// Simulate HeroFilm logic
let displaySlides = slides;
if (cmsData) {
  if (cmsData.video) {
    console.log("has video");
  } else if (cmsData.slides && cmsData.slides.length > 0) {
    displaySlides = cmsData.slides.map((s, idx) => {
      return {
        id: s.id || `s-${idx}`
      };
    });
  }
}

console.log("displaySlides length:", displaySlides.length);
const slide = displaySlides.length > 0 ? (displaySlides[0]) : null;

if (!slide) {
  console.log("HEROFILM RETURNS NULL");
} else {
  console.log("HEROFILM RENDERS SLIDE");
}
