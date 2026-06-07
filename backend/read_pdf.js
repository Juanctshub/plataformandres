const fs = require('fs');
const pdf = require('pdf-parse');

async function extractText(pdfPath, txtPath) {
    if (!fs.existsSync(pdfPath)) {
        console.log(`File ${pdfPath} does not exist`);
        return;
    }
    const dataBuffer = fs.readFileSync(pdfPath);
    try {
        const data = await pdf(dataBuffer);
        fs.writeFileSync(txtPath, data.text);
        console.log(`Saved text of ${pdfPath} to ${txtPath}`);
    } catch (err) {
        console.error(`Error reading ${pdfPath}:`, err);
    }
}

async function run() {
    await extractText('C:/Users/PC/Downloads/a.pdf', 'C:/Users/PC/Downloads/a_pdf_text.txt');
    await extractText('C:/Users/PC/Downloads/b.pdf', 'C:/Users/PC/Downloads/b_pdf_text.txt');
}

run();
