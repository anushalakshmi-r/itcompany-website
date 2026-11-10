import { useState } from 'react'

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false)
  const answerId = `faq-answer-${index}`

  return (
    <article className="py-2">
      <h3>
        <button
          aria-controls={answerId}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-semibold text-[#1b2b21] transition hover:text-[#547a43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70945f] sm:text-lg"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {faq.question}
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full border border-[#dce4da] text-lg font-normal"
          >
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </h3>
      <div
        className={`${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} grid transition-[grid-template-rows,opacity] duration-300`}
        id={answerId}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 pr-12 leading-7 text-[#637065]">
            {faq.answer}
          </p>
        </div>
      </div>
    </article>
  )
}

export default FAQItem
