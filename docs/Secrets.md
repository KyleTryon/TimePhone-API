# Configuring Secrets

To run the TimePhone-API service, you will need an account with [OpenAI](https://platform.openai.com/) and [GCP](https://cloud.google.com/).
Create a `.env` file in the root of the project if you have not yet created one.

## OpenAI API Key

1. Create an account at [OpenAI](https://platform.openai.com/).
2. Create a new [API key](https://platform.openai.com/account/api-keys).
3. Add your key to the `.env` file as `OPENAI_API_KEY`.

## GCP Authentication

Google authentication is handled with a service account and a JSON key file.

1. Create a new [service account](https://console.cloud.google.com/iam-admin/serviceaccounts) in GCP.
2. Create a new [key](https://console.cloud.google.com/apis/credentials/serviceaccountkey) for the service account.
3. Download the key file and save it as `.gcpAuth.env.json` in the root of the project.

## Storage

This project uses [MinIO](https://min.io/) for local storage with Docker Compose. Follow the instructions in the [Storage](docs/Storage.md) documentation to configure MinIO.