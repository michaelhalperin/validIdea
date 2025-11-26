# Open Graph Image Creation Guide

I've created two files to help you generate the Open Graph image:

## Files Created

1. **`frontend/public/og-image.svg`** - SVG version (can be converted to PNG)
2. **`frontend/public/og-image-generator.html`** - HTML version for easy conversion

## How to Create the PNG

### Option 1: Using the HTML Generator (Easiest)

1. Open `frontend/public/og-image-generator.html` in your browser
2. The page will display the OG image design
3. Use one of these methods to convert to PNG:

   **Method A: Browser Screenshot**
   - Open browser DevTools (F12)
   - Use device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
   - Set custom size: 1200x630
   - Take screenshot

   **Method B: Online Tool**
   - Go to https://htmlcsstoimage.com/
   - Upload the HTML file
   - Set dimensions: 1200x630
   - Download as PNG

   **Method C: Command Line (if you have Node.js)**
   ```bash
   npm install -g puppeteer-cli
   puppeteer screenshot frontend/public/og-image-generator.html --width=1200 --height=630 --output=frontend/public/og-image.png
   ```

### Option 2: Using the SVG

1. Open `frontend/public/og-image.svg` in a vector graphics editor (Inkscape, Illustrator, etc.)
2. Export as PNG at 1200x630px
3. Save as `frontend/public/og-image.png`

### Option 3: Design Tool

Create a 1200x630px image with:
- **Background**: Dark gradient (#030303 to #0A0A0A)
- **Logo**: Your ValidIdea logo (left side)
- **Title**: "IdeaValidate" in white, large bold font
- **Subtitle**: "AI-Powered Startup Idea Analysis" with gradient (purple to pink)
- **Description**: "Validate your startup ideas with comprehensive market research, competitor analysis & MVP roadmaps"
- **Features**: 3 bullet points with colored dots
- **Colors**: #6366F1 (indigo), #8B5CF6 (purple), #EC4899 (pink)

## Quick Online Tools

- **htmlcsstoimage.com** - Convert HTML to PNG
- **cloudconvert.com** - Convert SVG to PNG
- **canva.com** - Design from scratch (template: 1200x630px)

## After Creating the PNG

1. Save the file as `frontend/public/og-image.png`
2. The meta tags in `index.html` already reference it
3. Deploy to Vercel
4. Test using: https://www.opengraph.xyz/

The image will automatically appear when your site is shared on:
- Facebook
- Twitter/X
- LinkedIn
- Slack
- Discord
- And other social platforms

