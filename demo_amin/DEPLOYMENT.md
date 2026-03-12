# NodiWatch Deployment Guide

## Quick Deployment to Netlify

### Method 1: Netlify CLI (Recommended)

1. Install dependencies and build:
```bash
cd nodiwatch-app
npm install
npm run build
```

2. Install Netlify CLI globally:
```bash
npm install -g netlify-cli
```

3. Deploy to Netlify:
```bash
netlify deploy --prod --dir=out
```

4. Follow the prompts to authenticate and create/select a site

### Method 2: GitHub + Netlify Auto-Deploy

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial NodiWatch prototype"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [Netlify](https://app.netlify.com)

3. Click "Add new site" → "Import an existing project"

4. Connect to GitHub and select your repository

5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Base directory**: `nodiwatch-app`

6. Click "Deploy site"

### Method 3: Manual Deploy (Drag & Drop)

1. Build the project locally:
```bash
cd nodiwatch-app
npm install
npm run build
```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag and drop the entire `out` folder from the nodiwatch-app directory

4. Your site will be live in seconds!

## Post-Deployment

After deployment, you'll get a URL like: `https://random-name-123456.netlify.app`

You can customize this by:
1. Going to Site settings
2. Changing the site name under "Site details"
3. Your site will be available at `https://your-custom-name.netlify.app`

## Environment Variables (if needed in future)

If you add API integrations later, you can set environment variables in:
- Netlify Dashboard → Site settings → Environment variables

## Custom Domain (Optional)

To use a custom domain:
1. Go to Domain settings in Netlify
2. Add your custom domain
3. Update DNS records as instructed

## Continuous Deployment

With GitHub integration, every push to your main branch will automatically trigger a new deployment!

## Troubleshooting

### Build fails on Netlify
- Make sure `package.json` and `next.config.js` are in the `nodiwatch-app` directory
- Set the correct base directory in Netlify settings

### 404 errors
- Ensure `output: 'export'` is set in `next.config.js`
- Check that the publish directory is set to `out`

### Map not showing
- Leaflet CSS is loaded from CDN in the layout - check your internet connection
- The map component uses dynamic imports to avoid SSR issues
