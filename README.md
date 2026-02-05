# Our Love Archive 💕

A romantic Valentine's Day website with love letters, AI-powered nerdy romantic line generator, and a Lana Del Rey music corner.

## Features

- 💌 **Love Letters**: Write and save love letters with photo attachments
- 🤓 **Nerdy Line Generator**: AI-powered CS-themed romantic lines
- 🎵 **Lana Del Rey Corner**: Curated playlist of songs
- 🎨 **Beige Aesthetic**: Warm, romantic color scheme
- ✨ **Animated Doodles**: Cat, tiger, scooter, shawarma, guitar floating in background
- 💾 **Local Storage**: All letters and saved lines persist in browser

## How to Deploy to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name it something like `love-archive` or `valentine-2025`
4. Make it **Public** (required for GitHub Pages)
5. Click "Create repository"

### Step 2: Upload Files

1. On your repository page, click "uploading an existing file"
2. Drag and drop these three files:
   - `index.html`
   - `styles.css`
   - `script.js`
3. Scroll down and click "Commit changes"

### Step 3: Enable GitHub Pages

1. In your repository, click "Settings" (top menu)
2. In the left sidebar, click "Pages"
3. Under "Source", select "Deploy from a branch"
4. Under "Branch", select "main" and folder "/ (root)"
5. Click "Save"
6. Wait 2-3 minutes for deployment

### Step 4: Get Your Website Link

After deployment, you'll see a link like:
```
https://your-username.github.io/repository-name/
```

This is your website URL! 🎉

## How to Create a QR Code

### Option 1: Online QR Generators (Easiest)
1. Go to any free QR code generator:
   - [QR Code Generator](https://www.qr-code-generator.com/)
   - [QR Code Monkey](https://www.qrcode-monkey.com/)
   - [Free QR Code](https://www.the-qrcode-generator.com/)

2. Paste your GitHub Pages URL
3. Customize colors (use beige tones to match the theme!)
4. Download the QR code as PNG or SVG
5. Print it on nice paper or cardstock

### Option 2: Using Google Chrome
1. Open your deployed website
2. Right-click anywhere on the page
3. Select "Create QR Code for this page"
4. Download and print

## Presenting the Gift

Ideas for giving the QR code:
- Print it on a nice beige/cream cardstock
- Add some hand-drawn doodles around it (cat, tiger, scooter, etc.)
- Put it in an envelope with "Scan Me 💕" written in cursive
- Write a short note: "I built you something special. Scan to enter our world."

## Customization Tips

### Change the Example Letter
In `script.js`, find the "example letter" section (near the end) and edit:
- Title
- Content
- Date

### Add More Lana Songs
In `index.html`, find the "playlist" section and add more song cards following the same format.

### Change Background Music
Replace the audio source in `index.html`:
```html
<audio id="bg-music" loop>
    <source src="YOUR_LANA_SONG_URL.mp3" type="audio/mpeg">
</audio>
```

Note: You'll need to find a direct MP3 link. The current placeholder is just ambient music.

### Customize Doodles
In the HTML, you can change the emoji doodles to anything you like:
- Find the `doodles-container` section
- Replace emojis with your favorites

## AI Line Generator Note

The AI line generator attempts to use Claude's API. However, since API keys aren't included for security, it falls back to a curated list of pre-written nerdy romantic lines. These fallback lines are still very cute and CS-themed!

If you want true AI generation:
1. Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
2. You'll need to set up a backend service to handle API calls securely
3. Or just enjoy the 15+ pre-written fallback lines provided!

## Tech Stack

- Pure HTML, CSS, JavaScript (no frameworks!)
- LocalStorage for data persistence
- Responsive design for mobile and desktop
- Custom beige color palette
- Google Fonts: Caveat (handwriting) and Crimson Text (serif)

## Browser Compatibility

Works best on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Privacy Note

All data is stored locally in the browser. Nothing is sent to any server (except the optional AI generation, which only sends the topic name to Claude's API). Your love letters and photos stay private in browser storage.

## Future Ideas to Add Together

- Travel map with pins for places you've been
- Date night idea generator
- Shared bucket list
- Memory timeline
- Photo gallery with captions
- Countdown to special dates

---

Made with 💕 for Valentine's Day 2025

Happy coding, and happy loving! 🎉
