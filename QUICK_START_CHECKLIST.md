# Quick Start Checklist - Wellness Score App

## ✅ PRE-DEPLOYMENT CHECKLIST

### **1. Download & Setup (5 minutes)**
- [ ] Click three dots (•••) in top right of v0
- [ ] Select "Download ZIP"
- [ ] Extract ZIP to your computer
- [ ] Open terminal/command prompt in the project folder
- [ ] Run: `pnpm install` (or `npm install`)

### **2. Environment Variables (2 minutes)**
- [ ] Create file: `.env.local` in project root
- [ ] Add these variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
- [ ] Get values from: Supabase → Project Settings → API

### **3. Test Locally (3 minutes)**
- [ ] Run: `pnpm dev`
- [ ] Open: http://localhost:3000
- [ ] Should see home page with "New Assessment" button
- [ ] Try signup → create account
- [ ] Try login → access dashboard

### **4. Verify All Features Work**
- [ ] **Student Flow**: Signup → Assessment → Results → PDF Export
- [ ] **Teacher Flow**: Login as teacher → See class management
- [ ] **Admin Flow**: Login as admin → See admin dashboard
- [ ] **Parent Flow**: Parent signup → View child scores
- [ ] **Notifications**: Check notification panel
- [ ] **Analytics**: View analytics page

### **5. Deploy to Vercel (5 minutes)**

#### **Option A: Git + Vercel (Recommended)**
- [ ] Create GitHub account (if you don't have one)
- [ ] Create new repo on GitHub
- [ ] Push project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wellness-app.git
git push -u origin main
```
- [ ] Go to Vercel.com → Login
- [ ] Click "Add New" → "Project"
- [ ] Select GitHub repo
- [ ] Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes for deploy to complete
- [ ] Access your live URL

#### **Option B: Direct Vercel Deploy**
- [ ] Go to Vercel.com → Login
- [ ] Drag and drop the project folder
- [ ] Add environment variables
- [ ] Click "Deploy"

### **6. Post-Deployment Verification**
- [ ] Test live URL (from Vercel dashboard)
- [ ] Try signup/login on live site
- [ ] Complete an assessment
- [ ] Check PDF export works
- [ ] Verify database is saving data (check Supabase)
- [ ] Check email notifications (if Resend API connected)

---

## ⚠️ COMMON ISSUES & FIXES

### **Issue: "NEXT_PUBLIC_SUPABASE_URL is missing"**
- **Fix**: Add `.env.local` file with Supabase credentials
- Make sure you're in project root directory
- Restart dev server after adding .env.local

### **Issue: Database tables not found**
- **Fix**: Tables already exist in Supabase (created during Phase 1-5)
- Go to Supabase → SQL Editor → Run a test query
- Verify connection string is correct

### **Issue: Login page shows but can't sign up**
- **Fix**: Check Supabase Auth is enabled
- Supabase → Auth → Providers → Email enabled?
- Check if organization exists in database

### **Issue: Vercel deploy fails**
- **Fix**: Check all env vars are added in Vercel settings
- Check Node version (must be 18+)
- Run `pnpm build` locally to test build

### **Issue: Emails not sending**
- **Fix**: This is Phase 4 feature - requires Resend API key
- Not blocking - app works without emails
- Add `RESEND_API_KEY` to deploy later

---

## 📋 CREDENTIALS FOR TESTING

### **Test Student Account**
- Email: `student@example.com`
- Password: `TestPass123`
- Role: Student
- Class Level: 9-10

### **Test Teacher Account**
- Email: `teacher@example.com`
- Password: `TestPass123`
- Role: Teacher

### **Test Admin Account**
- Email: `admin@example.com`
- Password: `TestPass123`
- Role: Admin

**Note**: You can create these by signing up manually, or insert directly into Supabase if needed.

---

## 🎯 FIRST TIME SETUP ORDER

1. **Download ZIP** ← Start here
2. **Setup .env.local** ← Critical step
3. **Test locally** ← Verify everything works
4. **Deploy to Vercel** ← Go live
5. **Test live site** ← Final check

**Total time**: ~20 minutes

---

## 📞 QUICK REFERENCE URLS

| Service | URL |
|---------|-----|
| Local Dev | http://localhost:3000 |
| Supabase Dashboard | https://supabase.com |
| Vercel Dashboard | https://vercel.com |
| Deployed App | `your-project.vercel.app` |

---

## 🚀 YOU'RE READY!

Everything is built and tested. Just follow the checklist above and you'll have a live, production-ready wellness app in 20 minutes!

**Questions?** Check the documentation files:
- `DEPLOYMENT_GUIDE.md` - Detailed deployment steps
- `FULL_PROJECT_SUMMARY.md` - Complete feature list
- `README_FINAL.md` - Architecture overview
