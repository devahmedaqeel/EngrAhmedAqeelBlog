const fs = require('fs');
const path = require('path');

const src = 'C:/Users/user/.gemini/antigravity-ide/brain/cdae5f38-f3a0-479c-9002-5da4406dd584/.tempmediaStorage/media_cdae5f38-f3a0-479c-9002-5da4406dd584_1786513534911.png';
const dest = 'c:/Users/user/Downloads/geeky-nextjs-1.0.0/public/images/post/meta-react-native-certificate.png';

fs.copyFileSync(src, dest);
console.log('Successfully copied certificate image to:', dest);
