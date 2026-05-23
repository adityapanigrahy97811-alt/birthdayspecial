# 💖 Happy Birthday Bestie - Birthday Surprise Web App

A gorgeous, interactive, and emotional birthday surprise web application designed to celebrate a best friend. It features smooth scrolling, cinematic typing animations, floating particles, interactive cards, and a music player.

## ✨ Features
- **Gateway Intro**: A romantic/heartfelt greeting card gateway to enter the safe space.
- **Cinematic Typing Animations**: Heartfelt letters typing out word-by-word with beautiful transitions.
- **Floating Particles**: Real-time canvas-rendered hearts, sparkles, and petals following the user's cursor.
- **Interactive Polaroid Scrapbook**: A grid of memories taped like real polaroids with delightful hover tilt effects.
- **Emotional Message Cards**: Glassmorphic letters from the heart that reveal warm wishes.
- **Interactive Smile Button**: An interactive trigger that fires canvas confetti and reveals a hidden sweet note.
- **Floating Vinyl Music Player**: A revolving vinyl disc music player to toggle background music.

## 🛠️ Requirements & Tech Stack
- **HTML5 & CSS3** (Vanilla CSS for premium glassmorphism styling)
- **JavaScript (ES6+)**
- **Libraries (Loaded via CDN)**:
  - [GSAP (GreenSock)](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/) for advanced scroll-linked animations.
  - [Canvas Confetti](https://github.com/catdad/canvas-confetti) for celebratory confetti blasts.

## 🚀 How to Run Locally
1. **Clone the repository**:
   ```bash
   git clone https://github.com/adityapanigrahy97811-alt/birthday.git
   cd birthday
   ```
2. **Open index.html**:
   - Double-click `index.html` to open it in your browser.
   - Alternatively, serve it locally using a development server for the best experience (especially if adding local audio or handling permissions):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     ```
3. Open `http://localhost:8000` (or the port specified) in your browser.

## 📂 Project Structure
- `index.html` - Structure of the interactive sections.
- `styles.css` - Glassmorphism, animations, layouts, and responsive designs.
- `script.js` - GSAP animations, particle canvas, confetti effects, and player logic.
- `assets/` - Image assets for the polaroid scrapbook.
- `requirements.txt` - Project dependencies and setup specifications.

---
Made with 💖.
