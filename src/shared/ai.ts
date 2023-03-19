import { Configuration, OpenAIApi } from 'openai';
import { Readable } from 'stream';
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

  async transcribeAudioMessage(audio: Express.Multer.File) {
    const audioStream = Readable.from(audio.buffer);
    // @ts-expect-error: path is not a valid property
    audioStream.path = audio.originalname;
    const response = await this._api.createTranscription(
      audioStream as any,
      'whisper-1',
    );
    return response.data;
  }
}
