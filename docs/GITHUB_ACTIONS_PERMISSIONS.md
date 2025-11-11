# 🔐 GitHub Actions Permissions Setup
## Fixing Permission Issues for PlantUML Workflow

**Last Updated:** 2024

---

## 🚨 Issue: Permission Denied Error

### Error Message
```
remote: Permission to Buffden/battle-arena.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/Buffden/battle-arena/': The requested URL returned error: 403
```

### Root Cause
The GitHub Actions workflow doesn't have write permissions to push commits back to the repository by default.

---

## ✅ Solution: Configure Workflow Permissions

### Option 1: Add Permissions to Workflow (Recommended)

The workflow has been updated to include proper permissions:

```yaml
permissions:
  contents: write
  pull-requests: read
```

### Option 2: Repository Settings

If the workflow still doesn't work, check repository settings:

1. Go to **Repository Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
3. Allow GitHub Actions to create and approve pull requests (optional)

### Option 3: Use Personal Access Token (PAT)

If you need more control, use a Personal Access Token:

1. **Create a PAT:**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
   - Copy the token

2. **Add to Repository Secrets:**
   - Go to Repository Settings → Secrets → Actions
   - Add new secret: `PAT_TOKEN` with your token value

3. **Update Workflow:**
   ```yaml
   - name: Checkout repository
     uses: actions/checkout@v4
     with:
       token: ${{ secrets.PAT_TOKEN }}
   ```

---

## 🔧 Workflow Updates Applied

### 1. Added Permissions
```yaml
permissions:
  contents: write
  pull-requests: read
```

### 2. Updated Checkout Step
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
    token: ${{ secrets.GITHUB_TOKEN }}
    persist-credentials: true
```

### 3. Updated Push Command
```yaml
- name: Commit and push diagrams
  if: steps.verify-changed-files.outputs.changed == 'true' && github.event_name == 'push'
  run: |
    git config --global user.name "github-actions[bot]"
    git config --global user.email "github-actions[bot]@users.noreply.github.com"
    git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git
    git add docs/diagrams/exported/**/*.png
    git commit -m "docs: auto-update UML diagrams [skip ci]" || exit 0
    git push origin HEAD:${GITHUB_REF} || echo "Push failed or no changes to push"
```

---

## 📋 Steps to Fix

### Step 1: Update Repository Settings
1. Go to your GitHub repository
2. Click **Settings** → **Actions** → **General**
3. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
4. Click **Save**

### Step 2: Verify Workflow File
The workflow file has been updated with:
- ✅ Proper permissions
- ✅ Correct authentication
- ✅ Error handling

### Step 3: Test the Workflow
1. Make a small change to a `.puml` file
2. Commit and push
3. Check GitHub Actions tab
4. Verify workflow completes successfully
5. Check if PNGs are committed

---

## 🔍 Troubleshooting

### Still Getting Permission Errors?

#### Check 1: Repository Settings
- Verify **Workflow permissions** is set to **Read and write**
- Check if **Allow GitHub Actions to create and approve pull requests** is enabled

#### Check 2: Workflow Permissions
- Verify `permissions:` section is in the workflow file
- Check `contents: write` permission is set

#### Check 3: Branch Protection
- If using branch protection, ensure workflows can push
- Check if **Restrict who can push to matching branches** allows workflows

#### Check 4: Token Authentication
- Verify `persist-credentials: true` in checkout step
- Check if `GITHUB_TOKEN` is being used correctly
- Ensure remote URL is set with token

---

## 🎯 Alternative Solutions

### Solution 1: Create Pull Request Instead
Instead of pushing directly, create a PR:

```yaml
- name: Create Pull Request
  uses: peter-evans/create-pull-request@v5
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    commit-message: "docs: auto-update UML diagrams"
    title: "docs: auto-update UML diagrams"
    body: "Automatically generated UML diagrams"
    branch: auto-update-diagrams
```

### Solution 2: Use GitHub App
Create a GitHub App with write permissions and use it instead of GITHUB_TOKEN.

### Solution 3: Manual Commit (Not Recommended)
Skip auto-commit and manually commit generated PNGs, or use artifacts only.

---

## ✅ Verification Checklist

- [ ] Repository settings allow write permissions for workflows
- [ ] Workflow file includes `permissions:` section
- [ ] Checkout step has `persist-credentials: true`
- [ ] Push command uses proper authentication
- [ ] Workflow runs successfully
- [ ] PNGs are committed to repository
- [ ] No permission errors in workflow logs

---

## 📚 Additional Resources

### GitHub Documentation
- [Workflow Permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- [Authentication in Workflows](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [Troubleshooting Workflows](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows)

### Related Documentation
- [CI/CD Testing Guide](./CI_CD_TESTING_GUIDE.md)
- [UML Diagram Setup](./UML_DIAGRAM_SETUP.md)
- [PlantUML Setup Complete](./PLANTUML_SETUP_COMPLETE.md)

---

## 🚀 Next Steps

1. **Update Repository Settings:**
   - Go to Settings → Actions → General
   - Enable "Read and write permissions"

2. **Commit Updated Workflow:**
   ```bash
   git add .github/workflows/generate-diagrams.yml
   git commit -m "fix: update workflow permissions for auto-commit"
   git push origin develop
   ```

3. **Test the Workflow:**
   - Make a small change to a `.puml` file
   - Commit and push
   - Verify workflow completes successfully
   - Check if PNGs are committed

4. **Verify Results:**
   - Check GitHub Actions tab
   - Verify workflow completes without errors
   - Check repository for committed PNGs
   - Download artifacts to verify diagrams

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** DevOps Team
- **Last Updated:** 2024
- **Status:** Active

