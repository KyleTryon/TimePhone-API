import {
  PutObjectCommand,
  S3Client,
  GetObjectAclCommand,
} from '@aws-sdk/client-s3';

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

  async getFile(key: string) {
    const getObjectCommand = new GetObjectAclCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
    try {
      const data = await this.s3.send(getObjectCommand);
      return data.$metadata;
    } catch (error) {
      console.log(error);
    }
  }

  static generateKey(filename: string) {
    const date = new Date();
    return `${date.getTime()}-${filename}`;
  }
  
  static getFileUrl(key: string) {
    return `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${key}`;
  }
}
