import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export class StorageService {
  private s3: S3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: true,
    region: process.env.AWS_S3_REGION,
  });

  async uploadFile(key: string, file: Express.Multer.File) {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
    });
    try {
      const data = await this.s3.send(putObjectCommand);
      return data.$metadata;
    } catch (error) {
      console.log(error);
    }
  }

  async getFile(key: string): Promise<Express.Multer.File> {
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
    const data = await this.s3.send(getObjectCommand);
    return StorageService.convertToMulterFile({
      buffer: Buffer.from(await data.Body.transformToByteArray()),
      mimetype: data.ContentType,
      size: data.ContentLength,
      stream: data.Body as Readable,
      filename: key,
    });
  }

  static generateKeyFromString(str: string) {
    const filename = str.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    return this.generateKeyFromFile(filename);
  }

  static generateKeyFromFile(filename: string) {
    const shortFilename = filename.substring(0, 25);
    const date = new Date();
    return `${date.getTime()}-${shortFilename}`;
  }

  static getFileUrl(key: string) {
    return `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${key}`;
  }

  static convertToMulterFile(
    meta: Partial<Express.Multer.File>,
  ): Express.Multer.File {
    return { ...meta } as Express.Multer.File;
  }
}
