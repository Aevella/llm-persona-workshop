# Rollback Guide

## Fast rollback from Vercel dashboard
1. Open Vercel project: `persona-builder-web`
2. Go to **Deployments**
3. Select a previous healthy deployment
4. Click **Promote to Production** (or Re-deploy)

## Local rollback (code-level)
If you use git:
1. `git log --oneline`
2. `git checkout <stable-commit>` (or create hotfix branch)
3. `vercel --prod`

## Release checklist (before each deploy)
- [ ] Engine selection updates fields correctly
- [ ] Style fragments can add/remove correctly
- [ ] Generate works for Full / Compact / JSON
- [ ] Copy buttons work
- [ ] Mobile viewport readable
