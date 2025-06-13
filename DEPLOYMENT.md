# 🚀 Deployment Guide

## Vercel Deployment (Recommended)

### 1. Prerequisites
- GitHub account
- Vercel account
- Supabase account

### 2. GitHub Setup
1. Push project to GitHub repository
2. Make repository public or ensure Vercel has access

### 3. Supabase Setup
1. Create new Supabase project
2. Run all SQL scripts in `/scripts` folder in order:
   - `00-create-all-tables.sql`
   - `01-disable-rls-and-create-tables.sql`
   - `02-insert-initial-data.sql`
   - `05-add-admin-desa-tables.sql`
   - `06-update-archive-tables.sql`
3. Get your project URL and anon key from Settings > API

### 4. Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`
5. Deploy!

### 5. Post-Deployment
1. Test login with default credentials
2. Verify all features work
3. Update any hardcoded URLs if needed

## Alternative Deployment Options

### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Self-Hosted
1. Clone repository
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Start: `npm start`

## Environment Variables

Required environment variables:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

## Database Migration

If you need to migrate existing data:

1. Export data from old system
2. Format according to our schema
3. Use CSV import feature for bulk data
4. Verify data integrity

## Troubleshooting

### Common Issues

**Build Errors:**
- Check TypeScript errors
- Verify all imports are correct
- Ensure environment variables are set

**Database Connection:**
- Verify Supabase URL and key
- Check network connectivity
- Ensure RLS is properly configured

**Authentication Issues:**
- Clear browser localStorage
- Check user table data
- Verify role assignments

## Performance Optimization

### For Production:
1. Enable Vercel Analytics
2. Configure caching headers
3. Optimize images
4. Enable compression

### Database Optimization:
1. Add proper indexes
2. Configure connection pooling
3. Monitor query performance
4. Set up backups

## Security Checklist

- [ ] Environment variables secured
- [ ] Database RLS configured
- [ ] Input validation implemented
- [ ] HTTPS enabled
- [ ] Regular backups scheduled
- [ ] Access logs monitored

## Monitoring

### Recommended Tools:
- Vercel Analytics
- Supabase Dashboard
- Error tracking (Sentry)
- Uptime monitoring

## Support

For deployment issues:
1. Check logs in Vercel dashboard
2. Review Supabase logs
3. Create GitHub issue
4. Contact support team
\`\`\`

Buat file konfigurasi TypeScript yang optimal:
