// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/trigger", async (req, res) => {
  const GITLAB_TOKEN = process.env.GITLAB_TRIGGER_TOKEN;
  const GITLAB_PROJECT = process.env.GITLAB_PROJECT_PATH;
  const REF = process.env.GITLAB_REF || "main";

  try {
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

