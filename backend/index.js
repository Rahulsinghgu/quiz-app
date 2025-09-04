import express from "express";
import cors from "cors";
import questionsRouter from "./routes/questions.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API route for questions
app.use("/api/questions", questionsRouter);

// (Optional) static serve for production build (see Step 6)
app.get("/", (req, res) => {
  res.json({ message: "Quiz backend is running. GET /api/questions to fetch quiz data." });
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
