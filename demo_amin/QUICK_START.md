# Quick Start Guide - NodiWatch Prototype

## 🎯 What You Have

A complete Next.js web application that demonstrates the NodiWatch platform with:
- Interactive map showing pollution, encroachment, and erosion
- Real-time alerts system
- Factory attribution with AI probability scoring
- 10-year temporal analysis (2016 vs 2026)
- Pollution trend charts
- Professional dashboard design

## 🚀 Fastest Way to Deploy (3 Steps)

### Option 1: Using Netlify Drop (No Install Needed)

If you have disk space issues, use this method:

1. **Use GitHub Codespaces** (free for GitHub users):
   - Push your `nodiwatch-app` folder to GitHub
   - Open in GitHub Codespaces
   - Run in terminal:
     ```bash
     cd nodiwatch-app
     npm install
     npm run build
     ```
   - Download the `out` folder to your computer

2. **Deploy to Netlify**:
   - Go to https://app.netlify.com/drop
   - Drag and drop the `out` folder
   - Get instant live URL!

### Option 2: If You Have Disk Space

```bash
# 1. Navigate to project
cd e:\eco-tech\nodiwatch-app

# 2. Clear any issues
npm cache clean --force
rm -rf node_modules (if exists)

# 3. Install dependencies
npm install

# 4. Build the static site
npm run build

# 5. Deploy
# Drag the 'out' folder to https://app.netlify.com/drop
```

### Option 3: GitHub + Netlify Auto-Deploy (Recommended for Continuous Updates)

```bash
# 1. Initialize git in nodiwatch-app folder
cd e:\eco-tech\nodiwatch-app
git init
git add .
git commit -m "NodiWatch prototype for Eco-Tech Hackathon 2026"

# 2. Push to GitHub
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# 3. On Netlify (https://app.netlify.com):
# - Click "Add new site"
# - Import from GitHub
# - Select your repository
# - Set build command: npm run build
# - Set publish directory: out
# - Click Deploy!
```

## 📂 What's Inside

```
nodiwatch-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dashboard
│   ├── layout.tsx         # App layout
│   └── globals.css        # Styles
├── components/            # React components
│   ├── RiverMap.tsx      # Interactive map
│   ├── AlertsPanel.tsx   # Alerts sidebar
│   ├── FactoryAttribution.tsx  # AI attribution
│   ├── TimelineComparison.tsx  # 2016 vs 2026
│   └── ... (8 total components)
├── public/               # Static assets
├── package.json          # Dependencies
├── next.config.js        # Next.js config (static export)
├── netlify.toml          # Netlify deployment config
└── README.md             # Full documentation
```

## 🎨 Features You Can Demo

1. **Interactive Map**
   - Click the layer buttons to toggle views
   - Click map markers for details
   - Shows Buriganga River with pollution hotspots

2. **Alerts Panel** (Right side)
   - Real-time critical alerts
   - Encroachment warnings
   - Erosion notifications

3. **Factory Attribution** (Right side)
   - Bayesian probability scores
   - Spectral signature analysis
   - Distance-based ranking

4. **Timeline Comparison** (Middle)
   - Shows 10-year river changes
   - Area lost: 8.2 hectares
   - Pollution increase: +89%

5. **Charts** (Bottom)
   - 10-year pollution trends
   - Multiple pollutant types
   - Interactive tooltips

## 🌐 After Deployment

Your site will be live at: `https://YOUR-SITE-NAME.netlify.app`

You can:
- Share it with judges
- Include in your presentation
- Show it on mobile/tablet
- Embed in documentation

## 🔧 Customization

To change mock data:
1. Open any component file (e.g., `components/RiverMap.tsx`)
2. Edit the mock data arrays at the top
3. Save and rebuild

To change colors/styling:
1. Edit `tailwind.config.ts` for theme colors
2. Edit `app/globals.css` for global styles
3. Save and rebuild

## 📞 Troubleshooting

**Problem**: `npm install` fails with disk space error  
**Solution**: Use GitHub Codespaces or free up disk space

**Problem**: Map doesn't show  
**Solution**: Check internet connection (Leaflet loads from CDN)

**Problem**: Build fails  
**Solution**: Make sure all files are in the `nodiwatch-app` folder

**Problem**: 404 errors after deployment  
**Solution**: Verify `output: 'export'` is in `next.config.js`

## 🏆 For Your Presentation

Key talking points about the prototype:
1. "Built with Next.js for production-ready performance"
2. "Demonstrates all NodiWatch features: pollution, encroachment, erosion"
3. "AI-powered Bayesian attribution with 78% accuracy visualization"
4. "10-year historical analysis showing 8.2 hectares lost"
5. "Ready to deploy to cloud infrastructure (Netlify)"
6. "Responsive design works on all devices"

## 📊 Technical Stack to Mention

- **Frontend**: Next.js 14 (React 18, TypeScript)
- **Mapping**: Leaflet/React Leaflet
- **Charts**: Recharts (React-based)
- **Styling**: Tailwind CSS
- **Deployment**: Static export (JAMstack architecture)
- **Future Integration**: Google Earth Engine, PostGIS, TensorFlow

---

## ✅ Success Checklist

Before your presentation:
- [ ] Deploy the site to Netlify
- [ ] Test all interactive features
- [ ] Verify on mobile device
- [ ] Prepare live demo
- [ ] Take screenshots for backup
- [ ] Note the deployment URL
- [ ] Test internet connection for demo

---

**You're ready to showcase NodiWatch! 🌊🇧🇩**

For full details, see `README.md` and `PROJECT_SUMMARY.md`
