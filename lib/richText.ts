export interface RichTextSpan {
  _type: 'span'
  _key?: string
  text: string
  marks?: string[]
}

export interface RichTextBlock {
  _type: 'block'
  _key?: string
  style?: 'normal'
  listItem?: 'bullet'
  level?: number
  children?: RichTextSpan[]
}

export type VehicleDescription = string | RichTextBlock[] | null | undefined

function createKey(prefix: string, index: number): string {
  return `${prefix}-${Date.now().toString(36)}-${index}`
}

function blockToText(block: RichTextBlock): string {
  return block.children?.map((child) => child.text).join('') ?? ''
}

export function portableTextToPlainText(value: VehicleDescription): string {
  if (!value) return ''
  if (typeof value === 'string') return value

  return value
    .map((block) => blockToText(block))
    .filter(Boolean)
    .join('\n')
}

export function textToPortableText(value: string): RichTextBlock[] | undefined {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return undefined

  return lines.map((line, index) => {
    const isBullet = /^[-*]\s+/.test(line)
    const text = isBullet ? line.replace(/^[-*]\s+/, '').trim() : line

    return {
      _type: 'block',
      _key: createKey('block', index),
      style: 'normal',
      ...(isBullet ? { listItem: 'bullet' as const, level: 1 } : {}),
      children: [
        {
          _type: 'span',
          _key: createKey('span', index),
          text,
          marks: [],
        },
      ],
    }
  })
}
