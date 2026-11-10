export async function postJson(path, body, signal) {
  let response
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error(
      'Could not reach the chat server. Make sure npm run dev is running, then try again.',
    )
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('The chat server returned an invalid response. Please try again.')
  }

  if (!response.ok) {
    throw new Error(data.error || 'The request could not be completed.')
  }

  return data
}
