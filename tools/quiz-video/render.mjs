import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import ffmpegPath from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
// TikTok and Reels put their buttons on the right and the caption at the bottom.
const LEFT = 90;
const CONTENT_WIDTH = 830;
const TOP = 230;

const COLORS = {
  bg: "#0f1118",
  surface: "#171a24",
  border: "#2a2e3d",
  text: "#eef0f7",
  muted: "#9a9fb0",
  accent: "#6193ff",
  onAccent: "#0c0d13",
};

for (const [family, pkg, weights] of [
  ["Space Grotesk", "space-grotesk", [500, 700]],
  ["Hanken Grotesk", "hanken-grotesk", [400, 600]],
]) {
  for (const weight of weights) {
    const file = require.resolve(`@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2`);
    GlobalFonts.registerFromPath(file, family);
  }
}

const font = (weight, size, family = "Hanken Grotesk") => `${weight} ${size}px "${family}"`;
const clamp = (v) => Math.min(1, Math.max(0, v));
const easeOut = (v) => 1 - Math.pow(1 - clamp(v), 3);

function wrap(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// Picks the largest size at which the text stays within maxLines.
function fit(ctx, text, maxWidth, weight, family, sizes, maxLines) {
  for (const size of sizes) {
    ctx.font = font(weight, size, family);
    const lines = wrap(ctx, text, maxWidth);
    if (lines.length <= maxLines) return { size, lines };
  }
  const size = sizes[sizes.length - 1];
  ctx.font = font(weight, size, family);
  return { size, lines: wrap(ctx, text, maxWidth) };
}

function layoutQuestion(ctx, question) {
  const q = fit(ctx, question.text, CONTENT_WIDTH, 700, "Space Grotesk", [62, 56, 50, 44], 5);
  const qHeight = q.lines.length * Math.round(q.size * 1.2);
  const optionStart = TOP + 190 + qHeight + 44;

  ctx.font = font(600, 38);
  let y = optionStart;
  const options = question.options.map((option, i) => {
    const lines = wrap(ctx, option.text, CONTENT_WIDTH - 130);
    const height = Math.max(104, lines.length * 48 + 48);
    const box = { ...option, letter: "ABCD"[i], lines, y, height };
    y += height + 18;
    return box;
  });

  ctx.font = font(400, 36);
  const explanation = wrap(ctx, question.explanation, CONTENT_WIDTH);
  return { q, qHeight, options, explanation, optionsEnd: y };
}

// Reading time decides how long the question and the explanation stay up.
export function timeline(question) {
  const words = (s) => s.split(/\s+/).length;
  const allOptions = question.options.map((o) => o.text).join(" ");
  const guess = Math.min(8, Math.max(5, (words(question.text) + words(allOptions)) / 3));
  const read = Math.min(7, Math.max(3.5, words(question.explanation) / 2.8));
  const hook = 1.8;
  const reveal = hook + guess;
  const outro = reveal + read;
  const end = outro + 2.6;
  return { hook, guess, reveal, outro, end };
}

function drawHeader(ctx, logo, examName, alpha) {
  ctx.globalAlpha = alpha;
  ctx.drawImage(logo, LEFT, TOP, 72, 72);
  ctx.fillStyle = COLORS.text;
  ctx.font = font(700, 46, "Space Grotesk");
  ctx.textBaseline = "middle";
  ctx.fillText("paukr", LEFT + 90, TOP + 37);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = COLORS.muted;
  ctx.font = font(600, 32);
  ctx.fillText(examName, LEFT, TOP + 128);
  ctx.globalAlpha = 1;
}

function drawHook(ctx, t, tl) {
  const inn = easeOut(t / 0.35);
  const out = clamp((tl.hook - t) / 0.2);
  ctx.globalAlpha = Math.min(inn, out);
  ctx.fillStyle = COLORS.text;
  ctx.font = font(700, 96, "Space Grotesk");
  const lines = wrap(ctx, "Würdest du diese Frage schaffen?", CONTENT_WIDTH);
  const start = 860 - ((lines.length - 1) * 112) / 2 + (1 - inn) * 30;
  lines.forEach((line, i) => ctx.fillText(line, LEFT, start + i * 112));
  ctx.globalAlpha = 1;
}

function drawQuestion(ctx, layout, t, tl) {
  const start = tl.hook;
  const seen = t - start;
  const revealed = t >= tl.reveal;
  const lineHeight = Math.round(layout.q.size * 1.2);

  ctx.globalAlpha = easeOut(seen / 0.3);
  ctx.fillStyle = COLORS.text;
  ctx.font = font(700, layout.q.size, "Space Grotesk");
  layout.q.lines.forEach((line, i) => ctx.fillText(line, LEFT, TOP + 190 + layout.q.size + i * lineHeight));
  ctx.globalAlpha = 1;

  const pop = easeOut((t - tl.reveal) / 0.3);
  layout.options.forEach((o, i) => {
    const inn = easeOut((seen - 0.2 - i * 0.12) / 0.3);
    if (inn <= 0) return;
    const dim = revealed && !o.isCorrect ? 1 - 0.65 * pop : 1;
    const correct = revealed && o.isCorrect;
    const scale = correct ? 1 + 0.025 * Math.sin(Math.PI * clamp((t - tl.reveal) / 0.35)) : 1;

    ctx.save();
    ctx.globalAlpha = inn * dim;
    ctx.translate(LEFT + CONTENT_WIDTH / 2, o.y + o.height / 2 + (1 - inn) * 24);
    ctx.scale(scale, scale);
    ctx.translate(-(LEFT + CONTENT_WIDTH / 2), -(o.y + o.height / 2));

    roundedRect(ctx, LEFT, o.y, CONTENT_WIDTH, o.height, 26);
    ctx.fillStyle = correct ? COLORS.accent : COLORS.surface;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = correct ? COLORS.accent : COLORS.border;
    ctx.stroke();

    ctx.fillStyle = correct ? COLORS.onAccent : COLORS.accent;
    ctx.font = font(700, 40, "Space Grotesk");
    ctx.textBaseline = "middle";
    ctx.fillText(o.letter, LEFT + 34, o.y + o.height / 2);

    ctx.fillStyle = correct ? COLORS.onAccent : COLORS.text;
    ctx.font = font(600, 38);
    const textTop = o.y + o.height / 2 - ((o.lines.length - 1) * 48) / 2;
    o.lines.forEach((line, n) => ctx.fillText(line, LEFT + 96, textTop + n * 48));
    ctx.textBaseline = "alphabetic";
    ctx.restore();
  });

  if (!revealed) {
    const left = tl.reveal - t;
    const barY = layout.optionsEnd + 22;
    roundedRect(ctx, LEFT, barY, CONTENT_WIDTH, 14, 7);
    ctx.fillStyle = COLORS.surface;
    ctx.fill();
    roundedRect(ctx, LEFT, barY, Math.max(14, CONTENT_WIDTH * (left / tl.guess)), 14, 7);
    ctx.fillStyle = COLORS.accent;
    ctx.fill();
  } else {
    const lineH = 50;
    const textY = layout.optionsEnd + 50;
    ctx.globalAlpha = easeOut((t - tl.reveal - 0.25) / 0.35);
    ctx.fillStyle = COLORS.muted;
    ctx.font = font(400, 36);
    layout.explanation.forEach((line, i) => ctx.fillText(line, LEFT, textY + i * lineH));
    ctx.globalAlpha = 1;
  }
}

function drawOutro(ctx, logo, t, tl) {
  const inn = easeOut((t - tl.outro) / 0.35);
  ctx.globalAlpha = inn;
  ctx.drawImage(logo, LEFT, 620, 150, 150);
  ctx.fillStyle = COLORS.text;
  ctx.font = font(700, 88, "Space Grotesk");
  const title = wrap(ctx, "Mehr Übungsfragen kostenlos", CONTENT_WIDTH);
  title.forEach((line, i) => ctx.fillText(line, LEFT, 880 + i * 102));
  const urlY = 880 + (title.length - 1) * 102 + 116;
  ctx.fillStyle = COLORS.accent;
  ctx.font = font(700, 72, "Space Grotesk");
  ctx.fillText("paukr.app", LEFT, urlY);
  ctx.fillStyle = COLORS.muted;
  ctx.font = font(400, 32);
  wrap(ctx, "Eigene Übungsfrage, keine Original-Prüfungsaufgabe. Keine Verbindung zur IHK.", CONTENT_WIDTH).forEach((line, i) =>
    ctx.fillText(line, LEFT, urlY + 80 + i * 44),
  );
  ctx.globalAlpha = 1;
}

export function drawFrame(ctx, logo, question, layout, tl, t) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if (t < tl.hook) {
    drawHeader(ctx, logo, question.examName, easeOut(t / 0.35));
    drawHook(ctx, t, tl);
  } else if (t < tl.outro) {
    const fade = clamp((tl.outro - t) / 0.2);
    drawHeader(ctx, logo, question.examName, fade);
    ctx.globalAlpha = 1;
    drawQuestion(ctx, layout, t, tl);
    if (fade < 1) {
      ctx.globalAlpha = 1 - fade;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.globalAlpha = 1;
    }
  } else {
    drawOutro(ctx, logo, t, tl);
  }
}

export async function prepare() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");
  const logo = await loadImage(join(here, "..", "..", "public", "logo.svg"));
  return { canvas, ctx, logo };
}

export function layoutFits(ctx, question) {
  const layout = layoutQuestion(ctx, question);
  // Everything has to end above the caption area of the apps.
  return layout.optionsEnd + 50 + layout.explanation.length * 50 <= 1560;
}

export function renderStill(tools, question, t) {
  const { canvas, ctx, logo } = tools;
  drawFrame(ctx, logo, question, layoutQuestion(ctx, question), timeline(question), t);
  return canvas.encode("png");
}

export async function renderVideo(tools, question, outFile) {
  const { canvas, ctx, logo } = tools;
  const layout = layoutQuestion(ctx, question);
  const tl = timeline(question);
  const frames = Math.round(tl.end * FPS);

  const ffmpeg = spawn(
    ffmpegPath,
    [
      "-y", "-loglevel", "error",
      "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${WIDTH}x${HEIGHT}`, "-r", String(FPS), "-i", "pipe:0",
      "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      outFile,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const finished = new Promise((resolve, reject) => {
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
  });

  for (let frame = 0; frame < frames; frame++) {
    drawFrame(ctx, logo, question, layout, tl, frame / FPS);
    const pixels = ctx.getImageData(0, 0, WIDTH, HEIGHT).data;
    if (!ffmpeg.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength))) {
      await new Promise((resolve) => ffmpeg.stdin.once("drain", resolve));
    }
  }
  ffmpeg.stdin.end();
  await finished;
  return tl.end;
}
