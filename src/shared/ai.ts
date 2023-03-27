import { Call, Message } from '@prisma/client';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { Readable } from 'stream';
import * as TTS from '@google-cloud/text-to-speech';
import { StorageService } from './storage';
import GCPAuthJson from '../../.gcpAuth.env.json';

type ChatCompletionRequestMessageRole = 'system' | 'user' | 'assistant';
export class AI {
  private _oaiKey: string;
  private _oai: OpenAIApi;
  private _tts: TTS.TextToSpeechClient;
  private _ttsKey: object;
  private _storage: StorageService;
  config = {
    rules: [],
  };
  constructor(openAIKey = process.env.OPENAI_API_KEY, ttsKey = GCPAuthJson) {
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
      credentials: GCPAuthJson,
    });
    // validate tts
    this._tts.listVoices({}).then((res) => {
      if (!res[0].voices) {
        throw new Error('Error validating GCP TTS API Key');
      }
    });
    this.config.rules = ['Do not use onomatopoeia.'];
  }

  async startCall(prompt: string) {
    const callPrompt = prompt.concat(this.config.rules.join(' '));
    const promptMessage = this._createChatCompletionRequestMessage(
      callPrompt,
      'system',
    );
    const response = await this._oai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [promptMessage],
      n: 1,
      stop: ['\n'],
    });
    return {
      callPrompt: callPrompt,
      response: response.data.choices[0].message,
    };
  }

  // Returns a completion for an existing call with the new message
  async continueCall(
    call: Call & {
      messages: Message[];
    },
    message: string,
  ) {
    const history = call.messages.map((m) => {
      return this._createChatCompletionRequestMessage(m.text, m.role);
    });

    const response = await this._oai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        ...history,
        this._createChatCompletionRequestMessage(message, 'user'),
      ],
      n: 1,
    });

    return response.data;
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
    const fileUpload = await this._storage.uploadFile(`${key}.mp3`, audioFile);
    if (fileUpload.httpStatusCode !== 200) {
      throw new Error('Error uploading audio file');
    }
    const fileURL = StorageService.getFileUrl(`${key}.mp3`);
    return fileURL;
  }

  private _createChatCompletionRequestMessage(
    content: string,
    role: ChatCompletionRequestMessageRole,
  ): ChatCompletionRequestMessage {
    const message: ChatCompletionRequestMessage = {
      content: content,
      role: role,
    };
    return message;
  }
}
