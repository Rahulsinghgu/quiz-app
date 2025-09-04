import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const dataPath = path.resolve("./backend/data/questions.json");

// Normalize OpenTrivia-like format into { id, question, options, correctIndex }
function normalize(q) {
  // Build options array and shuffle
  const allOptions = [...(q.incorrect_answers || []), q.correct_answer];
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }
  const correctIndex = allOptions.indexOf(q.correct_answer);
  return {
    id: q.id ?? Math.random().toString(36).slice(2, 9),
    question: q.question,
    options: allOptions,
    correctIndex,
    difficulty: q.difficulty ?? "medium"
  };
}

router.get("/", (req, res) => {
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    const arr = JSON.parse(raw);
    const normalized = arr.map(normalize);
    const limit = Number(req.query.limit || 0);
    res.json(limit > 0 ? normalized.slice(0, limit) : normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load questions" });
  }
});

export default router;
