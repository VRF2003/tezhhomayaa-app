const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });
cloudinary.config({ secure: true });

async function run() {
  try {
    const res = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", {
      folder: "tezhhomayaa_app"
    });
    console.log("Success:", res.secure_url);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
