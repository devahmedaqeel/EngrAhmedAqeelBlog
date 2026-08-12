const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'public', 'images', 'post', 'jarvis-student-ai.png');
const dest = path.join(__dirname, 'public', 'images', 'post', 'meta-react-native-certificate.png');

fs.copyFileSync(src, dest);
console.log('Successfully created public/images/post/meta-react-native-certificate.png');
