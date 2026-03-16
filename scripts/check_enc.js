const fs = require('fs');
const content = fs.readFileSync('generate_interface.js', 'utf8');
const searchStr = '置物櫃';
const index = content.indexOf(searchStr);
if (index >= 0) {
    console.log('Found "' + searchStr + '" at index ' + index);
    const snippet = content.substring(index, index + 10);
    console.log('Snippet:', snippet);
    console.log('CharCodes:', snippet.split('').map(c => c.charCodeAt(0).toString(16)).join(' '));
} else {
    console.log('"' + searchStr + '" NOT found in generate_interface.js');
    console.log('First 100 chars charCodes:', content.substring(0, 100).split('').map(c => c.charCodeAt(0).toString(16)).join(' '));
}
