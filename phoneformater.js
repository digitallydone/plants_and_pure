// phoneFormatter.js
const fs = require('fs');

// Read numbers from input.txt
const inputPath = 'c.txt';
const outputPath = 'output.txt';

fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input file:', err);
    return;
  }

  // Split by lines and format
  const formattedNumbers = data
    .split(/\r?\n/)
    .filter(line => line.trim() !== '')
    .map(num => {
      num = num.trim();
      return num.startsWith('0') ? num : '0' + num;
    });

  // Join and write to new file
  fs.writeFile(outputPath, formattedNumbers.join('\n'), err => {
    if (err) {
      console.error('Error writing output file:', err);
      return;
    }
    console.log('Phone numbers written to', outputPath);
  });
});
