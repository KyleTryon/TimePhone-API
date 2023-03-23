import { Call, Message } from '@prisma/client';
import { Configuration, OpenAIApi } from 'openai';
import { Readable } from 'stream';
export class AI {
  private _apiKey: string;
  private _api: OpenAIApi;
  config = {
    identifier: {
      caller: 'CALLER:',
      character: 'YOU:',
    }
  }
  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this._apiKey = apiKey;
    const config = new Configuration({
      apiKey: this._apiKey,
    });
    this._api = new OpenAIApi(config);
  }

  async startCall(prompt: string) {
    const response = await this._api.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      n: 1,
      stop: ['?'],
    });
    const callPrompt = `${prompt} \n${this.config.identifier.character} ${response.data.choices[0].message.content}`;
    return {
      prompt: callPrompt,
      responseText: response.data.choices[0].message.content,
    };
  }

  // Returns a completion for an existing call with the new message
  async continueCall(
    call: Call & {
      messages: Message[];
    },
    message: string,
  ) {
    var callHistoryPrompt = call.prompt;
    for (const messages of call.messages) {
      callHistoryPrompt += `\n${this.config.identifier.caller} ${messages.messageText}\n${this.config.identifier.character} ${messages.responseText}`;
    }

    const prompt = `${callHistoryPrompt}\n${this.config.identifier.caller} ${message}\n${this.config.identifier.character}`;

    const response = await this._api.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      n: 1,
      stop: ['${this.config.identifier.caller}'],
    });
    return response.data.choices[0].message.content;
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
