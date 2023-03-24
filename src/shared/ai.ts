import { Call, Message } from '@prisma/client';
import { Configuration, OpenAIApi } from 'openai';
import { Readable } from 'stream';
import * as TTS from '@google-cloud/text-to-speech';
import { StorageService } from './storage';

export class AI {
  private _oaiKey: string;
  private _oai: OpenAIApi;
  private _tts: TTS.TextToSpeechClient;
  private _ttsKey: string;
  private _storage: StorageService;
  config = {
    identifier: {
      caller: 'CALLER',
      character: 'YOU',
    },
    rules: [],
  };
  constructor(
    openAIKey = process.env.OPENAI_API_KEY,
    ttsKey = process.env.GCP_TTS_SERVICE_JSON,
  ) {
    this._storage = new StorageService();
    this._oaiKey = openAIKey;
    this._ttsKey = ttsKey
      ? ttsKey
      : (() => {
          throw new Error('GCP TTS API Key is missing');
        })();
    const config = new Configuration({
      apiKey: this._oaiKey,
    });
    this._oai = new OpenAIApi(config);
    this._tts = new TTS.TextToSpeechClient({
      credentials: JSON.parse(this._ttsKey),
    });
    // validate tts
    this._tts.listVoices({}).then((res) => {
      if (!res[0].voices) {
        throw new Error('Error validating GCP TTS API Key');
      }
    });
    this.config.rules = [
      'Do not use onomatopoeia.',
      `You must begin each response with "${this.config.identifier.character}: "`,
    ];
  }

  async startCall(prompt: string) {
    const completePrompt = prompt.concat(
      ' ',
      this.config.rules.join(' '),
      `\n${this.config.identifier.character}: `,
    );
    const response = await this._oai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: completePrompt,
        },
      ],
      n: 1,
      stop: [this.config.identifier.caller, 'Caller:'],
    });
    const callPrompt = `${completePrompt} \n${this.config.identifier.character}: ${response.data.choices[0].message.content}`;
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
      callHistoryPrompt += `\n${this.config.identifier.caller}: ${messages.messageText}\n${this.config.identifier.character}: ${messages.responseText}`;
    }

    const prompt = `${callHistoryPrompt}\n${this.config.identifier.caller}: ${message} \n${this.config.identifier.character}: `;

    const response = await this._oai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      n: 1,
      stop: [`${this.config.identifier.caller}:`],
    });
    return response.data.choices[0].message.content;
  }

  async transcribeAudioMessage(audio: Express.Multer.File) {
    const audioStream = Readable.from(audio.buffer);
    // @ts-expect-error: path is not a valid property
    audioStream.path = audio.originalname;
    const response = await this._oai.createTranscription(
      audioStream as any,
      'whisper-1',
    );
    return response.data;
  }

  async textToSpeech(text: string, key: string) {
    const response = await this._tts.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Wavenet-A',
      },
      audioConfig: {
        audioEncoding: 'MP3',
      },
    });
    const audioBuffer = Buffer.from(response[0].audioContent);
    const audioFile = {
      buffer: audioBuffer,
      filename: `${key}.mp3`,
      size: audioBuffer.length,
      fieldname: 'audio',
      originalname: `${key}.mp3`,
      mimetype: 'audio/mpeg',
    } as Express.Multer.File;
    const fileUpload = await this._storage.uploadFile(key, audioFile);
    if (fileUpload.httpStatusCode !== 200) {
      throw new Error('Error uploading audio file');
    }
    const fileURL = StorageService.getFileUrl(key);
    return fileURL;
  }
}
