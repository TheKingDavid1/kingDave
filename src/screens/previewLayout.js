function getPreviewFrame(windowWidth, windowHeight) {
  const width = Number.isFinite(windowWidth) ? Math.max(0, windowWidth) : 0;
  const heightLimit = Number.isFinite(windowHeight) ? Math.max(0, windowHeight * 0.46) : 0;
  if (width === 0 || heightLimit === 0) return { width: 0, height: 0 };

  const height = Math.min(width * 9 / 16, heightLimit);
  return { width: height * 16 / 9, height };
}

module.exports = { getPreviewFrame };
