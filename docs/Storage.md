# Configuring Storage for TimePhone-API

This project utilizes s3 compatible storage for storing audio files submitted by the user and returned by the TextToSpeech service.

This project uses the official [AWS S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html) to interact with the storage service. Included in the Docker Compose file is a [Minio](https://min.io/) container which can be used for local development.

Note: Currently this project is in development and is not ready for production use. S3 compatibility is not guaranteed.

Note: This project has not yet implemented private buckets. All audio files are publicly accessible.

## Configuring Minio

1. Create a bucket named `timephone` in Minio.
1. Allow read access to the bucket by attaching the following policy to the bucket.

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "AWS": [
                        "*"
                    ]
                },
                "Action": [
                    "s3:GetObject",
                    "s3:ListBucket"
                ],
                "Resource": [
                    "arn:aws:s3:::timephone",
                    "arn:aws:s3:::timephone/*"
                ]
            }
        ]
    }
    ```

1. Create and Access Key for the bucket.
