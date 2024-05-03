import ExtractedData from "../models/tesseract.model.js";
//import { createWorker } from 'tesseract.js';
//import Jimp from 'jimp';

export async function recognizeText(inputStream) {
    const image = await Jimp.read(inputStream);

    const nomRegion = { x: 31, y: 546, width: 1153, height: 699 }; // Example coordinates (adjust as needed)
    const data = await extractTextFromRegion(image, nomRegion);

    console.log(data);

    return data;
}

async function extractTextFromRegion(image, region) {
    try {
        const regionImage = image.clone().crop(region.x, region.y, region.width, region.height);

        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(regionImage.bitmap);
        await worker.terminate();

        return text.trim();
    } catch (error) {
        console.error(error);
        return "Error occurred during OCR";
    }
}

export function extractData(text) {
    const nom = extractValue(text, "NOM\\s*:\\s*(\\w+)");
    const prenom = extractValue(text, "PRÉNOM\\s*:\\s*(\\w+)");
    const identifiant = extractValue(text, "IDENTIFIANT\\s*:\\s*([\\w\\d]+)");

    return new ExtractedData(nom, prenom, identifiant);
}

function extractValue(input, pattern) {
    const regex = new RegExp(pattern);
    const match = regex.exec(input);
    if (match) {
        return match[1];
    }
    return null;
}
