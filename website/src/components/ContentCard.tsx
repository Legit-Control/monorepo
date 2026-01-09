import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRightIcon } from '@heroicons/react/16/solid'

type ContentCardProps = {
  href: string
  title: string
  description: string
  date?: string
  author?: string
  image: string
  tags?: string[]
}

export function ContentCard({
  href,
  title,
  description,
  date,
  author,
  image,
  tags
}: ContentCardProps) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')
  
  const cardContent = (
    <>
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-zinc-50">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-3"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {!!tags?.length && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {(author || date) && (
          <div className="mb-2 text-xs text-gray-500">
            {author && <span>by {author}</span>}
            {author && date && <span className="mx-1">•</span>}
            {date && <span>{date}</span>}
          </div>
        )}

        <h3 className="mb-1 text-lg font-semibold leading-snug">
          {title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3 flex-grow">
          {description}
        </p>

        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Show {title}
          {isExternal && <ArrowUpRightIcon className="w-3 h-3 text-primary" />}
        </span>
      </div>
    </>
  )

  const className = "h-full rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-sm flex flex-col"

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {cardContent}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={className}
    >
      {cardContent}
    </Link>
  )
}
