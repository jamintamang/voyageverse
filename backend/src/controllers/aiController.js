import { z } from "zod";
import { getOpenAI } from "../ai/openai.js";

const promptSchema = z.object({
  prompt: z.string().min(3).max(4000),
  tone: z.string().max(120).optional(),
});

const buildSystem = (role, tone) =>
  `${role} Keep answers concise, vivid, and platform-ready. ${tone ? `Tone: ${tone}.` : ""}`;

export const caption = async (req, res) => {
  try {
    const { prompt, tone } = promptSchema.parse(req.body);
    const openai = getOpenAI();
    if (!openai) {
      return res.json({
        success: true,
        mock: true,
        result: `Golden hour over ridgelines — "${prompt.slice(0, 80)}…" told in one breath. #VoyageVerse #CinematicTravel`,
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystem(
            "You write premium Instagram-style travel captions with line breaks and 3–6 hashtags.",
            tone
          ),
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
    });
    const text = completion.choices[0]?.message?.content?.trim() || "";
    return res.json({ success: true, mock: false, result: text });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const hashtags = async (req, res) => {
  try {
    const { prompt, tone } = promptSchema.parse(req.body);
    const openai = getOpenAI();
    if (!openai) {
      return res.json({
        success: true,
        mock: true,
        result: "#NomadCinema #Wanderlust #TravelFilm #StoryFirst #VoyageVerse #CreatorEconomy",
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystem(
            "Return a single line of 12–18 mixed-size travel/creator hashtags, space-separated, no commentary.",
            tone
          ),
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
    });
    return res.json({
      success: true,
      mock: false,
      result: completion.choices[0]?.message?.content?.trim() || "",
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const bio = async (req, res) => {
  try {
    const { prompt, tone } = promptSchema.parse(req.body);
    const openai = getOpenAI();
    if (!openai) {
      return res.json({
        success: true,
        mock: true,
        result:
          "Travel filmmaker · chasing light across continents · partnerships open · new drops weekly — VoyageVerse",
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystem(
            "Write a 2–3 line creator bio with subtle prestige; no emojis unless user asks.",
            tone
          ),
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 220,
    });
    return res.json({
      success: true,
      mock: false,
      result: completion.choices[0]?.message?.content?.trim() || "",
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const story = async (req, res) => {
  try {
    const { prompt, tone } = promptSchema.parse(req.body);
    const openai = getOpenAI();
    if (!openai) {
      return res.json({
        success: true,
        mock: true,
        result:
          "The pass opened like a curtain. Wind carried prayer flags across the valley — each flap a beat in the story we did not yet know we were telling.",
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystem(
            "You are a cinematic travel storyteller. 120–220 words, present tense, sensory detail, one sharp turn.",
            tone
          ),
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    });
    return res.json({
      success: true,
      mock: false,
      result: completion.choices[0]?.message?.content?.trim() || "",
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const embed = async (req, res) => {
  try {
    const { prompt } = promptSchema.parse(req.body);
    const openai = getOpenAI();
    if (!openai) {
      const mockVec = Array.from({ length: 8 }, (_, i) =>
        Math.sin((i + prompt.length) * 0.37)
      );
      return res.json({ success: true, mock: true, dimensions: mockVec.length, embedding: mockVec });
    }
    const emb = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: prompt.slice(0, 8000),
    });
    return res.json({
      success: true,
      mock: false,
      dimensions: emb.data[0].embedding.length,
      embedding: emb.data[0].embedding.slice(0, 32),
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
