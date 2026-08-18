import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./Game.module.css";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const W = 700;
const H = 260;
const GROUND_Y = H - 40;

const CHARACTERS = [
  { emoji: "🧑‍💻", name: "CODER", color: "#33ff9e" },
  { emoji: "🥷", name: "NINJA", color: "#ff4d7d" },
  { emoji: "🤖", name: "ROBOT", color: "#4fd6ff" },
  { emoji: "👾", name: "ALIEN", color: "#ffd23f" },
  { emoji: "🧙", name: "WIZARD", color: "#b98bff" },
];

const makePlayer = () => ({
  x: 60,
  y: GROUND_Y - 30,
  w: 28,
  h: 30,
  vy: 0,
  jumping: false,
});

export const Game = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    player: makePlayer(),
    obstacles: [],
    speed: 5,
    score: 0,
    spawnTimer: 70,
    running: false,
    frame: 0,
  });
  const charRef = useRef(CHARACTERS[0]);
  const reducedMotion = usePrefersReducedMotion();

  const [character, setCharacter] = useState(CHARACTERS[0]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  charRef.current = character;

  const drawGround = useCallback((ctx) => {
    ctx.strokeStyle = "#a99fcf";
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(W, GROUND_Y);
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const drawPlayer = useCallback((ctx, player) => {
    ctx.font = "28px sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(charRef.current.emoji, player.x - 3, player.y + player.h - 2);
  }, []);

  const drawIdle = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#120c1e";
    ctx.fillRect(0, 0, W, H);
    drawGround(ctx);
    drawPlayer(ctx, makePlayer());
  }, [drawGround, drawPlayer]);

  // Redraw the idle frame whenever the character changes and no run is active.
  useEffect(() => {
    if (!stateRef.current.running) drawIdle();
  }, [character, drawIdle]);

  const startGame = useCallback(() => {
    const state = stateRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    cancelAnimationFrame(state.frame);
    state.player = makePlayer();
    state.obstacles = [];
    state.speed = 5;
    state.score = 0;
    state.spawnTimer = 70;
    state.running = true;
    setGameOver(false);

    const endGame = () => {
      state.running = false;
      cancelAnimationFrame(state.frame);
      const points = Math.floor(state.score / 5);
      setScore(points);
      setBest((current) => Math.max(current, points));
      setGameOver(true);
    };

    const loop = () => {
      if (!state.running) return;

      const { player } = state;
      player.vy += 0.6;
      player.y += player.vy;

      if (player.y > GROUND_Y - player.h) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.jumping = false;
      }

      state.spawnTimer -= 1;
      if (state.spawnTimer <= 0) {
        state.obstacles.push({ x: W, y: GROUND_Y - 24, w: 22, h: 24 });
        state.spawnTimer = Math.max(
          38,
          85 - state.speed * 4 + Math.random() * 30
        );
      }

      state.obstacles.forEach((o) => {
        o.x -= state.speed;
      });
      state.obstacles = state.obstacles.filter((o) => o.x + o.w > -10);

      const hit = state.obstacles.some(
        (o) =>
          player.x + 4 < o.x + o.w - 4 &&
          player.x + player.w - 4 > o.x + 4 &&
          player.y + 4 < o.y + o.h &&
          player.y + player.h > o.y + 4
      );

      if (hit) {
        endGame();
        return;
      }

      state.score += 1;
      state.speed += 0.0035;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#120c1e";
      ctx.fillRect(0, 0, W, H);
      drawGround(ctx);
      drawPlayer(ctx, player);

      ctx.font = "22px sans-serif";
      state.obstacles.forEach((o) => ctx.fillText("🐛", o.x, o.y + 20));

      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillStyle = charRef.current.color;
      ctx.fillText(`SCORE ${Math.floor(state.score / 5)}`, 16, 26);

      state.frame = requestAnimationFrame(loop);
    };

    state.frame = requestAnimationFrame(loop);
  }, [drawGround, drawPlayer]);

  const jump = useCallback(() => {
    const state = stateRef.current;

    if (!state.running) {
      startGame();
      return;
    }

    if (!state.player.jumping) {
      state.player.vy = -11.5;
      state.player.jumping = true;
    }
  }, [startGame]);

  // Draw the idle frame once, and tear the loop down on unmount.
  useEffect(() => {
    drawIdle();
    const state = stateRef.current;

    return () => {
      state.running = false;
      cancelAnimationFrame(state.frame);
    };
  }, [drawIdle]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code !== "Space" && event.code !== "ArrowUp") return;

      // Never swallow Space from a focused control. The character buttons sit
      // directly above the canvas, so they are almost always on screen when it
      // is — without this, Space on a focused button jumps instead of
      // activating it, silently breaking standard button semantics.
      if (event.target.closest("button, a, input, textarea, select")) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
      if (!onScreen) return;

      event.preventDefault();
      jump();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [jump]);

  return (
    <section className={styles.container} id="game">
      <div className={`section-head ${styles.head}`}>
        <div className="eyebrow">
          <span className="lv">★</span> SECRET LEVEL
        </div>
        <h2>BONUS: DODGE THE BUGS</h2>
      </div>

      <p className={styles.hint}>Choose your player:</p>
      <div className={styles.charGrid}>
        {CHARACTERS.map((option) => (
          <button
            key={option.name}
            type="button"
            className={`${styles.charOption} ${
              option.name === character.name ? styles.selected : ""
            }`}
            aria-pressed={option.name === character.name}
            onClick={() => setCharacter(option)}
          >
            <span className={styles.charEmoji} aria-hidden="true">
              {option.emoji}
            </span>
            <span className={styles.charName}>{option.name}</span>
          </button>
        ))}
      </div>

      <p className={styles.hint}>
        You scrolled this far, so here&apos;s a mini-game. Press{" "}
        <strong>SPACE</strong> or tap the screen to jump.
      </p>

      <div className={styles.screenWrap}>
        <PixelFrame size="lg" innerClassName={styles.screen}>
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className={styles.canvas}
            onPointerDown={jump}
            role="img"
            aria-label="Dodge the bugs mini-game. Press space or tap to jump over bugs."
          />
          <div
            className={`${styles.overlay} ${gameOver ? styles.show : ""}`}
            role="status"
          >
            <div>
              <p className={styles.overlayTitle}>GAME OVER</p>
              <p className={styles.overlayScore}>
                Score: {score} — Best: {best}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={startGame}
              >
                ▶ PLAY AGAIN
              </button>
            </div>
          </div>
        </PixelFrame>
      </div>

      <div className={styles.startRow}>
        <button type="button" className="btn btn-ghost" onClick={jump}>
          ▶ INSERT COIN TO START
        </button>
      </div>

      {reducedMotion && (
        <p className={styles.hint} style={{ marginTop: "18px" }}>
          Reduced motion is on — the game is paused. Press START to play anyway.
        </p>
      )}
    </section>
  );
};
