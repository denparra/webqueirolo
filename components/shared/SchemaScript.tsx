interface SchemaScriptProps {
  schema: Record<string, unknown>
}

export function SchemaScript({ schema }: SchemaScriptProps) {
  // Escapa la secuencia "</" para evitar que un valor con "</script>" rompa
  // el bloque JSON-LD (XSS por ruptura de etiqueta).
  const json = JSON.stringify(schema).replace(/</g, '\\u003c')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: json,
      }}
    />
  )
}
