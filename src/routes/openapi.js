import { Router } from 'express';

const router = Router();

// OpenAPI 3.0.0 Specification
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Sovereign Builder OS - AI Gateway',
    description: 'Zero Data Retention Async AI Gateway with PII Scrubbing',
    version: '1.0.0',
    contact: {
      name: 'Sovereign Builder OS',
      url: 'https://github.com/axiomberg-png/sovereign-builder-os'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  paths: {
    '/api/v1/chat/completions': {
      post: {
        summary: 'Send a chat completion request',
        description: 'Process a chat request with automatic PII scrubbing and fallback routing',
        tags: ['Chat'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['messages', 'model'],
                properties: {
                  model: {
                    type: 'string',
                    example: 'gpt-4',
                    description: 'Model identifier'
                  },
                  messages: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', enum: ['user', 'assistant', 'system'] },
                        content: { type: 'string' }
                      }
                    },
                    example: [
                      { role: 'user', content: 'Hello, how are you?' }
                    ]
                  },
                  temperature: {
                    type: 'number',
                    minimum: 0,
                    maximum: 2,
                    example: 0.7
                  },
                  max_tokens: {
                    type: 'integer',
                    example: 100
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Successful response with sovereign metadata',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    sovereignMeta: {
                      type: 'object',
                      properties: {
                        scrubbed: { type: 'boolean' },
                        executionProvider: { type: 'string', enum: ['upstream-openai', 'local-sovereign-fallback'] }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Missing or invalid authentication'
          },
          '429': {
            description: 'Too Many Requests - Rate limit exceeded'
          },
          '500': {
            description: 'Internal Server Error'
          }
        },
        security: [
          { bearerAuth: [] }
        ]
      }
    },
    '/api/health': {
      get: {
        summary: 'Health check',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Server is healthy'
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

router.get('/docs', (req, res) => {
  res.json(openApiSpec);
});

router.get('/docs/json', (req, res) => {
  res.json(openApiSpec);
});

export default router;
