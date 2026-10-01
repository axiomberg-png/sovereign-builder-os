# Sovereign Builder OS

**Zero Data Retention Async AI Gateway**

A robust API gateway for managing AI requests with a focus on data privacy, async processing, and PII scrubbing.

## Features

- 🔐 **Zero Data Retention** - Automatic PII scrubbing and removal
- ⚡ **Async Processing** - WebSocket support for real-time streaming
- 🧠 **Multi-Model Support** - OpenAI and local model endpoints (Ollama)
- 🚦 **Rate Limiting** - Built-in request throttling
- 📊 **Redis Integration** - Distributed session management
- 📖 **OpenAPI Documentation** - Auto-generated API specs

## Quick Start

### Prerequisites

- Node.js 18+
- Redis instance
- Optional: Ollama for local model inference

### Installation

```bash
git clone https://github.com/axiomberg-png/sovereign-builder-os.git
cd sovereign-builder-os
npm install
```

### Configuration

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

### Docker

```bash
docker-compose up --build
```

## Architecture

```
src/
├── index.js              # Entry point
├── config.js             # Configuration management
├── middleware/           # Express middleware
│   ├── auth.js          # Authentication
│   └── rateLimiter.js   # Rate limiting
├── services/            # Business logic
│   ├── router.js        # Request routing
│   └── piiScrubber.js   # PII detection & removal
├── workers/             # Background jobs
│   └── scrubberWorker.js # Async scrubbing
└── routes/              # API endpoints
    ├── gateway.js       # Main gateway routes
    └── openapi.js       # API documentation
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `REDIS_URL` | redis://localhost:6379 | Redis connection string |
| `OPENAI_API_KEY` | - | OpenAI API key |
| `OPENAI_ENDPOINT` | https://api.openai.com/v1/chat/completions | OpenAI endpoint |
| `LOCAL_MODEL_ENDPOINT` | http://localhost:11434/v1/chat/completions | Local model endpoint |

## API Endpoints

- `POST /api/v1/chat/completions` - Send a chat request
- `GET /api/health` - Health check
- `GET /docs` - OpenAPI documentation
- `WS /ws` - WebSocket connection for streaming

## License

MIT
