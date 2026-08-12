const fs = require('fs');
const path = require('path');

const src = 'C:/Users/user/.gemini/antigravity-ide/brain/cdae5f38-f3a0-479c-9002-5da4406dd584/meta_react_native_certificate_1786517541155.png';
const dest = path.join(__dirname, 'public', 'images', 'post', 'meta-react-native-certificate.png');

if (!fs.existsSync(path.dirname(dest))) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Successfully copied generated Meta certificate image to:', dest);
