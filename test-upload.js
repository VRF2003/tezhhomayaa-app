const fs = require('fs');
const path = require('path');

async function test() {
  const formData = new FormData();
  // Creating a tiny valid GIF for testing
  const gifBytes = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
  formData.append("file", new Blob([gifBytes], { type: "image/gif" }), "test.gif");

  const res = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: formData
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
test();
