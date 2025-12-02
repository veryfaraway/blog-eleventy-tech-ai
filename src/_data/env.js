module.exports = {
  // Google Analytics
  googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || "",
  
  // Google AdSense
  adsense: {
    enabled: process.env.ADSENSE_ENABLED === "true",
    client: process.env.ADSENSE_CLIENT_ID || "",
    slots: {
      inArticle: process.env.ADSENSE_SLOT_IN_ARTICLE || "",
      display: process.env.ADSENSE_SLOT_DISPLAY || ""
    }
  },
  
  // Utterances (댓글)
  utterances: {
    enabled: process.env.UTTERANCES_ENABLED === "true",
    repo: process.env.UTTERANCES_REPO || ""
  }
};
