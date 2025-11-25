import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, decodeAudioData } from "./geminiUtils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Audio context singleton to reuse
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextConstructor({ sampleRate: 24000 });
  }
  return audioContext;
};

/**
 * Uses Gemini TTS to speak the provided text.
 */
export const speakText = async (text: string, voiceName: 'Kore' | 'Puck' | 'Fenrir' = 'Puck'): Promise<void> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      console.warn("No audio data returned from Gemini.");
      return;
    }

    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    const audioBuffer = await decodeAudioData(
      decodeBase64(base64Audio),
      ctx,
      24000,
      1
    );

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start();

  } catch (error) {
    console.error("Error generating speech:", error);
  }
};

/**
 * Generates a short, simple mystery clue for a food item.
 * Target Level: CEFR A2 (Elementary) - slightly more detail than A1 but still easy.
 */
export const generateMysteryClue = async (foodName: string): Promise<string> => {
  try {
    const prompt = `
      Write a "Who am I?" riddle for a child (7-10 years old) describing a "${foodName}".
      
      Rules:
      1. Start with "I am..."
      2. Use CEFR A2 level English (Simple sentences, but descriptive).
      3. Describe color, shape, how I am eaten, or what I taste like.
      4. Do NOT use the word "${foodName}".
      5. Length: 30-50 words.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "I am tasty! Who am I?";
  } catch (error) {
    console.error("Error generating clue:", error);
    return "I am something yummy to eat. Can you guess my name?";
  }
};

/**
 * Generates a short, kid-friendly story about a specific food.
 * Updated to target CEFR A2-B1 levels.
 */
export const generateFoodStory = async (foodName: string): Promise<string> => {
  try {
    const prompt = `
      Write a short story (about 60-80 words) for children aged 7-10 about a character named "${foodName}".
      
      Rules:
      1. Level: CEFR A2-B1 (Elementary to Intermediate).
      2. Use simple grammar (mostly simple past or present tense).
      3. Use common adjectives and verbs.
      4. Make it funny or adventurous.
      5. Do not use complex metaphors.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "Oops! The chef couldn't write a story right now.";
  } catch (error) {
    console.error("Error generating story:", error);
    return "Sorry, I lost my recipe book!";
  }
};

/**
 * Generates a riddle for a random food item.
 */
export const generateRiddle = async (foodName: string): Promise<string> => {
   try {
    const prompt = `Write a simple "Who am I?" riddle for a 7-year-old child where the answer is "${foodName}". Do NOT use the word "${foodName}" in the riddle. Max 2 sentences.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I am tasty! Who am I?";
  } catch (error) {
    console.error("Error generating riddle:", error);
    return "I am something you eat. Who am I?";
  }
};