export const getReadableParagraphs = (content) => {
  const source = String(content || "").replace(/\r\n?/g, "\n").trim();
  if (!source) return [];

  return source.split(/\n\s*\n/).flatMap((block) => {
    const paragraph = block.trim();
    // Keep authored line breaks intact. For older single-block descriptions,
    // introduce visual paragraph breaks after every three complete sentences.
    if (paragraph.includes("\n") || paragraph.length < 600) return [paragraph];

    const sentences = paragraph.match(/[^.!?]+(?:[.!?]+|$)/g)?.map((part) => part.trim()) || [];
    if (sentences.length < 4) return [paragraph];

    const paragraphs = [];
    for (let index = 0; index < sentences.length; index += 3) {
      paragraphs.push(sentences.slice(index, index + 3).join(" "));
    }
    return paragraphs;
  });
};
