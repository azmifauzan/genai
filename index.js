const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI,imageToGenerativePart  } = require('@google/generative-ai');

dotenv.config();
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Gemini API Server is running at http://localhost:${PORT}`);
});

app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  try{
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ output: response.text() });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  const prompt = req.body.prompt || 'Describe the image';
  const imagePath = req.file.path;
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
 
    const imagePart = {
      inlineData: {
        mimeType: req.file.mimetype,
        data: base64Image,
      },
    };

    const result = await model.generateContent([
      { text: prompt },
      imagePart,
    ]);
    const response = await result.response;
    res.json({ output: response.text() });
  } catch (error) {
    console.error('Error generating response from image:', error);
    res.status(500).json({ error: error.message });
  } finally {
    fs.unlinkSync(imagePath);
  }
});

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  const filePath = req.file.path;
  const buffer = fs.readFileSync(filePath);
  const base64File = buffer.toString('base64');
  const mimeType = req.file.mimetype;

  try {
    const documentPart = {
      inlineData: {
        mimeType: mimeType,
        data: base64File,
      },
    };

    const result = await model.generateContent(['Analyze this document:',documentPart]);
    const response = await result.response;
    res.json({ output: response.text() });
  } catch (error) {
    console.error('Error generating response from document:', error);
    res.status(500).json({ error: error.message });
  } finally {
    fs.unlinkSync(filePath);
  }
});

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  const audioBuffer = fs.readFileSync(req.file.path);
  const base64Audio = audioBuffer.toString('base64');
  const audioPart = {
    inlineData: {
      mimeType: req.file.mimetype,
      data: base64Audio,
    },
  };

  try {
    const result = await model.generateContent(['Transcribe or analyze the following audio:', audioPart]);
    const response = await result.response;
    res.json({ output: response.text() });
  } catch (error) {
    console.error('Error generating response from audio:', error);
    res.status(500).json({ error: error.message });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});
