# GitHub Pages Deployment Guide

This guide explains how to deploy VocabMaster AI to GitHub Pages.

## 🚀 Automatic Deployment (Recommended)

### Setup Steps

1. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **GitHub Actions**

2. **Add API Key Secret**
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Click **Add secret**

3. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Deploy VocabMaster AI"
   git push origin main
   ```

4. **Monitor Deployment**
   - Go to **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Once complete, your site will be live at: `https://boonsup.github.io/`

### GitHub Actions Workflow

The [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) file handles:
- ✅ Automatic builds on push to `main`
- ✅ Node.js 18 setup
- ✅ Dependency installation
- ✅ Vite build with environment variables
- ✅ Artifact upload and deployment
- ✅ Deployment to GitHub Pages

### Workflow Triggers

The deployment runs automatically when:
- You push commits to the `main` branch
- You manually trigger it from the Actions tab

## 📦 Manual Deployment

If you prefer manual deployment:

### 1. Install gh-pages Package
```bash
npm install --save-dev gh-pages
```

### 2. Add Deploy Script to package.json
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3. Deploy
```bash
npm run deploy
```

This will:
1. Build the project (`npm run build`)
2. Push the `dist/` folder to `gh-pages` branch
3. GitHub Pages will serve from that branch

## 🔐 Environment Variables

### For GitHub Actions (Recommended)
API keys are stored as **Repository Secrets**:
- Never committed to the repository
- Securely injected during build
- Accessible only to workflows

### For Local Development
API keys are in `.env` file:
- Automatically loaded by Vite
- Gitignored (not committed)
- Used during `npm run dev`

### Security Note
⚠️ The built files will contain the API key in the JavaScript bundle. For production:
- Consider a backend proxy to hide the API key
- Implement rate limiting
- Use Firebase/Netlify Functions for API calls
- Add API key restrictions in Google Cloud Console

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. **Add CNAME file**
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. **Configure DNS**
   - Add DNS records pointing to GitHub Pages
   - A record: `185.199.108.153`
   - Or CNAME record: `boonsup.github.io`

3. **Enable in Settings**
   - Go to **Settings** → **Pages**
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## ✅ Deployment Checklist

Before deploying:
- [ ] All dependencies installed (`npm install`)
- [ ] Local build succeeds (`npm run build`)
- [ ] API key added to GitHub Secrets
- [ ] GitHub Pages enabled in repository settings
- [ ] GitHub Actions workflow file present
- [ ] Main branch is up to date
- [ ] `.gitignore` includes `.env` file

After deploying:
- [ ] Check Actions tab for successful workflow
- [ ] Visit `https://boonsup.github.io/` to verify
- [ ] Test all features (flashcards, AI, navigation)
- [ ] Verify styles load correctly
- [ ] Check browser console for errors

## 🐛 Troubleshooting

### Deployment Fails
**Check:**
- Actions tab for error messages
- Repository secrets are set correctly
- Workflow file syntax is valid
- Node version compatibility (18+)

### Site Not Loading
**Check:**
- GitHub Pages is enabled in Settings
- Source is set to "GitHub Actions"
- Wait 1-2 minutes for DNS propagation
- Clear browser cache

### Assets Not Loading (404 errors)
**Check:**
- [`vite.config.js`](vite.config.js) has correct `base` path
- Base path is `/` for user/org pages
- Base path is `/repo-name/` for project pages

### API Features Not Working
**Check:**
- `VITE_GEMINI_API_KEY` secret is set in repository
- Secret name matches exactly (case-sensitive)
- API key is valid and active
- API quotas not exceeded

### Styles Not Applied
**Check:**
- Build completed successfully
- Tailwind CSS processed correctly
- Browser cache cleared
- No errors in browser console

## 📊 Build Information

### Build Output
Location: `dist/` folder
- `index.html` - Entry point
- `assets/` - JavaScript, CSS, and other assets
- Optimized and minified for production

### Build Size
Approximate sizes:
- JavaScript: ~150-200 KB (gzipped)
- CSS: ~50-100 KB (gzipped)
- Total: ~200-300 KB

### Build Time
- Dependencies: ~1-2 minutes
- Build process: ~30-60 seconds
- Upload & deploy: ~30 seconds
- **Total:** ~2-3 minutes per deployment

## 🔄 Continuous Deployment

Every push to `main` triggers:
1. **Checkout** - Clone repository
2. **Setup** - Install Node.js 18
3. **Install** - Run `npm ci`
4. **Build** - Run `npm run build`
5. **Upload** - Create deployment artifact
6. **Deploy** - Publish to GitHub Pages

## 📝 Deployment History

View deployment history:
- **Actions** tab - All workflow runs
- **Deployments** - From repository main page
- **Commits** - Linked to deployments

## 🎯 Production URL

After deployment, your site will be available at:

**Primary URL:** https://boonsup.github.io/

**Alternative URLs:**
- https://boonsup.github.io (HTTPS enforced)
- Any custom domain you configure

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Tailwind CSS Production Build](https://tailwindcss.com/docs/optimizing-for-production)

## 💡 Tips

### Faster Deployments
- Use `npm ci` instead of `npm install` (faster, consistent)
- Enable npm cache in GitHub Actions
- Minimize dependencies

### Better Security
- Store API keys in GitHub Secrets
- Never commit `.env` files
- Use API key restrictions in Google Cloud
- Implement rate limiting

### Monitoring
- Watch Actions tab for failures
- Set up email notifications for failed deployments
- Monitor API usage in Google Cloud Console

---

**Ready to deploy?** Follow the Automatic Deployment steps above! 🚀
