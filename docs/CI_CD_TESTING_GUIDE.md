# 🧪 CI/CD Pipeline Testing Guide
## PlantUML Diagram Generation

**Last Updated:** 2024

---

## ✅ Commit Summary

### What Was Committed
- ✅ PlantUML setup scripts (`scripts/setup-plantuml.sh`, `scripts/generate-diagrams.sh`)
- ✅ GitHub Actions workflow (`.github/workflows/generate-diagrams.yml`)
- ✅ UML diagram setup documentation
- ✅ Sample system architecture diagram (`docs/diagrams/architecture/system-architecture.puml`)
- ✅ Updated `.gitignore` for PlantUML files
- ✅ Quick start guide

### Commit Details
- **Commit Hash:** `f6d2bcb`
- **Branch:** `develop`
- **Files Changed:** 11 files
- **Insertions:** 2,198 lines
- **Commit Message:** Follows conventional commits format

---

## 🚀 Testing the CI/CD Pipeline

### Step 1: Push to GitHub
```bash
# Push the commit to GitHub
git push origin develop

# Or if pushing to main branch
git push origin main
```

### Step 2: Monitor GitHub Actions
1. Go to your GitHub repository
2. Click on **Actions** tab
3. Look for **"Generate UML Diagrams"** workflow
4. Click on the running workflow to see progress

### Step 3: Verify Workflow Execution
The workflow should:
- ✅ Checkout the repository
- ✅ Set up Java 17
- ✅ Download PlantUML JAR
- ✅ Generate PNG diagrams from `.puml` files
- ✅ Validate diagram syntax
- ✅ Commit generated PNGs (if on main/develop branch)
- ✅ Upload diagrams as artifacts
- ✅ Create summary

### Step 4: Check Generated Diagrams
After the workflow completes:
1. Check the **Actions** tab for workflow status
2. Download **artifacts** to see generated PNGs
3. Check the repository for committed PNG files in `docs/diagrams/exported/`
4. Review the workflow summary for diagram statistics

---

## 📊 Expected Workflow Behavior

### On Push to `develop` or `main`
- ✅ Workflow triggers automatically
- ✅ Diagrams are generated
- ✅ PNGs are committed to repository
- ✅ Artifacts are created

### On Pull Request
- ✅ Workflow triggers automatically
- ✅ Diagrams are generated
- ✅ PNGs are **NOT** committed (PR only)
- ✅ Artifacts are created
- ✅ Validation runs

### Manual Trigger
- ✅ Go to **Actions** → **Generate UML Diagrams**
- ✅ Click **"Run workflow"**
- ✅ Select branch and click **"Run workflow"**

---

## 🔍 Verifying Pipeline Results

### Check Workflow Logs
1. Go to **Actions** tab
2. Click on the workflow run
3. Click on **"generate-diagrams"** job
4. Review each step's logs

### Expected Log Output
```
✅ Checkout repository
✅ Set up Java
✅ Download PlantUML
✅ Generate diagrams
✅ Validate diagrams
✅ Check for changes
✅ Commit and push diagrams (if on main/develop)
✅ Upload diagrams as artifact
✅ Create summary
```

### Check Generated Files
```bash
# After workflow completes, check for generated PNGs
ls -la docs/diagrams/exported/architecture/

# Should see:
# system-architecture.png
```

### Check Commit History
```bash
# Check if PNGs were committed
git log --oneline -5
git show HEAD --name-only
```

---

## 🐛 Troubleshooting

### Workflow Doesn't Trigger
**Problem:** Workflow doesn't run on push
**Solution:**
- Check if workflow file is in `.github/workflows/`
- Verify workflow triggers match your branch name
- Check if paths filter matches your file changes
- Ensure workflow file has correct YAML syntax

### Diagrams Not Generated
**Problem:** PNGs are not generated
**Solution:**
- Check workflow logs for errors
- Verify `.puml` files are in correct directory
- Check PlantUML syntax is valid
- Verify Java setup is correct

### PNGs Not Committed
**Problem:** Generated PNGs are not committed
**Solution:**
- Check if you're on `main` or `develop` branch
- Verify workflow has write permissions
- Check if changes were detected
- Review workflow logs for commit step

### Validation Fails
**Problem:** Diagram validation fails
**Solution:**
- Check PlantUML syntax in `.puml` files
- Verify all required dependencies are included
- Check for syntax errors in diagram files
- Review validation logs for specific errors

---

## 📝 Testing Checklist

### Pre-Push Checklist
- [ ] Commit includes `.puml` files
- [ ] Workflow file is in `.github/workflows/`
- [ ] Workflow syntax is valid
- [ ] Branch name matches workflow triggers

### Post-Push Checklist
- [ ] Workflow triggered successfully
- [ ] All workflow steps completed
- [ ] Diagrams were generated
- [ ] PNGs were committed (if on main/develop)
- [ ] Artifacts were created
- [ ] Summary was generated

### Verification Checklist
- [ ] Check workflow logs for errors
- [ ] Verify generated PNGs exist
- [ ] Check commit history for PNG commits
- [ ] Download and verify artifacts
- [ ] Review workflow summary

---

## 🎯 Next Steps

### After Successful Pipeline Run
1. **Verify Generated Diagrams**
   - Check `docs/diagrams/exported/` for PNG files
   - Verify diagram quality and accuracy
   - Review workflow summary

2. **Add More Diagrams**
   - Create additional `.puml` files
   - Commit and push to trigger workflow
   - Verify new diagrams are generated

3. **Update Documentation**
   - Reference generated diagrams in docs
   - Update README with diagram links
   - Document diagram updates

4. **Monitor Pipeline**
   - Set up notifications for workflow failures
   - Review workflow runs regularly
   - Optimize workflow performance

---

## 🔗 Useful Links

### GitHub Actions
- **Workflow Runs:** `https://github.com/<username>/<repo>/actions`
- **Workflow File:** `.github/workflows/generate-diagrams.yml`
- **Actions Documentation:** https://docs.github.com/en/actions

### PlantUML
- **PlantUML Docs:** https://plantuml.com/
- **PlantUML Examples:** https://real-world-plantuml.com/
- **PlantUML GitHub:** https://github.com/plantuml/plantuml

### Documentation
- **Setup Guide:** `docs/UML_DIAGRAM_SETUP.md`
- **Scripts README:** `scripts/README.md`
- **Diagrams README:** `docs/diagrams/README.md`

---

## 📊 Workflow Configuration

### Current Configuration
```yaml
Triggers:
  - Push to main/develop (on .puml file changes)
  - Pull Request to main/develop (on .puml file changes)
  - Manual trigger (workflow_dispatch)

Actions:
  - Generate PNG diagrams from .puml files
  - Validate diagram syntax
  - Commit PNGs (on main/develop push only)
  - Upload artifacts
  - Create summary
```

### Path Filters
- `docs/diagrams/**/*.puml` - Diagram source files
- `.github/workflows/generate-diagrams.yml` - Workflow file

### Branch Filters
- `main` - Production branch
- `develop` - Development branch

---

## ✅ Success Criteria

### Workflow Success
- ✅ All workflow steps complete without errors
- ✅ Diagrams are generated successfully
- ✅ PNGs are committed to repository (on main/develop)
- ✅ Artifacts are created and downloadable
- ✅ Summary is generated with statistics

### Diagram Quality
- ✅ PNGs are generated with correct dimensions
- ✅ Diagrams are readable and accurate
- ✅ All diagram elements are rendered correctly
- ✅ No syntax errors in source files

### Documentation
- ✅ Generated diagrams are referenced in docs
- ✅ Workflow is documented
- ✅ Troubleshooting guide is available
- ✅ Examples are provided

---

## 🎉 Expected Results

After pushing to GitHub, you should see:

1. **Workflow Run**
   - Workflow appears in Actions tab
   - All steps complete successfully
   - Green checkmark indicates success

2. **Generated Diagrams**
   - PNG files in `docs/diagrams/exported/architecture/`
   - File: `system-architecture.png`
   - High-quality, readable diagrams

3. **Committed Files**
   - New commit with generated PNGs
   - Commit message: "docs: auto-update UML diagrams [skip ci]"
   - PNGs are version-controlled

4. **Artifacts**
   - Downloadable artifact: `uml-diagrams`
   - Contains all generated PNG files
   - Available for 30 days

5. **Summary**
   - Workflow summary with statistics
   - List of generated diagrams
   - Diagram count and file list

---

## 🔄 Continuous Integration

### Automatic Updates
- Diagrams are automatically updated on every push
- PNGs are always in sync with source files
- Validation ensures diagram quality
- Artifacts provide easy access to diagrams

### Best Practices
- ✅ Commit `.puml` source files
- ✅ Let CI/CD generate PNGs
- ✅ Review generated diagrams
- ✅ Update documentation with diagram references
- ✅ Monitor workflow for issues

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** DevOps Team
- **Last Updated:** 2024
- **Status:** Active

---

## 🚀 Ready to Test!

Your PlantUML setup is committed and ready for CI/CD testing. Push to GitHub and watch the magic happen! 🎉

```bash
# Push to trigger workflow
git push origin develop
```

Then check the **Actions** tab in GitHub to see the workflow in action!

