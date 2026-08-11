const fs = require("fs");
const path = require("path");

const files = [
  path.join(__dirname, "pages/rss.xml.js"),
  path.join(__dirname, "pages/feed.json.js"),
];

files.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted conflicting file: ${file}`);
  }
});
