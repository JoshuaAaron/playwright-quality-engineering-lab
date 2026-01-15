export const parseCsv = (input: string) => {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return []
  }

  const [headerLine, ...rows] = lines
  const headers = headerLine.split(',').map((header) => header.trim())

  return rows.map((row) => {
    const values = row.split(',').map((value) => value.trim())
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? ''
      return acc
    }, {})
  })
}
