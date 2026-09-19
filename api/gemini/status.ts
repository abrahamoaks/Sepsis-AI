export default function handler(_req: any, res: any) {
  const isLive = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({
    live: isLive,
    model: "gemini-3.8-flash",
    mode: isLive ? "Live Gemini API" : "Hospital CDS Protocol Model"
  });
}
