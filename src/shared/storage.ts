import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class StorageService {
  private s3: S3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: true,
  });
  constructor() {}

  async uploadFile(key: string, file: File) {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file,
    })
   try {
    const data = await this.s3.send(putObjectCommand)
    return data.$metadata;
   } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$$metadata;
    console.log({ requestId, cfId, extendedRequestId });
   }
  }

  static getFileUrl(key: string) {
    return `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${key}`;
  }

  static convertMulerToFile(file: Express.Multer.File) {
    return new File([file.buffer], file.originalname, { type: file.mimetype })
  }
}