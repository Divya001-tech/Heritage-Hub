import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dynamic Google Gemini SDK getter with telemetry header
function getGeminiClient(): GoogleGenAI | null {
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  if (!geminiApiKey) return null;
  return new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// --------------------------------------------------------------------------
// API Endpoints
// --------------------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'healthy',
    hasGeminiKey: hasKey,
    app: 'Hindustan Culture Atlas',
    timestamp: new Date().toISOString(),
  });
});

// AI Heritage Pipeline: STT / Translation / Summary / Tags / Narrative / Cultural Context
app.post('/api/ai/process-heritage', async (req: Request, res: Response) => {
  try {
    const ai = getGeminiClient();
    const {
      title,
      description,
      language,
      state,
      district,
      category,
      audioBase64,
      audioMimeType,
      sampleText,
    } = req.body;

    if (!title && !description && !audioBase64 && !sampleText) {
      return res.status(400).json({ error: 'Missing content for cultural analysis.' });
    }

    if (!ai) {
      // Graceful fallback simulation if GEMINI_API_KEY is not yet attached
      return res.json({
        transcript: sampleText || `Oral recording documented in ${language || 'regional dialect'} from ${district || 'rural'}, ${state || 'India'}. Recounts ancestral rituals, festive melodies, and community memory passed down through generations.`,
        translation: `[English]: An authentic cultural testament recorded in ${language || 'regional dialect'}. Tells of traditional harvest blessings, sacred lineage invocations, and folk legends venerating the land and ancestors.\n\n[Hindi]: ${state || 'भारत'} के ${district || 'अंचल'} की यह पारंपरिक लोक गाथा पूर्वजों की स्मृतियों, पर्वों और लोक संस्कृति की जीवंत धरोहर है।`,
        summary: `A deeply evocative ${category || 'heritage'} expression from ${district || 'the region'}, ${state || 'India'}. Preserves rare vernacular expressions, ritual structures, and ancestral knowledge at risk of attrition.`,
        tags: [
          'OralTradition',
          'IndigenousKnowledge',
          category ? category.replace(/\s+/g, '') : 'FolkLore',
          state ? state.replace(/\s+/g, '') : 'Heritage',
          language ? language.replace(/\s+/g, '') : 'Dialect',
          'LivingHeritage',
        ],
        narrativeStory: `In the heartlands of ${district || 'our land'}, where the twilight breeze carries the cadence of ${language || 'ancestral speech'}, this tradition was born. Elders would gather under the banyan canopy, passing the sacred verses by heart without parchment. Every phrase echoes the rhythm of monsoon showers, harvests, and communal reverence for nature and kinship.`,
        culturalContext: `Originated within the agrarian and artisan guilds of ${state || 'India'}. Performed during seasonal transitions, life-cycle rituals, or temple festivities. Utilizes indigenous acoustic instruments and unique vernacular idioms now spoken primarily by senior tradition-bearers.`,
      });
    }

    // Prepare prompt for Gemini 3.8 Flash (Cultural Historian)
    const prompt = `ROLE: Cultural Historian
GOAL: Transform uploaded content into a compelling cultural narrative.

Input Details:
- Title: ${title || 'Untitled Tradition'}
- Category: ${category || 'Oral Tradition'}
- Regional Language / Dialect: ${language || 'Vernacular Dialect'}
- State: ${state || 'India'}
- District: ${district || 'Rural District'}
- Raw Description / Transcript snippet: ${description || sampleText || 'Oral recitation recorded from village elders'}

Output must be structured JSON with these exact keys:
1. "culturalSummary": A concise, respectful 2-3 sentence cultural summary highlighting its core significance.
2. "historicalContext": In-depth historical roots, centuries of evolution, hereditary clan lineages, and origin epoch.
3. "traditionalImportance": The role of this tradition in communal life, spiritual devotion, harvest cycles, or moral continuity.
4. "localSignificance": Unique importance specific to ${district || 'this district'} and its geographic ecology.
5. "preservationNotes": Endangerment status, threats from linguistic homogenization, and specific preservation recommendations.
6. "relatedTraditions": Array of 3-5 related intangible cultural heritage traditions across India or adjacent regions.
7. "narrativeStory": An evocative, lyrical narrative retelling (2-3 paragraphs) that brings the sensory atmosphere, acoustic rhythm, and emotion alive for readers.
8. "linguisticNotes": Analysis of vernacular phonetics, archaic vocabulary, metrical cadence, and oral memory mnemonic structures.
9. "transcript": A polished transcription of the oral account or dialect utterance (2-4 sentences in original cadence/vernacular or transliterated script).
10. "translation": High-fidelity dual translation containing both a clear English translation and a lyrical Hindi translation.
11. "tags": An array of 6-9 cultural search tags (e.g. ["OralTradition", "KamaichaBallad", "MarwariDialect", "LivingHeritage"]).
12. "culturalContext": Comprehensive synthesis of ritual instruments, caste/community custodianship, and seasonal performance windows.`;

    const contents: any[] = [];

    // If audio is provided, we can pass audio part or transcribe
    if (audioBase64) {
      contents.push({
        parts: [
          {
            inlineData: {
              mimeType: audioMimeType || 'audio/mp3',
              data: audioBase64,
            },
          },
          { text: prompt },
        ],
      });
    } else {
      contents.push(prompt);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            culturalSummary: { type: Type.STRING },
            historicalContext: { type: Type.STRING },
            traditionalImportance: { type: Type.STRING },
            localSignificance: { type: Type.STRING },
            preservationNotes: { type: Type.STRING },
            relatedTraditions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            narrativeStory: { type: Type.STRING },
            linguisticNotes: { type: Type.STRING },
            transcript: { type: Type.STRING },
            translation: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            culturalContext: { type: Type.STRING },
          },
          required: [
            'culturalSummary',
            'historicalContext',
            'traditionalImportance',
            'localSignificance',
            'preservationNotes',
            'relatedTraditions',
            'narrativeStory',
            'linguisticNotes',
            'transcript',
            'translation',
            'tags',
            'culturalContext',
          ],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    if (!parsed.summary) {
      parsed.summary = parsed.culturalSummary;
    }
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/process-heritage:', error);
    res.status(500).json({
      error: error.message || 'Cultural processing failed',
      culturalSummary: 'Sacred community tradition reflecting the living heritage of Bharat.',
      historicalContext: 'Preserved by hereditary custodians across generations.',
      traditionalImportance: 'Essential anchor of village identity and seasonal ceremony.',
      localSignificance: 'Deeply tied to local ecology and dialect.',
      preservationNotes: 'Urgent archival attention needed.',
      relatedTraditions: ['Folk Songs', 'Vernacular Dialects'],
      narrativeStory: 'An ancestral voice echoing the timeless traditions of the community.',
      linguisticNotes: 'Reflects vernacular phonetic rhythm.',
      transcript: 'Oral recitation recorded from regional tradition-bearer.',
      translation: '[English]: A preserved oral chronicle passed across generations.\n\n[Hindi]: पूर्वजों की स्मृतियों से जुड़ी लोक धरोहर।',
      summary: 'Sacred community tradition reflecting the living heritage of Bharat.',
      tags: ['OralTradition', 'LivingHeritage', 'BharatAtlas'],
      culturalContext: 'Documented for preservation in the Bharat Culture Atlas.',
    });
  }
});

// AI Text-To-Speech (Gemini TTS using gemini-3.8-flash-lite-tts)
app.post('/api/ai/tts', async (req: Request, res: Response) => {
  try {
    const ai = getGeminiClient();
    const { text, voice = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured on the server. Audio narration is in simulation mode.',
        fallbackAudio: false,
      });
    }

    // Call gemini-3.8-flash-lite-tts for spoken narration
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Narrate the following Indian cultural tradition with reverent, warm, and engaging cadence: "${text.slice(0, 400)}"`,
              speechMetadata: {
                style: 'Reverent, warm cultural storyteller',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audioBase64: base64Audio, sampleRate: 24000 });
    } else {
      res.status(500).json({ error: 'Audio data not generated' });
    }
  } catch (err: any) {
    console.error('Error in /api/ai/tts:', err);
    res.status(500).json({ error: err.message || 'TTS generation failed' });
  }
});

// Interactive AI Research Q&A on Cultural Entries (Retrieval Layer: Database Content -> Context Builder -> Prompt Constructor -> Gemini -> Response)
app.post('/api/ai/ask-heritage', async (req: Request, res: Response) => {
  try {
    const ai = getGeminiClient();
    const { question, entryContext, districtContext, repositoryEntries = [] } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!ai) {
      return res.json({
        answer: `This cultural tradition from ${entryContext?.state || 'India'} represents an unbroken lineage of oral knowledge. Anthropologists observe that such practices reinforce inter-generational cohesion, ecological stewardship, and linguistic richness across community rituals.`,
      });
    }

    // Step 1: Context Builder
    // Ingest Entry Data + AI Summary + Transcript + Tags + Metadata + District Context
    const contextParts: string[] = [];

    if (entryContext) {
      contextParts.push(`--- PRIMARY CULTURAL ENTRY ---
Title: ${entryContext.title || 'Untitled'}
Category: ${entryContext.category || 'Cultural Heritage'}
State: ${entryContext.state || 'India'}
District: ${entryContext.district || 'Rural Region'}
Language / Dialect: ${entryContext.language || 'Vernacular'}
Contributor / Lineage Bearer: ${entryContext.created_by_name || 'Traditional Elder'} (${entryContext.contributor_role || 'Tradition Bearer'})
Original Description: ${entryContext.description || 'Oral tradition'}
Original Source Details: ${entryContext.source_details || 'Recorded from oral memory'}
Transcript: ${entryContext.transcript || entryContext.ai_content?.transcript || 'Preserved oral recital'}
Dual Translation: ${entryContext.translation || entryContext.ai_content?.translation || 'English & Hindi'}
Cultural Summary: ${entryContext.culturalSummary || entryContext.summary || entryContext.ai_content?.summary || ''}
Historical Context: ${entryContext.historicalContext || entryContext.ai_content?.historical_context || ''}
Traditional Importance: ${entryContext.traditionalImportance || entryContext.ai_content?.traditional_importance || ''}
Local Significance: ${entryContext.localSignificance || entryContext.ai_content?.local_significance || ''}
Preservation Notes: ${entryContext.preservationNotes || entryContext.ai_content?.preservation_notes || ''}
Related Traditions: ${JSON.stringify(entryContext.relatedTraditions || entryContext.ai_content?.related_traditions || [])}
Linguistic Notes: ${entryContext.linguisticNotes || entryContext.ai_content?.linguistic_notes || ''}
Cultural Tags: ${JSON.stringify(entryContext.tags || entryContext.ai_content?.tags || [])}`);
    }

    if (districtContext) {
      contextParts.push(`--- DISTRICT CONTEXT ---
District Name: ${districtContext.name || ''}
State: ${districtContext.state || ''}
Ecological & Dialectal Notes: ${districtContext.notes || ''}`);
    }

    if (Array.isArray(repositoryEntries) && repositoryEntries.length > 0) {
      const relatedSummaries = repositoryEntries
        .slice(0, 4)
        .map((r: any) => `- "${r.title}" (${r.district}, ${r.state}): ${r.category} in dialect ${r.language}`)
        .join('\n');
      contextParts.push(`--- ADJACENT REPOSITORY ENTRIES IN THE SAME REGION ---\n${relatedSummaries}`);
    }

    const compiledRepositoryContext = contextParts.join('\n\n');

    // Step 2: Prompt Constructor with Strict Anti-Hallucination Mandate
    const systemInstruction = `ROLE: Archival Scholar & Cultural Historian at the Hindustan Culture Atlas.
GOAL: Provide scholarly, dignified, and precise answers about India's intangible living heritage.

Users may inquire about:
1. About a tradition (origins, ritual performance, lineage)
2. About a district (cultural landscape, agrarian cycles, sacred geography)
3. About a language or dialect (phonetics, idioms, oral meters)
4. About a ritual (spirit invocation, offerings, festival dates, sanctity)
5. About uploaded community stories (elder testimonies, oral transmission)

GROUNDING AND RETRIEVAL RULES:
- You must strictly base your answers on the provided repository context, substantiated historical ethnography, and authentic community lore.
- PREVENT HALLUCINATIONS: If the question asks about a specific fact, obscure date, person, or ritual detail that is neither contained in the provided repository context nor verifiable from authoritative Indian cultural scholarship, you MUST explicitly state:
"Information not available in the repository."
- Do NOT fabricate lineages, deities, dates, or transcripts not rooted in actual ethnography.
- Maintain an editorial tone that is respectful, articulate, and anthropological.`;

    const userPrompt = `REPOSITORY CONTEXT:
${compiledRepositoryContext || 'No specific repository record attached.'}

USER QUESTION:
${question}

Answer with scholarly depth and clarity. If the question cannot be answered from the repository context or authentic cultural scholarship, respond with "Information not available in the repository."`;

    // Step 3: Gemini Invocation
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.4, // lower temperature for high grounding fidelity
      },
    });

    res.json({ answer: response.text });
  } catch (err: any) {
    console.error('Error in /api/ai/ask-heritage:', err);
    res.status(500).json({
      answer: 'Information not available in the repository.',
    });
  }
});

// --------------------------------------------------------------------------
// Vite integration for full-stack SPA
// --------------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static built files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Hindustan Culture Atlas] Full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}
