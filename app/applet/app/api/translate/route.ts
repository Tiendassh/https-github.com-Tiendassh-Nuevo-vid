import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini SDK with telemetry user-agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { title, description, author, category } = await req.json();

    if (!title) {
      return NextResponse.json(
        { success: false, error: "El título del video es requerido." },
        { status: 400 }
      );
    }

    const prompt = `Analiza la información de este video:
Título: "${title}"
Autor/Canal: "${author || 'Desconocido'}"
Categoría: "${category || 'General'}"
Descripción: "${description || 'Sin descripción'}"

Por favor:
1. Identifica el idioma original en el que probablemente esté hablado este video (por ejemplo, "Inglés", "Portugués", "Francés", "Japonés", "Español", "Alemán", etc.).
2. Genera una lista de subtítulos secuenciales y realistas sincronizados en tiempo (de 0 a 180 segundos). Deben ser de 12 a 15 entradas espaciadas de forma natural (cada 10-15 segundos). Cada subtítulo debe simular lo que se diría en un video con este título y descripción.
3. Para cada subtítulo, proporciona la frase en el idioma original detectado ("original") y su traducción precisa al español ("spanish"). Si el idioma original ya es "Español", la versión original y la de español serán idénticas o transcripciones mejoradas en español.
4. Traduce también el título del video al español si originalmente no lo está, en el campo "originalTitleTranslation".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres un experto traductor de videos y generador de subtítulos profesionales. Tu trabajo es identificar el idioma original y producir subtítulos de alta fidelidad con traducciones perfectas y fluidas únicamente al español.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguage: {
              type: Type.STRING,
              description: "El idioma original detectado del video (por ejemplo, 'Inglés', 'Portugués', 'Alemán', 'Español')."
            },
            confidence: {
              type: Type.NUMBER,
              description: "El nivel de confianza en la detección de idioma (entre 0.0 y 1.0)."
            },
            originalTitleTranslation: {
              type: Type.STRING,
              description: "La traducción al español del título del video si es que no estaba en español."
            },
            subtitles: {
              type: Type.ARRAY,
              description: "Lista ordenada de subtítulos temporizados.",
              items: {
                type: Type.OBJECT,
                properties: {
                  start: {
                    type: Type.NUMBER,
                    description: "Tiempo de inicio en segundos desde el inicio del video."
                  },
                  end: {
                    type: Type.NUMBER,
                    description: "Tiempo de fin en segundos desde el inicio del video."
                  },
                  original: {
                    type: Type.STRING,
                    description: "La frase hablada simulada en el idioma original."
                  },
                  spanish: {
                    type: Type.STRING,
                    description: "La traducción de esa frase al idioma español."
                  }
                },
                required: ["start", "end", "original", "spanish"]
              }
            }
          },
          required: ["detectedLanguage", "confidence", "originalTitleTranslation", "subtitles"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("La respuesta del modelo de traducción está vacía.");
    }

    const data = JSON.parse(resultText.trim());
    return NextResponse.json({
      success: true,
      ...data
    });

  } catch (error: any) {
    console.error("Error en el API de traducción de video:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error interno al traducir los subtítulos." },
      { status: 500 }
    );
  }
}
