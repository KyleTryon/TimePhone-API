import { Configuration, OpenAIApi } from 'openai';
export class AI {
  private _apiKey: string;
  private _api: OpenAIApi;
  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this._apiKey = apiKey;
    const config = new Configuration({
      apiKey: this._apiKey,
    });
    this._api = new OpenAIApi(config);
  }

  async startCall(character: string) {
    const prompt = `You must pretend to be ${character}, you know their life history and will speak in their style. Begin the conversation as you would answer a phone in your new persona.`;
    const response = await this._api.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      n: 1,
    });
    return response.data;
  }
}
