import type { VehicleDescription, RichTextBlock } from '@/lib/richText'

function renderStringDescription(value: string) {
  return value
    .split(/\n{2,}|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={index} className="leading-7 text-gray-700">
        {paragraph}
      </p>
    ))
}

function blockText(block: RichTextBlock): string {
  return block.children?.map((child) => child.text).join('') ?? ''
}

export function RichTextRenderer({ value }: { value: VehicleDescription }) {
  if (!value) return null

  if (typeof value === 'string') {
    const content = renderStringDescription(value)
    return content.length > 0 ? <div className="space-y-4">{content}</div> : null
  }

  const blocks = value.filter((block) => blockText(block).trim().length > 0)
  if (blocks.length === 0) return null

  const elements: React.ReactNode[] = []
  let bulletItems: React.ReactNode[] = []

  const flushBullets = () => {
    if (bulletItems.length === 0) return
    elements.push(
      <ul key={`ul-${elements.length}`} className="list-disc space-y-2 pl-5 text-gray-700">
        {bulletItems}
      </ul>
    )
    bulletItems = []
  }

  blocks.forEach((block, index) => {
    const text = blockText(block).trim()

    if (block.listItem === 'bullet') {
      bulletItems.push(
        <li key={block._key || index} className="leading-7">
          {text}
        </li>
      )
      return
    }

    flushBullets()
    elements.push(
      <p key={block._key || index} className="leading-7 text-gray-700">
        {text}
      </p>
    )
  })

  flushBullets()

  return <div className="space-y-4">{elements}</div>
}
