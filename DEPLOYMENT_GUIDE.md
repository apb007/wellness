# Deployment Guide - Wellness Score Platform

## Pre-Deployment Checklist

### Environment Setup
- [ ] Supabase project created
- [ ] Database schema migrated
- [ ] All environment variables configured
- [ ] Email service API key added (Resend/SendGrid)
- [ ] SSL certificate configured

### Environment Variables (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Application
NEXT_PUBLIC_APP_URL=https://wellness-score.com
NODE_ENV=production
```

## Deployment Steps

### 1. Deploy to Vercel

```bash
# Option A: Using Vercel CLI
vercel deploy

# Option B: Connect GitHub repository
# 1. Push code to GitHub
# 2. Go to vercel.com
# 3. Import GitHub repo
# 4. Add environment variables
# 5. Deploy
```

### 2. Vercel Configuration

Create `vercel.json`:
```json
{
  "buildCommand": "next build",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "RESEND_API_KEY": "@resend_api_key"
  }
}
```

### 3. Database Migration

```bash
# Run all migrations on Supabase
# Use Supabase dashboard → SQL Editor → Run migration files
```

### 4. Post-Deployment

- [ ] Test authentication (signup/login)
- [ ] Test email notifications
- [ ] Verify assessments work
- [ ] Check analytics dashboard
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Test accessibility with screen reader

---

## Scaling Considerations

### Current Limits (Supabase Free Tier)
- Up to 500MB database storage
- Up to 2GB file storage
- Real-time: 200 concurrent connections
- Suitable for: 1,000-10,000 concurrent users

### When to Upgrade

- **500M+ database size**: Upgrade to Supabase Pro
- **100K+ monthly users**: Consider load balancing
- **High email volume**: Use dedicated email service
- **Storage**: Migrate to object storage (AWS S3, etc.)

---

## Performance Optimization

### Caching Strategy
- Browser cache: 1 hour for static assets
- API cache: 5 minutes for dashboard data
- Database queries: Indexed for fast lookup

### Database Indexes
All created automatically:
- `idx_users_email_organization`
- `idx_classes_organization_id`
- `idx_notifications_recipient_id`
- etc.

### Image Optimization
- Use Vercel Image Optimization
- Compress all images before upload
- Lazy load images below fold

---

## Monitoring & Maintenance

### Monitoring Tools
- Vercel Analytics: Track page performance
- Supabase Dashboard: Monitor database health
- Error tracking: Set up Sentry/LogRocket
- Email logs: Monitor Resend API dashboard

### Regular Maintenance
- [ ] Weekly: Check error logs
- [ ] Monthly: Review performance metrics
- [ ] Quarterly: Security audit
- [ ] Annually: Disaster recovery test

---

## Security Checklist

- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Rate limiting on APIs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (React escapes by default)
- [ ] CSRF tokens on forms
- [ ] Password hashing (bcrypt via Supabase)
- [ ] Row-level security (RLS) on tables
- [ ] Regular security updates

---

## Rollback Procedure

```bash
# If deployment fails:
# 1. Vercel automatically keeps previous version
# 2. Click "Rollback" in Vercel dashboard
# 3. Or redeploy previous git commit:
vercel deploy --prod --with=previous
```

---

## Cost Estimation (Monthly)

| Service | Free Tier | Pro Tier |
|---------|-----------|----------|
| Vercel | Free (up to 100GB) | $20/mo |
| Supabase | Free (500MB) | $25/mo |
| Resend | Free (100 emails) | $20/mo (based on usage) |
| **Total** | **Free** | **~$65/mo** |

---

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Resend Docs: https://resend.com/docs
- Next.js Docs: https://nextjs.org/docs
