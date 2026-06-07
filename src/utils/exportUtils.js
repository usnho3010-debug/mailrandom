export async function copyText(text) {
  if (!text) return false

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()

    try {
      return document.execCommand('copy')
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadText(filename, contents, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([contents], { type: mime })
  downloadBlob(filename, blob)
}

export function downloadDataUrl(filename, dataUrl) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function csvEscape(value) {
  const quote = String.fromCharCode(34)
  return quote + String(value).replaceAll(quote, quote + quote) + quote
}

export function toAliasCsv(aliases) {
  return 'index,email\n' + aliases.map((alias, index) => String(index + 1) + ',' + csvEscape(alias)).join('\n')
}

export function downloadJson(filename, data) {
  downloadText(filename, JSON.stringify(data, null, 2), 'application/json;charset=utf-8')
}

export async function downloadAliasesPdf(filename, title, aliases) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 40
  const lineHeight = 14
  const pageHeight = doc.internal.pageSize.getHeight()
  let y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(title, margin, y)
  y += 24
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Total aliases: ' + aliases.length, margin, y)
  y += 22

  aliases.forEach((alias, index) => {
    if (y > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(String(index + 1) + '. ' + alias, margin, y)
    y += lineHeight
  })

  doc.save(filename)
}

export async function downloadAliasesDocx(filename, title, aliases) {
  const { Document, Packer, Paragraph, TextRun } = await import('docx')
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 32 })] }),
          new Paragraph({ text: 'Total aliases: ' + aliases.length }),
          ...aliases.map((alias, index) => new Paragraph({ text: String(index + 1) + '. ' + alias })),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  downloadBlob(filename, blob)
}
