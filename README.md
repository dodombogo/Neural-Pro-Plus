# Neural Pro+ 🧠

A modern, AI-powered transcription app with a beautiful neural network theme. Convert audio and video to text with speaker detection, real-time statistics, and advanced formatting options.

![Neural Pro+ Banner](public/banner.png)

## ✨ Features

- 🎯 **Smart AI Transcription**: Automatically convert speech to text with high accuracy
- 👥 **Speaker Detection**: Automatically identify and label different speakers
- 📊 **Real-time Statistics**: View detailed analytics about your transcripts
- 🎨 **Neural Network Theme**: Beautiful, modern UI with interactive animations
- 📝 **Engaging Loading Experience**: 90+ witty AI-themed messages during processing
- 📝 **Rich Text Editor**: Format your transcripts with ease
- 🎵 **Audio Visualization**: See your audio waveforms in real-time
- 🎥 **Video Support**: Transcribe both audio and video files
- 💾 **Auto-save**: Never lose your work with automatic saving
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Processing**: Optimized for quick transcription and editing
- 🔄 **Real-time Updates**: See transcription progress with entertaining messages

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/neural-pro-plus.git
cd neural-pro-plus
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your AssemblyAI API key

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173/Neural-Pro-Plus/](http://localhost:5173/Neural-Pro-Plus/) in your browser

## 🎮 How to Use

1. **Starting a New Project**
   - Click "Let's Get Started" on the home page
   - Choose to upload a media file or start with an empty editor
   - Supported formats: MP3, WAV, M4A, OGG (audio), MP4, WEBM (video)

2. **Transcription**
   - Drop your media file in the upload zone
   - Watch entertaining AI-themed messages during processing
   - View real-time transcription progress with percentage indicators
   - Enjoy the animated neural network visualization

3. **Editing**
   - Use the rich text editor to modify your transcript
   - Format text using the toolbar options
   - Add timestamps with `Ctrl/Cmd + T`
   - Use `Ctrl/Cmd + F` for find and replace

4. **Statistics**
   - View word count, duration, and speaker statistics
   - Click "View Details" for advanced analytics
   - Export statistics in JSON format
   - Track transcription progress in real-time

5. **Playback Controls**
   - Use space bar to play/pause
   - Arrow keys for seeking
   - Adjust playback speed with keyboard shortcuts
   - Visual waveform navigation

6. **Exporting**
   - Choose from multiple export formats
   - Save transcripts and statistics
   - Download in various file formats
   - Auto-save feature for peace of mind

## 🌐 Deploying to GitHub Pages

1. **Update vite.config.ts**
```ts
export default defineConfig({
  base: '/Neural-Pro-Plus/',
  // ... other config
})
```

2. **Create GitHub Actions Workflow**
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install Dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@4.1.5
        with:
          branch: gh-pages
          folder: dist
```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages"
   - Select "gh-pages" branch as source
   - Save the settings

4. **Push Your Changes**
```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

Your app will be available at: `https://yourusername.github.io/Neural-Pro-Plus/`

## ⌨️ Keyboard Shortcuts

- `Space` - Play/Pause media
- `←/→` - Seek backward/forward 5 seconds
- `Shift + ←/→` - Seek backward/forward 1 second
- `Ctrl/Cmd + T` - Insert timestamp
- `Ctrl/Cmd + S` - Save transcript
- `Ctrl/Cmd + E` - Export transcript
- `Ctrl/Cmd + F` - Find and replace
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo

## 🛠️ Built With

- [React](https://reactjs.org/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [AssemblyAI](https://www.assemblyai.com/) - Transcription API
- [WaveSurfer.js](https://wavesurfer-js.org/) - Audio Visualization
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@neuralpro.plus or open an issue in the repository.

---

Made with ❤️ by Trust Inc.
#   N e u r a l - P r o - P l u s 
 
 