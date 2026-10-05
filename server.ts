import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import type { Schema } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/generate-vocab', async (req, res) => {
  try {
    const { words } = req.body;
    if (!words || !Array.isArray(words)) {
      return res.status(400).json({ error: 'Invalid request: words array is required' });
    }

    const prompt = `You are a Japanese linguistics expert. For the following list of Japanese vocabulary words, generate detailed study information for JLPT N5 students.
    
    Words to process:
    ${words.map((w: any) => `- ${w.kanji} (${w.meaning || 'meaning unknown'})`).join('\n')}

    For each word, provide:
    1. The kanji (or original word if written in kana).
    2. The furigana (reading in hiragana).
    3. The romaji.
    4. The English meaning.
    5. A natural, beginner-friendly JLPT N5 level Japanese sentence using the word.
    6. The English meaning of the sentence.
    7. 3 contextual Japanese vocabulary distractors (similar type of word, e.g., other verbs or nouns) for a multiple-choice quiz.
    8. 3 contextual Japanese sentence distractors (e.g., if the answer is 開けます, distractors could be 閉めます, 食べます).
    9. A highly descriptive prompt for generating an image that illustrates the word's meaning (imageAlt).`;

    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          kanji: { type: Type.STRING },
          furigana: { type: Type.STRING },
          romaji: { type: Type.STRING },
          english: { type: Type.STRING },
          sentence: { type: Type.STRING, description: 'Natural N5 Japanese sentence' },
          sentenceTarget: { type: Type.STRING, description: 'The conjugated form of the target word as it appears in the sentence' },
          sentenceMeaning: { type: Type.STRING },
          distractors: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 other dictionary-form Japanese words' },
          sentenceDistractors: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 other conjugated words to fit the sentence blank' },
          imageAlt: { type: Type.STRING, description: 'Visual description of the word' },
        },
        required: ['kanji', 'furigana', 'romaji', 'english', 'sentence', 'sentenceTarget', 'sentenceMeaning', 'distractors', 'sentenceDistractors', 'imageAlt']
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2
      }
    });

    if (!response.text) {
      throw new Error('No response from Gemini');
    }

    const generatedInfo = JSON.parse(response.text);
    res.json(generatedInfo);
  } catch (error: any) {
    console.error('Error generating vocab:', error);
    res.status(500).json({ error: error.message || 'Failed to generate vocabulary info' });
  }
});

app.post('/api/upload-vocab-image', (req, res) => {
  try {
    const { id, base64 } = req.body;
    if (!id || !base64) {
      return res.status(400).json({ error: 'id and base64 data are required' });
    }
    const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const dir = path.join(process.cwd(), 'public', 'vocab-images');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, `${id}.jpg`), buffer);
    res.json({ success: true, url: `/vocab-images/${id}.jpg` });
  } catch (err: any) {
    console.error('Error saving image:', err);
    res.status(500).json({ error: err.message || 'Failed to save image' });
  }
});

app.get('/api/vocab-images', (req, res) => {
  try {
    const dir = path.join(process.cwd(), 'public', 'vocab-images');
    if (!fs.existsSync(dir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(dir);
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/download-zip', (req, res) => {
  const zipPath = path.join(process.cwd(), 'public', 'visual-japanese-n5-source.zip');
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'visual-japanese-n5.zip');
  } else {
    res.status(404).json({ error: 'Zip archive not found' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const publicPath = path.join(process.cwd(), 'public');
    app.use(express.static(publicPath));
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
