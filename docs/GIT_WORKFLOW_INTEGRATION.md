# 🔄 Git Workflow Integration Guide
## Handling GitHub Actions Auto-Commits

**Last Updated:** 2024

---

## 🚨 Common Issue: Divergent Branches

When GitHub Actions automatically commits generated files (like PNG diagrams), your local branch and remote branch can diverge, causing pull errors.

---

## ✅ Solution: Rebase Strategy (Recommended)

### Why Rebase?
- ✅ Keeps commit history clean and linear
- ✅ Puts your local changes on top of workflow commits
- ✅ Avoids unnecessary merge commits
- ✅ Makes history easier to read

### How to Resolve

#### Step 1: Fetch Latest Changes
```bash
git fetch origin
```

#### Step 2: Rebase Your Changes
```bash
git pull --rebase origin develop
```

#### Step 3: If Conflicts Occur
```bash
# Resolve conflicts in affected files
# Then continue rebase
git add .
git rebase --continue
```

#### Step 4: Push Your Changes
```bash
git push origin develop
```

---

## 🔄 Alternative: Merge Strategy

If you prefer merge commits:

### Step 1: Configure Merge Strategy
```bash
git config pull.rebase false
```

### Step 2: Pull with Merge
```bash
git pull origin develop
```

### Step 3: Resolve Conflicts (if any)
```bash
# Edit conflicted files
# Then commit
git add .
git commit -m "Merge remote-tracking branch 'origin/develop'"
```

### Step 4: Push
```bash
git push origin develop
```

---

## 📋 Best Practices

### 1. Always Pull Before Pushing
```bash
# Before making changes
git pull --rebase origin develop

# Make your changes
# Commit your changes
# Push your changes
git push origin develop
```

### 2. Use Rebase for Clean History
```bash
# Set rebase as default
git config pull.rebase true

# Or use --rebase flag
git pull --rebase origin develop
```

### 3. Handle Workflow Commits Gracefully
- ✅ Workflow commits are auto-generated
- ✅ They only modify generated files (PNGs, etc.)
- ✅ They shouldn't conflict with your code changes
- ✅ Rebase puts your changes on top

### 4. Avoid Conflicts
- ✅ Don't modify generated files manually
- ✅ Let the workflow handle diagram generation
- ✅ Only modify source files (.puml files)
- ✅ Pull before making changes

---

## 🐛 Troubleshooting

### Issue: Divergent Branches Error
**Error:**
```
fatal: Need to specify how to reconcile divergent branches.
```

**Solution:**
```bash
# Use rebase (recommended)
git pull --rebase origin develop

# Or use merge
git pull --no-rebase origin develop
```

### Issue: Merge Conflicts
**Error:**
```
Auto-merging .github/workflows/generate-diagrams.yml
CONFLICT (content): Merge conflict in .github/workflows/generate-diagrams.yml
```

**Solution:**
```bash
# 1. Check conflicted files
git status

# 2. Resolve conflicts manually
# Edit files to resolve conflicts

# 3. Stage resolved files
git add .

# 4. Continue rebase/merge
git rebase --continue
# OR
git commit -m "Resolve merge conflicts"
```

### Issue: Cannot Push After Rebase
**Error:**
```
! [rejected]        develop -> develop (non-fast-forward)
```

**Solution:**
```bash
# Force push (only if you're sure)
git push --force-with-lease origin develop

# Or pull first, then push
git pull --rebase origin develop
git push origin develop
```

---

## 🔍 Understanding the Situation

### What Happens
1. **You commit locally** → Workflow fix commit
2. **Workflow runs on GitHub** → Auto-commits generated PNGs
3. **You try to pull** → Branches have diverged
4. **Git needs direction** → Rebase or merge?

### Branch History
```
Your Local:          Remote (GitHub):
    A                   A
    |                   |
    B (your fix)        C (workflow commit)
    
After Rebase:
    A
    |
    C (workflow commit)
    |
    B' (your fix, rebased)
```

---

## 📚 Git Configuration

### Set Default Pull Strategy
```bash
# Rebase (recommended for clean history)
git config --global pull.rebase true

# Merge (creates merge commits)
git config --global pull.rebase false

# Fast-forward only (fails if branches diverged)
git config --global pull.ff only
```

### View Current Configuration
```bash
git config --get pull.rebase
```

---

## 🎯 Workflow Integration Tips

### 1. Workflow Commits Are Safe
- ✅ Workflow only commits generated files
- ✅ Won't conflict with your code changes
- ✅ Can be safely rebased on top

### 2. Regular Pulls
- ✅ Pull before starting work
- ✅ Pull before pushing
- ✅ Use rebase for clean history

### 3. Handle Auto-Commits
- ✅ Don't modify generated files manually
- ✅ Let workflow handle generation
- ✅ Rebase on top of workflow commits

### 4. Monitor Workflow
- ✅ Check Actions tab regularly
- ✅ Review workflow commits
- ✅ Verify generated files

---

## ✅ Quick Reference

### Daily Workflow
```bash
# 1. Pull latest changes
git pull --rebase origin develop

# 2. Make your changes
# Edit files, etc.

# 3. Commit your changes
git add .
git commit -m "your message"

# 4. Push your changes
git push origin develop
```

### When Workflow Runs
```bash
# 1. Workflow commits generated files
# (happens automatically on GitHub)

# 2. Pull workflow commits
git pull --rebase origin develop

# 3. Continue with your work
# Your changes are on top of workflow commits
```

### Handling Conflicts
```bash
# 1. Pull with rebase
git pull --rebase origin develop

# 2. If conflicts occur
# Resolve conflicts in files

# 3. Stage resolved files
git add .

# 4. Continue rebase
git rebase --continue

# 5. Push
git push origin develop
```

---

## 🔗 Related Documentation

- [CI/CD Testing Guide](./CI_CD_TESTING_GUIDE.md)
- [GitHub Actions Permissions](./GITHUB_ACTIONS_PERMISSIONS.md)
- [Repository Settings Setup](../REPOSITORY_SETTINGS_SETUP.md)

---

## 🎉 Best Practices Summary

1. **Always pull before pushing**
2. **Use rebase for clean history**
3. **Don't modify generated files**
4. **Let workflow handle auto-commits**
5. **Resolve conflicts promptly**
6. **Monitor workflow runs**

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** DevOps Team
- **Last Updated:** 2024
- **Status:** Active

