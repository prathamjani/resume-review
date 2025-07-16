# Deployment Guide - Resume PII Checker

## 🚀 Deploy to Vercel (Recommended - FREE)

### Step 1: Push to GitHub
```bash
# If you don't have a GitHub repo yet, create one at github.com
# Then add it as remote and push:
git remote add origin https://github.com/yourusername/resume-pii-checker.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)** and sign up with GitHub
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Click "Deploy"** (it will deploy, but API won't work yet)
5. **Add Environment Variable:**
   - Go to project **Settings** → **Environment Variables**
   - Name: `REACT_APP_GEMINI_API_KEY`
   - Value: Your actual Gemini API key
   - Select all environments (Production, Preview, Development)
   - Click **Save**
6. **Redeploy:** Go to Deployments → click three dots → "Redeploy"

That's it! Your app will be live in ~2 minutes.

---

## 🌐 Alternative: Deploy to Netlify (FREE)

### Option A: Git Integration
1. **Go to [netlify.com](https://netlify.com)** and sign up
2. **Click "New site from Git"**
3. **Connect your GitHub repository**
4. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
5. **Environment Variables:**
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_GEMINI_API_KEY` = Your API key
6. **Deploy**

### Option B: Manual Deploy
1. **Build the project locally:**
   ```bash
   npm run build
   ```
2. **Go to [netlify.com](https://netlify.com)**
3. **Drag and drop the `build` folder** to Netlify
4. **Set environment variables** in site settings

---

## 📋 Pre-Deployment Checklist

- ✅ Gemini API key is ready
- ✅ Git repository is committed
- ✅ Application builds successfully (`npm run build`)
- ✅ Environment variables are configured
- ✅ .env.local is in .gitignore (never commit API keys!)

---

## 🔒 Security Notes

1. **Never commit your API key** to the repository
2. **Use environment variables** for sensitive data
3. **API key should be stored** in the hosting platform's environment variables
4. **The .env.local file** should only be used for local development

---

## 🛠️ Environment Variables Setup

### For Development (.env.local)
```env
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

### For Production (Hosting Platform)
- **Variable Name:** `REACT_APP_GEMINI_API_KEY`
- **Value:** Your actual Gemini API key

---

## 📱 Post-Deployment

After deployment, your app will be available at:
- **Vercel:** `https://your-app-name.vercel.app`
- **Netlify:** `https://your-app-name.netlify.app`

### Test the deployment:
1. Upload a test resume
2. Verify PII detection works
3. Check error handling
4. Test on mobile devices

---

## 🔄 Updating the App

To update your deployed app:
1. Make changes locally
2. Commit and push to GitHub
3. The hosting platform will automatically redeploy

```bash
git add .
git commit -m "Update description"
git push
```

---

## 💡 Tips

- **Custom Domain:** Both Vercel and Netlify support free custom domains
- **Analytics:** Add Google Analytics if needed
- **Performance:** The app is already optimized for production
- **Monitoring:** Check hosting platform analytics for usage stats

---

## 🆘 Troubleshooting

### Common Issues:

**Build Fails:**
- Run `npm run build` locally to check for errors
- Ensure all dependencies are in package.json

**API Key Not Working:**
- Verify the environment variable name is exactly `REACT_APP_GEMINI_API_KEY`
- Check that the API key is valid in Google AI Studio
- Restart/redeploy after adding environment variables

**App Loads but API Fails:**
- Check browser console for error messages
- Verify environment variables are set in hosting platform
- Test API key locally first

---

## 🎉 You're Done!

Your Resume PII Checker is now live and accessible to anyone with the URL!