function requireApiKey(req, res, next) {
  const key = req.headers["x-venue-api-key"];
  if (!key || !key.startsWith("sk-ant-")) {
    return res.status(401).json({
      error: "No API key provided. Please connect your Anthropic key in the UI."
    });
  }
  req.anthropicApiKey = key;
  next();
}

module.exports = requireApiKey;
