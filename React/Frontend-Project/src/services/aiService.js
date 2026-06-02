import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateWorkoutPlan = async (userData) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const prompt = `You are a professional fitness trainer and nutritionist. Create a detailed personalized workout and diet plan based on the following information:

Profile:
- Age: ${userData.age} years old
- Weight: ${userData.weight} kg
- Height: ${userData.height} cm
- Gender: ${userData.gender}
- Fitness Goal: ${userData.goal}
- Experience Level: ${userData.experience}

Please provide:
1. A detailed workout plan (weekly schedule with exercises, sets, reps, rest periods)
2. A meal plan (daily meals with approximate calories)
3. Key tips and precautions
4. Expected results timeline

Format the response in a clear, easy-to-follow way with sections and bullet points.`;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("No response received from Gemini API");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error.message.includes("429") || error.message.includes("quota")) {
      throw new Error("API quota exceeded. Please wait a few hours before trying again, or upgrade your Google API plan at https://ai.google.dev");
    }
    throw new Error(error.message || "Failed to generate plan. Please try again.");
  }
};
