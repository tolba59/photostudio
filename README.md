# AI Product Photo Studio 📸✨

AI Product Photo Studio is an AI-powered web application that transforms basic product photos into professional, studio-quality images in seconds. It uses Google's latest Gemini Image Generation models to seamlessly blend your products into various environments, scenes, and lighting setups.

## 🌟 Overview

Whether you're an e-commerce seller, marketer, or designer, staging product photos traditionally requires expensive equipment, studios, and time. This application eliminates those barriers. By simply uploading a base image of your product, you can instantly generate high-quality lifestyle shots, clean studio mockups, or entirely custom scenes.

## ✨ Features

- **Base Image Upload:** Easily upload your standalone product photo via drag-and-drop or file selection.
- **Ready Mockups Mode:** Choose from a robust list of pre-configured, highly-optimized prompts across categories like "Standard & Clean", "Natural & Organic", "Creative Lighting", and "Food & Dining". 
- **Scene Swap Mode:** Have a specific background in mind? Upload a custom scene image, and the AI will realistically place your product into that scene, matching the lighting and shadows.
- **Interactive Before/After Slider:** Compare your original product photo with the AI-generated result using a smooth, interactive swipe slider.
- **History Tray:** Keep track of your recent generations during your session. Click to view them again or reuse them as the base image for further edits.
- **One-Click Download:** Save your generated, high-resolution product photos directly to your device.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **AI Integration:** `@google/genai` SDK
- **Model Used:** `gemini-2.5-flash-image`

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Copy the example environment file and add your API key:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your Gemini API Key:
   `GEMINI_API_KEY=your_api_key_here`

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## ⚙️ Maintenance & Customization

- **Adding New Mockup Prompts:** 
  You can easily add new pre-made environments for users to choose from. Open `src/App.tsx` (or `/App.tsx`) and locate the `mockups` dictionary. Add a new key-value pair where the key is the display name and the value is the detailed prompt string.
- **Updating the AI Model:**
  The app currently defaults to `gemini-2.5-flash-image` located in `services/geminiService.ts`. You can update the `model` variable there if future versions of the image generation model become available.
- **Styling:** 
  All components use Tailwind utility classes. For structural changes, refer to `App.tsx` and the individual components in `/components`.

## 🛡️ Privacy & Security Note
Your API key is securely scoped to the environment variables and is not exposed in the source code. Never commit your `.env.local` file to version control.
