# TimePhone-API

The TimePhone-API powers the magical payphone with the power to contact anyone, past or present, live or dead, real or fictional! Ask the operator to speak to anyone and TimePhone will make it happen!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. `npm install`
1. Configure your `.env` file. You will need an OpenAI API key.
1. `docker compose up -d` to start the database and minio.
1. `npm run migrate`
1. `npm run start`
1. Navigate to `http://localhost:3000/api` for Swagger documentation.

### example .env file

```sh
DATABASE_URL="postgresql://user:password@localhost:5433/time-phone?schema=public"
OPENAI_API_KEY=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_ENDPOINT="http://minio:9000"
AWS_S3_BUCKET=""
AWS_S3_REGION=""
```

## Usage

### Create a new conversation

Start a new conversation by passing the `/calls` endpoint a `POST` request with a JSON body containing the `character` and `prompt` keys.
The character information will be used to select a suitable voice for the call.
The prompt will "program" the conversation and will be used to generate the first response.

```sh
curl --request POST \
  --url http://timephone:3000/calls \
  --header 'Content-Type: application/json' \
  --data '{
  "character": "Galileo Galilei",
  "prompt": "You must pretend to be Galileo Galilei, you know their life history and will speak in their style. Begin the conversation as you would answer a phone in your new persona. \n YOU:"
}'
```

You will get back a response containing the call `id` which can be used for posting new messages to the conversation.
You will also get back a `prompt` which is the first response from the AI.

```json
{
  "id": 11,
  "character": "Galileo Galilei",
  "createdAt": "2023-03-21T02:49:41.113Z",
  "prompt": "You must pretend to be Galileo Galilei, you know their life history and will speak in their style. Begin the conversation as you would answer a phone in live conversation as your new persona. You may only speak, do not use onomatopoeia. \nYOU: \n\nGood day, this is Galileo Galilei speaking. To whom do I have the privilege of speaking",
  "responseText": "\n\nGood day, this is Galileo Galilei speaking. To whom do I have the privilege of speaking"
}
```

### Continue a conversation

Send messages to an existing conversation by sending your `audio` and `callId` to the `/messages` endpoint.

```sh
curl --request POST \
  --url http://timephone:3000/messages \
  --header 'Content-Type: multipart/form-data' \
  --form callId=96 \
  --form 'audio=@when_were_you_born.mp3'
```

You will receive a response containing the `prompt` which is the AI's response to your message.

```json
{
  "id": 5,
  "callId": 6,
  "messageAudioUrl": "http://localhost:9000/timephone/1679284384333-when_were_you_born.mp3",
  "messageText": "And what year were you born?",
  "responseAudioUrl": "coming soon",
  "responseText": "Ah, yes, I was born on February 15, 1564.",
  "createdAt": "2023-03-20T03:53:11.110Z",
  "character": "Galileo Galilei"
}
```
