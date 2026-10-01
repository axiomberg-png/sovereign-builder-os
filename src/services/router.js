import axios from 'axios';
import { config } from '../config.js';

export async function routeLLMRequest(payload) {
  // Primary Attempt: OpenAI / Upstream Sovereign Proxy
  try {
    const response = await axios.post(config.openaiEndpoint, payload, {
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    return { provider: 'upstream-openai', data: response.data };
  } catch (error) {
    console.warn('Primary upstream endpoint failed/timed out. Falling back to local sovereign model...');
    
    // Fallback Attempt: Local Execution Model (e.g., Ollama / vLLM)
    try {
      const fallbackResponse = await axios.post(config.localModelEndpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000
      });
      return { provider: 'local-sovereign-fallback', data: fallbackResponse.data };
    } catch (fallbackError) {
      throw new Error(`All LLM execution backends failed. Upstream: ${error.message} | Local: ${fallbackError.message}`);
    }
  }
}
