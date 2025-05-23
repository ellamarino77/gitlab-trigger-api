import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";  // Add cors

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Use CORS middleware
app.use(cors());

app.use(express.json());

app.post("/trigger", async (req, res) => {
  const GITLAB_TOKEN = process.env.GITLAB_TRIGGER_TOKEN;
  const GITLAB_PROJECT = "teamaxolotls%2Fdevsecopspipeline";
  const REF = "main";

  try {
    const body = new URLSearchParams({
      token: GITLAB_TOKEN,
      ref: REF,
      'variables[TRIGGER_SOURCE]': 'Website UI'
    });
    const response = await fetch(`https://gitlab.com/api/v4/projects/${GITLAB_PROJECT}/trigger/pipeline`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: GITLAB_TOKEN, ref: REF })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Trigger API running on port ${PORT}`);
});

