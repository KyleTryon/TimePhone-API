# TimePhone-API

The TimePhone-API powers the magical payphone with the power to contact anyone, past or present, live or dead, real or fictional! Ask the operator to speak to anyone and TimePhone will make it happen!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. `npm install`
1. Configure your `.env` file. You will need an OpenAI API key.
1. `npm run migrate`
1. `npm run start`
1. Navigate to `http://localhost:3000/api` for Swagger documentation.

### example .env file

```sh
DATABASE_URL="postgresql://user:password@localhost:5433/time-phone?schema=public"
OPENAI_API_KEY=""
```
