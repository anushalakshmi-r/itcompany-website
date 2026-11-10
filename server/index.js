import 'dotenv/config'
import express from 'express'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.PORT) || 3001
const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash'
const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.1-flash-lite'
const distPath = fileURLToPath(new URL('../dist/', import.meta.url))
const apiUrl = (modelName) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

app.use(express.json({ limit: '128kb' }))

function requireApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new HttpError(503, 'Gemini is not configured. Add GEMINI_API_KEY to your .env file.')
  }
  return process.env.GEMINI_API_KEY
}

async function generateContent(contents, generationConfig, systemInstruction) {
  const apiKey = requireApiKey()
  const models = [...new Set([model, fallbackModel])]
  let lastError

  for (let index = 0; index < models.length; index += 1) {
    try {
      const response = await fetch(apiUrl(models[index]), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents,
          generationConfig,
          ...(systemInstruction ? { systemInstruction } : {}),
        }),
        signal: AbortSignal.timeout(index === 0 ? 15_000 : 30_000),
      })
      const data = await response.json()

      if (!response.ok) {
        console.error(
          `Gemini request failed (${response.status}):`,
          data.error?.message || 'Unknown upstream error',
        )
        const status =
          response.status === 401 || response.status === 403
            ? 503
            : response.status === 404
              ? 503
              : response.status
        lastError = new HttpError(status, data.error?.message || 'Gemini request failed.')

        if (![429, 500, 502, 503, 504].includes(response.status)) {
          break
        }
        continue
      }

      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim()

      if (!text) {
        lastError = new HttpError(502, 'Gemini returned an empty response.')
        continue
      }

      return text
    } catch (error) {
      lastError =
        error.name === 'TimeoutError'
          ? new HttpError(504, 'Gemini took too long to respond.')
          : new HttpError(503, 'Could not connect to Gemini. Check your internet connection.')
      console.error(`Gemini request failed for ${models[index]}:`, error.message)
    }
  }

  if (lastError?.status === 503 && /API key|API_KEY|permission|credential/i.test(lastError.message)) {
    throw new HttpError(
      503,
      'Gemini rejected the API key. Check GEMINI_API_KEY and make sure the Gemini API is enabled for it.',
    )
  }
  if (
    lastError?.status === 503 &&
    /not found|no longer available|does not exist|not supported/i.test(lastError.message)
  ) {
    throw new HttpError(
      503,
      `The configured Gemini model is unavailable. Set GEMINI_MODEL to an available model (the current setting is "${model}").`,
    )
  }
  if (lastError?.status === 429) {
    throw new HttpError(
      503,
      'Gemini is busy or the API quota is exhausted. Please retry shortly or check your Gemini API usage.',
    )
  }
  if (lastError?.status === 503) {
    throw new HttpError(503, 'Gemini is temporarily under heavy demand. Please try again shortly.')
  }
  if (lastError?.status === 504) {
    throw new HttpError(504, 'Gemini did not respond in time. Please try again.')
  }

  throw new HttpError(502, 'Gemini could not complete the request. Please try again.')
}

app.post('/api/chat', async (request, response, next) => {
  try {
    const { prompt, history = [] } = request.body
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000) {
      throw new HttpError(400, 'Enter a message of 1–4000 characters.')
    }
    if (!Array.isArray(history) || history.length > 20) {
      throw new HttpError(400, 'The conversation history is invalid.')
    }

    const contents = history.map((message) => {
      if (
        !message ||
        !['user', 'assistant'].includes(message.role) ||
        typeof message.text !== 'string' ||
        !message.text.trim() ||
        message.text.length > 4000
      ) {
        throw new HttpError(400, 'The conversation history is invalid.')
      }

      return {
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.text }],
      }
    })
    contents.push({ role: 'user', parts: [{ text: prompt.trim() }] })

    const reply = await generateContent(
      contents,
      { maxOutputTokens: 768 },
      {
        parts: [
          {
            text: 'You are Northstar IT’s friendly, knowledgeable website assistant. Northstar IT helps businesses with digital strategy, custom software, cloud infrastructure, and managed IT support. Answer the visitor’s question directly in clear, plain language, usually in 2–4 short sentences. Use the conversation history to understand follow-up questions. Do not start with generic AI disclaimers or claim to be a human. Do not invent prices, guarantees, certifications, or company policies. If a detail is unknown, say so plainly and invite the visitor to contact hello@northstarit.example.',
          },
        ],
      },
    )
    response.json({ reply })
  } catch (error) {
    next(error)
  }
})

app.post('/api/faqs', async (_request, response, next) => {
  try {
    const text = await generateContent(
      [
        {
          role: 'user',
          parts: [
            {
              text: 'Create exactly 6 concise, helpful frequently asked questions and answers for a professional IT services company offering digital strategy, custom software, cloud infrastructure, and managed IT support. Return only a valid JSON array of objects with string properties "question" and "answer". Do not include markdown or any text outside the JSON array.',
            },
          ],
        },
      ],
      { responseMimeType: 'application/json' },
    )

    let faqs
    try {
      faqs = JSON.parse(text)
    } catch {
      throw new HttpError(502, 'The AI service returned invalid FAQ data. Please try again.')
    }

    if (
      !Array.isArray(faqs) ||
      faqs.length === 0 ||
      faqs.some(
        (faq) =>
          typeof faq?.question !== 'string' ||
          !faq.question.trim() ||
          typeof faq?.answer !== 'string' ||
          !faq.answer.trim(),
      )
    ) {
      throw new HttpError(502, 'The AI service returned invalid FAQ data. Please try again.')
    }

    response.json({
      faqs: faqs.slice(0, 8).map(({ question, answer }) => ({
        question: question.trim(),
        answer: answer.trim(),
      })),
    })
  } catch (error) {
    next(error)
  }
})

if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('/', (_request, response) => {
    response.sendFile(fileURLToPath(new URL('../dist/index.html', import.meta.url)))
  })
}

app.use((error, _request, response, next) => {
  console.error('Request failed:', error)
  if (response.headersSent) return next(error)

  const status = Number.isInteger(error.status) ? error.status : 502
  response.status(status).json({
    error:
      status >= 500 && !(error instanceof HttpError)
        ? 'The AI service is temporarily unavailable. Please try again.'
        : error.message,
  })
})

app.listen(port, () => {
  console.log(`IT company API listening on http://localhost:${port}`)
})
