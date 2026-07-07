const formData = new FormData();
const gifBytes = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
formData.append("file", new Blob([gifBytes], { type: "image/gif" }), "test.gif");
formData.append("upload_preset", "tezhhomayaa_app");

fetch("https://api.cloudinary.com/v1_1/dhezwtyku/image/upload", {
  method: "POST",
  body: formData,
}).then(res => res.json()).then(console.log).catch(console.error);
