# GenAi with Gemini using Node.js

This app is an Express server that provides endpoints to interact with Google's Gemini generative AI models. It supports generating text, analyzing images, documents, and audio files using the Gemini API.

## Features

- **/generate-text**: Generate text from a prompt.
- **/generate-from-image**: Analyze or describe an uploaded image.
- **/generate-from-document**: Analyze an uploaded document (PDF, DOCX, etc.).
- **/generate-from-audio**: Transcribe or analyze an uploaded audio file.

## Requirements

- Node.js (v18+ recommended)
- A Gemini API key from Google
- npm

## Setup

1. **Clone the repository**  
   ```
   git clone <your-repo-url>
   cd genai
   ```

2. **Install dependencies**  
   ```
   npm install
   ```

3. **Create a `.env` file**  
   Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the server**  
   ```
   node index.js
   ```
   The server will start at `http://localhost:3000`.

## Usage

Use tools like [Postman](https://www.postman.com/) or `curl` to interact with the endpoints.

### Generate Text

```
POST /generate-text
Content-Type: application/json

{
  "prompt": "Write a poem about the ocean."
}
```

### Generate from Image

```
POST /generate-from-image
Form-data:
  - image: <your-image-file>
  - prompt: (optional) "Describe this image"
```

### Generate from Document

```
POST /generate-from-document
Form-data:
  - document: <your-document-file>
```

### Generate from Audio

```
POST /generate-from-audio
Form-data:
  - audio: <your-audio-file>
```

Responses will be in JSON format with the AI-generated output.

## License
