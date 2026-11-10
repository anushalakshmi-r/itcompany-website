function ServiceCard({ service }) {
  return (
    <article className="group flex min-h-72 flex-col rounded-2xl border border-[#dfe5dc] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#bacbb5] hover:shadow-xl hover:shadow-[#27392b]/[0.06] sm:p-7">
      <div className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-[#edf3e9] text-2xl text-[#36513a] transition group-hover:bg-[#c7f47b]">
          {service.symbol}
        </span>
        <span className="text-xs font-medium tracking-[0.16em] text-[#9aa59a]">
          {service.number}
        </span>
      </div>
      <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em] text-[#18271e]">
        {service.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-[#637065]">
        {service.description}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#f2f5f0] px-3 py-1.5 text-[11px] font-medium text-[#576658]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}

export default ServiceCard
