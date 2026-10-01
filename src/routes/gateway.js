import { Router } from 'express';
import { scrubPII } from '../services/piiScrubber.js';
import { routeLLMRequest } from '../services/router.js';

const router = Router();

router.post('/v1/chat/completions', async (req, res) => {
  try {
    // 1. Mandatory Pre-Egress PII Scrubbing (Zero Data Retention Enforcement)
    const sanitizedBody = await scrubPII(req.body);

    // 2. Dynamic Routing (Upstream with Local Fallback)
    const result = await routeLLMRequest(sanitizedBody);

    // 3. Return sanitized response
    return res.status(200).json({
      sovereignMeta: {
        scrubbed: true,
        executionProvider: result.provider
      },
      ...result.data
    });
  } catch (error) {
    return res.status(500).json({ error: 'Execution failed', details: error.message });
  }
});

export default router;
