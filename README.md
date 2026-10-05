# 🌸 Visual Japanese JLPT N5 Master

A comprehensive, beautifully illustrated Japanese vocabulary learning web application designed for JLPT N5 students. Features 824+ illustrated words, native Tokyo pitch-accent audio, spaced repetition (SRS), interactive multiple-choice quizzes, fill-in-the-blank practice, and detailed mnemonics.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (comes with Node.js)

### Installation
1. Extract the downloaded ZIP file to a folder on your computer.
2. Open your terminal (Command Prompt, PowerShell, or macOS Terminal) and navigate to the project directory:
   ```bash
   cd visual-japanese-n5
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally (Development Mode)
Start the local development server:
```bash
npm run dev
```
Open your browser and visit: **`http://localhost:3000`**

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```
This generates a static `dist/` directory ready for deployment.

To run the full-stack Express server in production:
```bash
npm start
```

---

## 🌐 Deploying to the Web & Getting a Custom Domain

You can deploy this website for free in under 5 minutes using modern hosting platforms:

### Option 1: Vercel (Recommended — Easiest & Free)
1. Create a free account at [Vercel.com](https://vercel.com).
2. Install the Vercel CLI or connect your GitHub repository:
   - **Via GitHub:** Push this code to a new GitHub repository, log into Vercel, and click **"Add New Project"** > select your repo.
   - **Via CLI:**
     ```bash
     npm install -g vercel
     vercel
     ```
3. Set Build Command: `npm run build` and Output Directory: `dist`.
4. Deploy! Your app will get a live URL like `your-app.vercel.app`.
5. **Add Your Custom Domain:**
   - Go to your Project on Vercel > **Settings** > **Domains**.
   - Enter your domain name (e.g., `learnjapanese.com`).
   - Add the DNS records (CNAME or A record) provided by Vercel to your domain registrar (Namecheap, GoDaddy, Google Cloud Domains, Cloudflare, etc.).

### Option 2: Netlify
1. Create a free account at [Netlify.com](https://netlify.com).
2. Drag and drop the `dist` folder into the Netlify dashboard, or connect via GitHub.
3. In **Domain Management**, click **"Add custom domain"** and follow the DNS instructions.

### Option 3: Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages**.
2. Connect your Git repository, set build command to `npm run build` and output directory to `dist`.
3. Link your domain with 1-click automatic SSL and zero-cost hosting.

---

## 🛠 Tech Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Audio:** Native Web Speech Synthesis with Tokyo Pitch Accent & Fallbacks
- **State & Storage:** LocalStorage with automatic backup, SRS Leitner box calculations
- **Build Tool:** Vite
