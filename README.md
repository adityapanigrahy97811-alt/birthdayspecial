# 💖 Happy Birthday Bestie - Birthday Surprise Website

An extremely emotional, heart-touching, aesthetic, animated birthday surprise website for a girl best friend. Designed to be a "healing digital hug," featuring soft pink, rose red, white, and peach glow themes with romantic warm lighting, paper scrapbook styles, glassmorphism, custom canvas particle animations (hearts, petals, lanterns), and a procedural audio synth/lofi player.

## ✨ Features
- **Gateway Intro**: A romantic/heartfelt greeting card gateway to enter the safe space.
- **Cinematic Typing Animations**: Heartfelt letters typing out word-by-word with beautiful transitions.
- **Floating Particles**: Real-time canvas-rendered hearts, sparkles, and petals following the user's cursor.
- **Interactive Polaroid Scrapbook**: A grid of memories taped like real polaroids with delightful hover tilt effects.
- **Emotional Message Cards**: Glassmorphic letters from the heart that reveal warm wishes and humorous best-friend notes.
- **Interactive Smile Button**: An interactive trigger that fires canvas confetti and reveals a hidden sweet note that rotates randomly on click.
- **Floating Vinyl Music Player**: A revolving vinyl disc music player to toggle background music.

## 🛠️ Tech Stack
- **HTML5, CSS3, & JavaScript** (vanilla, self-contained)
- **GSAP & Canvas Confetti** (for animations and celebratory effects via CDN)
- **Web Audio API** (procedural chimes/ambient piano synth - no external audio file loading lag)

## 🚀 How to Run Locally
1. Simply double-click `index.html` or open it in any web browser.
2. For the best experience (and to avoid local browser audio autoplay restrictions), run a local web server in this folder:
   ```bash
   python -m http.server 8080
   ```
   and navigate to `http://localhost:8080` in your web browser.

## ☁️ How to Deploy to Vercel (Free)
This is a standard static web application, which makes it incredibly simple to deploy to Vercel:
1. Push all files (`index.html`, `styles.css`, `script.js`, `assets/`) to your GitHub repository.
2. Log in to [Vercel](https://vercel.com/) with your GitHub account.
3. Click **Add New** > **Project** and select this repository.
4. Leave all settings at their default values (Vercel automatically detects it as a static project).
5. Click **Deploy!** 🚀
