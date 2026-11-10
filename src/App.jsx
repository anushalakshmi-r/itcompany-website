import { useEffect, useState } from 'react'
import FAQItem from './components/FAQItem.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'
import Navbar from './components/Navbar.jsx'
import ServiceCard from './components/ServiceCard.jsx'
import { postJson } from './lib/api.js'

const services = [
  {
    number: '01',
    symbol: '↗',
    title: 'Digital strategy',
    description:
      'A clear technology roadmap that turns your business goals into practical next steps.',
    tags: ['Technology audits', 'Roadmaps'],
  },
  {
    number: '02',
    symbol: '⌘',
    title: 'Custom software',
    description:
      'Thoughtful web applications and tools built around the way your team really works.',
    tags: ['Web apps', 'Integrations'],
  },
  {
    number: '03',
    symbol: '◇',
    title: 'Cloud & infrastructure',
    description:
      'Reliable, secure cloud foundations that scale with your people, products, and plans.',
    tags: ['Cloud migration', 'DevOps'],
  },
  {
    number: '04',
    symbol: '◎',
    title: 'Managed IT support',
    description:
      'Proactive support and monitoring to keep your systems healthy and your team moving.',
    tags: ['IT support', 'Security'],
  },
]

const faqs = [
  {
    question: 'What kind of businesses do you work with?',
    answer:
      'We partner with growing teams and established businesses that want technology to feel less complicated. We shape each engagement around your goals, team, and existing systems.',
  },
  {
    question: 'Can you work with our existing technology?',
    answer:
      'Absolutely. We start by understanding what you already use, then recommend changes only where they make a meaningful difference. When possible, we improve and connect your current tools.',
  },
  {
    question: 'How do your projects typically get started?',
    answer:
      'We begin with a friendly discovery conversation to learn what is working, what is getting in the way, and what success looks like. From there, we outline a focused scope and clear next steps.',
  },
  {
    question: 'Do you offer ongoing support after launch?',
    answer:
      'Yes. We can stay involved with maintenance, monitoring, and hands-on support, or hand over clear documentation so your team can take things forward independently.',
  },
]

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [faqContent, setFaqContent] = useState([])
  const [isFaqLoading, setIsFaqLoading] = useState(true)
  const [faqError, setFaqError] = useState('')

  async function generateFAQ() {
    try {
      const { faqs: generatedFaqs } = await postJson('/api/faqs', {})
      setFaqContent(generatedFaqs)
    } catch (error) {
      setFaqError(error.message)
    } finally {
      setIsFaqLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    postJson('/api/faqs', {}, controller.signal)
      .then(({ faqs: generatedFaqs }) => setFaqContent(generatedFaqs))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setFaqError(error.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsFaqLoading(false)
        }
      })
    return () => controller.abort()
  }, [])

  async function sendChatMessage(prompt, history) {
    const { reply } = await postJson('/api/chat', {
      prompt,
      history: history.slice(-20),
    })
    return reply
  }

  return (
    <>
      <Navbar />
      <main>
        <section
          id="hero"
          className="relative isolate scroll-mt-24 overflow-hidden bg-[#101c19] text-white"
        >
          <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />
          <div className="absolute -right-36 -top-56 -z-10 size-[34rem] rounded-full border border-white/10 sm:-right-20" />
          <div className="absolute -right-16 -top-36 -z-10 size-[25rem] rounded-full border border-white/10" />
          <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-6 pb-24 pt-32 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pb-28 lg:pt-36">
            <div className="max-w-2xl">
              <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#c7f47b]">
                <span className="size-1.5 rounded-full bg-[#c7f47b]" />
                Technology, made human
              </p>
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Better tech.
                <br />
                <span className="text-[#c7f47b]">Brighter</span> business.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                We help ambitious teams make technology work harder, feel
                simpler, and open up what comes next.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  className="inline-flex items-center gap-3 rounded-full bg-[#c7f47b] px-6 py-3.5 text-sm font-semibold text-[#14211b] transition hover:bg-[#d6ff94] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c7f47b]"
                  href="#contact"
                >
                  Let&apos;s talk
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="rounded-full px-5 py-3.5 text-sm font-medium text-white/75 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  href="#services"
                >
                  Explore what we do <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6 text-sm text-white/55">
                <p>
                  <span className="mr-2 font-semibold text-white">01</span>
                  People-first partnership
                </p>
                <p>
                  <span className="mr-2 font-semibold text-white">02</span>
                  Built for what&apos;s next
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[500px]">
              <div className="absolute -left-7 top-14 size-24 rounded-full bg-[#c7f47b]/15 blur-2xl sm:-left-12" />
              <div className="relative rounded-[2rem] border border-white/15 bg-[#1a2925]/90 p-5 shadow-2xl shadow-black/30 sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                      Your next chapter
                    </p>
                    <p className="mt-1 text-lg font-medium">A clearer way forward</p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-full bg-[#c7f47b] text-lg text-[#14211b]">
                    ↗
                  </span>
                </div>
                <div className="mt-7 rounded-2xl bg-[#111d19] p-5 sm:p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-white/50">Momentum, by design</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight">
                        Less friction<span className="text-[#c7f47b]">.</span>
                      </p>
                    </div>
                    <p className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs text-[#c7f47b]">
                      Made to move
                    </p>
                  </div>
                  <div className="mt-8 flex h-36 items-end gap-2.5">
                    {[38, 53, 46, 68, 61, 82, 72, 96, 85, 100].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md bg-[#c7f47b]"
                          style={{ height: `${height}%`, opacity: 0.35 + index * 0.065 }}
                        />
                      ),
                    )}
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[0.15em] text-white/35">
                    <span>Clarity</span>
                    <span>Confidence</span>
                    <span>Growth</span>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 p-4">
                    <p className="text-xs text-white/45">Start with</p>
                    <p className="mt-1 font-medium">A real conversation</p>
                  </div>
                  <div className="rounded-xl border border-white/10 p-4">
                    <p className="text-xs text-white/45">Move toward</p>
                    <p className="mt-1 font-medium">Meaningful progress</p>
                  </div>
                </div>
              </div>
              <p className="mt-5 text-center text-xs tracking-wide text-white/40">
                Good technology should feel like possibility.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c7f47b]/40 to-transparent" />
        </section>

        <section id="services" className="scroll-mt-24 bg-[#f4f6f1] px-6 py-24 sm:px-10 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#58715c]">
                  What we do
                </p>
                <h2 className="text-4xl font-semibold tracking-[-0.045em] text-[#14211b] sm:text-5xl">
                  The right support,
                  <br className="hidden sm:block" /> right where you need it.
                </h2>
              </div>
              <p className="max-w-md leading-7 text-[#59645b]">
                From first idea to everyday operations, we bring the people and
                know-how to make your technology work better.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <ServiceCard key={service.number} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-24 bg-[#e8eee6] px-6 py-24 sm:px-10 lg:px-12 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#58715c]">
                About us
              </p>
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.045em] text-[#14211b] sm:text-5xl">
                A tech partner
                <br />
                that gets it.
              </h2>
              <div className="mt-9 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['#b8caad', '#d2bd9e', '#92a899'].map((color, index) => (
                    <span
                      key={color}
                      aria-hidden="true"
                      className="grid size-10 place-items-center rounded-full border-2 border-[#e8eee6] text-sm font-semibold text-[#24352b]"
                      style={{ backgroundColor: color }}
                    >
                      {['A', 'T', 'J'][index]}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[#59645b]">A real team, in your corner</p>
              </div>
            </div>
            <div className="lg:pt-1">
              <p className="text-xl leading-9 tracking-[-0.02em] text-[#26372d] sm:text-2xl sm:leading-10">
                Technology is at its best when it helps people do their best.
                That&apos;s why we start by listening, stay close as we build,
                and keep the complicated parts on our side of the table.
              </p>
              <div className="mt-10 grid gap-8 border-t border-[#c7d2c5] pt-8 sm:grid-cols-2">
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-[#14211b]">
                    Clear by default
                  </p>
                  <p className="mt-2 leading-7 text-[#59645b]">
                    Straight answers, sensible plans, and no jargon for its own sake.
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-[#14211b]">
                    Here for the long run
                  </p>
                  <p className="mt-2 leading-7 text-[#59645b]">
                    Practical solutions that grow with your business, not against it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 bg-white px-6 py-24 sm:px-10 lg:px-12 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#58715c]">
                FAQ
              </p>
              <h2 className="text-4xl font-semibold tracking-[-0.045em] text-[#14211b] sm:text-5xl">
                A few things
                <br />
                you might wonder.
              </h2>
              <p className="mt-5 max-w-sm leading-7 text-[#59645b]">
                Still have a question? We&apos;re always happy to talk through
                the details.
              </p>
              <a
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#263f2e] underline decoration-[#9eb49c] underline-offset-4 transition hover:text-[#567c45]"
                href="#contact"
              >
                Ask us anything <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="divide-y divide-[#e3e8e2] border-y border-[#e3e8e2]">
              {isFaqLoading ? (
                <p
                  aria-live="polite"
                  className="flex items-center gap-3 py-8 text-sm text-[#637065]"
                  role="status"
                >
                  <span className="size-5 animate-spin rounded-full border-2 border-[#dce4da] border-t-[#547a43]" />
                  Generating helpful answers…
                </p>
              ) : faqContent.length > 0 ? (
                faqContent.map((faq, index) => (
                  <FAQItem key={faq.question} faq={faq} index={index} />
                ))
              ) : (
                <div className="py-6">
                  <p aria-live="polite" className="text-sm text-[#8a453d]" role="alert">
                    {faqError || 'No FAQ content is available right now.'}
                  </p>
                  <button
                    className="mt-3 text-sm font-semibold text-[#263f2e] underline underline-offset-4 hover:text-[#567c45]"
                    onClick={() => {
                      setIsFaqLoading(true)
                      generateFAQ()
                    }}
                    type="button"
                  >
                    Try again
                  </button>
                  <div className="mt-5 divide-y divide-[#e3e8e2] border-t border-[#e3e8e2]">
                    {faqs.map((faq, index) => (
                      <FAQItem key={faq.question} faq={faq} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-[#c7f47b] px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#42543c]">
                Contact
              </p>
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#14211b] sm:text-6xl">
                Ready for technology
                <br className="hidden sm:block" /> that moves you forward?
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-[#334432]">
                Tell us what you&apos;re working toward. We&apos;ll help you find
                a practical place to start.
              </p>
            </div>
            <a
              className="inline-flex shrink-0 items-center justify-center gap-4 rounded-full bg-[#14211b] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#263b30] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14211b]"
              href="mailto:hello@northstarit.example?subject=Let%27s%20talk"
            >
              hello@northstarit.example
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot
        isOpen={isChatbotOpen}
        onSend={sendChatMessage}
        onToggle={() => setIsChatbotOpen((open) => !open)}
      />
    </>
  )
}

export default App
