
import { GoogleGenAI } from "@google/genai";
import { Habit, Goal } from "../types";

const getMotivationalMessage = async (habits: Habit[], goals: Goal[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Chave de API não configurada. Por favor, defina a variável de ambiente API_KEY.";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => h.frequency === 'daily' && h.logs.some(log => log.date.startsWith(today))).length;
  const totalDaily = habits.filter(h => h.frequency === 'daily').length;

  const frequencyMap = {
    daily: 'diário',
    weekly: 'semanal',
    monthly: 'mensal'
  };

  const progressSummary = `
    O usuário está acompanhando suas metas e hábitos pessoais.
    - Hábitos Diários: Ele(a) tem ${totalDaily} hábitos diários e completou ${completedToday} deles hoje.
    - Todos os Hábitos: ${habits.map(h => `'${h.name}' (${frequencyMap[h.frequency]})`).join(', ')}.
    - Metas: ${goals.map(g => `'${g.name}' (${g.currentProgress}/${g.target} ${g.unit})`).join(', ')}.

    Com base nesses dados, escreva uma mensagem curta, personalizada e encorajadora (2-3 frases) em português do Brasil. Seja positivo e foque no progresso, não na perfeição. Se ele(a) não completou muito hoje, motive-o(a) a começar com uma pequena ação.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: progressSummary,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching motivational message from Gemini:", error);
    return "Não foi possível buscar uma dica motivacional agora. Continue com o ótimo trabalho!";
  }
};

export { getMotivationalMessage };
