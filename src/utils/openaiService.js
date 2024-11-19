import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";


const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const ANALYSIS_PROMPTS = {
  accident: {
    system: "You are an expert image analyzer. Describe the image and provide insights about what you see. Like vehicles involved, seriousness of the accident, etc. No need of detailed sentences instead just give the details like heading and data no need of explanation of each datapoint.  Give the output without * and # symbols.",
    human: "Please analyze this image and provide detailed observations."
  },
  prescription: {
    system: "Read the text in the image and print the text below. Give patient details and then give medication details and dosage if available. Give the output without * and # symbols.",
    human: "Please analyze this image and provide detailed observations."
  }
};


const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeImage = async (imageFile, analysisType) => {
  try {
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      openAIApiKey: OPENAI_API_KEY,
      maxTokens: 500,
      temperature: 0,
    });

    const prompts = ANALYSIS_PROMPTS[analysisType];

    const base64Image = await getBase64(imageFile);

    const messages = [
      new SystemMessage(prompts.system),
      new HumanMessage({
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          },
          {
            type: "text",
            text: prompts.human
          }
        ],
      }),
    ];

    const response = await model.invoke(messages);

    const filteredResp = response.content.replace(/\*/g, '');
    return filteredResp;

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};