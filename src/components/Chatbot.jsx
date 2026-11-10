import { useEffect, useRef, useState } from 'react'

function Chatbot({ isOpen, onToggle, onSend }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)
  const nextMessageId = useRef(0)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen, isSending, messages])

  async function sendMessage(prompt, history, messageId) {
    setIsSending(true)

    try {
      const reply = await onSend(prompt, history)
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', text: reply },
      ])
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                isError: true,
                error:
                  error.message ||
                  'Sorry, I could not send that message. Please try again.',
              }
            : message,
        ),
      ])
    } finally {
      setIsSending(false)
    }
  }

  function getHistoryBefore(messageId) {
    const messageIndex = messages.findIndex((message) => message.id === messageId)
    return messages
      .slice(0, messageIndex)
      .filter((message) => !message.isError && ['user', 'assistant'].includes(message.role))
      .map(({ role, text }) => ({ role, text }))
  }

  function handleRetry(message) {
    if (isSending) return
    setMessages((currentMessages) =>
      currentMessages.map((item) =>
        item.id === message.id ? { ...item, isError: false, error: '' } : item,
      ),
    )
    sendMessage(message.text, getHistoryBefore(message.id), message.id)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const prompt = input.trim()

    if (!prompt || isSending) return

    setInput('')
    const messageId = nextMessageId.current
    nextMessageId.current += 1
    const history = messages
      .filter((message) => !message.isError && ['user', 'assistant'].includes(message.role))
      .map(({ role, text }) => ({ role, text }))
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: messageId, role: 'user', text: prompt },
    ])
    sendMessage(prompt, history, messageId)
  }

  return (
    <>
      {isOpen && (
        <section
          aria-label="Chat with Northstar IT"
          className="fixed bottom-24 right-4 z-[60] flex h-[min(620px,calc(100dvh-7rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-[#dce4da] bg-white shadow-2xl shadow-[#101c19]/20 sm:bottom-24 sm:right-8"
          role="dialog"
        >
          <div className="flex items-center justify-between bg-[#101c19] px-5 py-4 text-white sm:px-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#c7f47b] font-bold text-[#14211b]">
                n.
              </span>
              <div>
                <h2 className="text-sm font-semibold">Northstar assistant</h2>
                <p className="mt-0.5 text-xs text-white/55">Here to help</p>
              </div>
            </div>
            <button
              aria-label="Close chat"
              className="grid size-9 place-items-center rounded-full text-xl text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#c7f47b]"
              onClick={onToggle}
              type="button"
            >
              ×
            </button>
          </div>

          <div
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto bg-[#f7f8f5] px-4 py-5 sm:px-5"
            role="log"
          >
            {messages.length === 0 && (
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-[#344238] shadow-sm">
                Hi! I can help answer questions about our IT services. What
                would you like to know?
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={message.id ?? `${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[88%]">
                  <p
                    className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === 'user'
                        ? message.isError
                          ? 'rounded-br-sm border border-[#d99a91] bg-[#fff4f2] text-[#803d35]'
                          : 'rounded-br-sm bg-[#263f2e] text-white'
                        : 'rounded-tl-sm bg-white text-[#344238] shadow-sm'
                    }`}
                  >
                    {message.text}
                  </p>
                  {message.isError && (
                    <div className="mt-2 px-2 text-xs leading-5 text-[#803d35]">
                      <p role="alert">{message.error}</p>
                      <button
                        className="mt-1 font-semibold underline underline-offset-2 hover:text-[#552620] disabled:opacity-50"
                        disabled={isSending}
                        onClick={() => handleRetry(message)}
                        type="button"
                      >
                        Retry message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isSending && (
              <p className="text-sm text-[#637065]" role="status">
                Northstar is thinking…
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="flex items-center gap-2 border-t border-[#e3e8e2] bg-white p-3 sm:p-4"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="chatbot-message">
              Your message
            </label>
            <input
              autoComplete="off"
              className="min-w-0 flex-1 rounded-full border border-[#dce4da] bg-[#f7f8f5] px-4 py-3 text-sm text-[#14211b] outline-none placeholder:text-[#89938a] focus:border-[#809b74] focus:ring-2 focus:ring-[#c7f47b]/50"
              id="chatbot-message"
              maxLength={4000}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Write a message..."
              value={input}
            />
            <button
              aria-label="Send message"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[#c7f47b] text-lg font-semibold text-[#14211b] transition hover:bg-[#b6e467] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#547a43] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!input.trim() || isSending}
              type="submit"
            >
              <span aria-hidden="true">↑</span>
            </button>
          </form>
        </section>
      )}

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        className="fixed bottom-5 right-4 z-[60] inline-flex items-center gap-3 rounded-full bg-[#c7f47b] px-5 py-3.5 text-sm font-semibold text-[#14211b] shadow-lg shadow-[#101c19]/20 transition hover:-translate-y-0.5 hover:bg-[#d6ff94] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#547a43] sm:bottom-7 sm:right-8"
        onClick={onToggle}
        type="button"
      >
        <span aria-hidden="true">{isOpen ? '×' : '✳'}</span>
        {isOpen ? 'Close chat' : 'Ask us'}
      </button>
    </>
  )
}

export default Chatbot
