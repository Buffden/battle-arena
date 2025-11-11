# ⚙️ Repository Settings Setup
## Required GitHub Repository Configuration

**Last Updated:** 2024

---

## 🚨 IMPORTANT: Repository Settings Must Be Configured

For the GitHub Actions workflow to successfully commit generated diagrams, you **MUST** configure repository settings.

---

## ✅ Step-by-Step Setup

### Step 1: Navigate to Repository Settings
1. Go to your GitHub repository: `https://github.com/Buffden/battle-arena`
2. Click on **Settings** tab (top right)
3. Scroll down to **Actions** in the left sidebar
4. Click on **General**

### Step 2: Configure Workflow Permissions
1. Scroll down to **Workflow permissions** section
2. Select: **✅ Read and write permissions**
3. (Optional) Check: **✅ Allow GitHub Actions to create and approve pull requests**
4. Click **Save** button

### Step 3: Verify Settings
- ✅ Workflow permissions: **Read and write permissions**
- ✅ Actions can create/approve PRs: **Enabled** (optional)

---

## 📋 Visual Guide

### Workflow Permissions Section
```
┌─────────────────────────────────────────┐
│ Workflow permissions                    │
│                                         │
│ ○ Read repository contents and packages │
│   permissions                           │
│                                         │
│ ● Read and write permissions  ← SELECT  │
│                                         │
│ ☑ Allow GitHub Actions to create and   │
│   approve pull requests                 │
│                                         │
│ [Save] button                           │
└─────────────────────────────────────────┘
```

---

## 🔍 Why This Is Required

### Default Behavior
By default, GitHub Actions workflows have **read-only** permissions for security reasons.

### Our Use Case
Our workflow needs to:
- ✅ Read repository (to checkout code)
- ✅ Write to repository (to commit generated PNGs)
- ✅ Push commits (to update diagrams)

### Security Consideration
- ✅ Workflow only commits to `docs/diagrams/exported/` directory
- ✅ Commits are automatically created (no manual approval needed)
- ✅ Commit messages are standardized: `docs: auto-update UML diagrams [skip ci]`
- ✅ Workflow only runs on `main` and `develop` branches

---

## 🧪 Testing After Configuration

### Test 1: Manual Workflow Trigger
1. Go to **Actions** tab
2. Select **"Generate UML Diagrams"** workflow
3. Click **"Run workflow"**
4. Select branch: `develop`
5. Click **"Run workflow"**
6. Wait for workflow to complete
7. Verify PNGs are committed

### Test 2: Push Trigger
1. Make a small change to a `.puml` file
2. Commit and push:
   ```bash
   git add docs/diagrams/architecture/system-architecture.puml
   git commit -m "test: update diagram to trigger workflow"
   git push origin develop
   ```
3. Check **Actions** tab
4. Verify workflow runs and commits PNGs

### Test 3: Verify Committed Files
1. Check repository for new commit
2. Verify commit message: `docs: auto-update UML diagrams [skip ci]`
3. Check `docs/diagrams/exported/architecture/` for PNG files
4. Verify PNG files are present and valid

---

## 🔧 Alternative: Personal Access Token (PAT)

If repository settings don't work, you can use a Personal Access Token:

### Step 1: Create PAT
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Give it a name: `Battle Arena Diagrams Bot`
4. Select scope: **`repo`** (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

### Step 2: Add to Repository Secrets
1. Go to repository → **Settings** → **Secrets** → **Actions**
2. Click **"New repository secret"**
3. Name: `PAT_TOKEN`
4. Value: Paste your PAT
5. Click **"Add secret"**

### Step 3: Update Workflow
Update `.github/workflows/generate-diagrams.yml`:
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    token: ${{ secrets.PAT_TOKEN }}
    persist-credentials: true
```

---

## ✅ Verification Checklist

- [ ] Repository settings allow "Read and write permissions"
- [ ] Workflow file includes `permissions:` section
- [ ] Checkout step has `persist-credentials: true`
- [ ] Push command uses proper authentication
- [ ] Workflow runs successfully
- [ ] PNGs are committed to repository
- [ ] No permission errors in workflow logs

---

## 🐛 Troubleshooting

### Still Getting Permission Errors?

#### Check 1: Repository Settings
- ✅ Go to Settings → Actions → General
- ✅ Verify "Read and write permissions" is selected
- ✅ Click "Save" if changed

#### Check 2: Workflow File
- ✅ Verify `permissions:` section exists
- ✅ Check `contents: write` permission is set
- ✅ Verify `persist-credentials: true` in checkout

#### Check 3: Branch Protection
- ✅ If using branch protection, ensure workflows can push
- ✅ Check if "Restrict who can push" allows workflows
- ✅ Verify "Require status checks" doesn't block workflows

#### Check 4: Organization Settings
- ✅ If repository is in an organization, check org settings
- ✅ Verify organization allows workflow permissions
- ✅ Check if organization has restrictions on workflows

---

## 📚 Additional Resources

### GitHub Documentation
- [Workflow Permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- [Authentication in Workflows](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [Repository Settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features)

### Related Documentation
- [GitHub Actions Permissions](./docs/GITHUB_ACTIONS_PERMISSIONS.md)
- [CI/CD Testing Guide](./docs/CI_CD_TESTING_GUIDE.md)
- [UML Diagram Setup](./docs/UML_DIAGRAM_SETUP.md)

---

## 🚀 Quick Setup Command

After configuring repository settings, test the workflow:

```bash
# Make a small change to trigger workflow
echo "# Test" >> docs/diagrams/architecture/system-architecture.puml
git add docs/diagrams/architecture/system-architecture.puml
git commit -m "test: trigger diagram generation workflow"
git push origin develop

# Then check Actions tab in GitHub
```

---

## ⚠️ Important Notes

### Security
- ✅ Workflow only commits to specific directory
- ✅ Commits are automatically created (no manual approval)
- ✅ Commit messages are standardized
- ✅ Workflow only runs on protected branches

### Limitations
- ⚠️ Workflows cannot push to protected branches with strict rules
- ⚠️ Organization settings may restrict workflow permissions
- ⚠️ Branch protection rules may block workflow pushes

### Best Practices
- ✅ Use `[skip ci]` in commit messages to prevent loops
- ✅ Only commit generated files, not source files
- ✅ Use proper error handling in workflow
- ✅ Monitor workflow runs for issues

---

## 🎯 Next Steps

1. **Configure Repository Settings:**
   - Go to Settings → Actions → General
   - Enable "Read and write permissions"
   - Save settings

2. **Test Workflow:**
   - Make a small change to a `.puml` file
   - Commit and push
   - Verify workflow runs successfully
   - Check if PNGs are committed

3. **Monitor Workflow:**
   - Check Actions tab regularly
   - Review workflow logs
   - Verify diagrams are updated
   - Fix any issues promptly

---

**⚠️ REMINDER: Repository settings MUST be configured for the workflow to work!**

---

**Document Control:**
- **Author:** DevOps Team
- **Last Updated:** 2024
- **Status:** Active

