# GitHub Personal Access Token (PAT) Guide

## What is a Personal Access Token (PAT)?

A **Personal Access Token (PAT)** is a secure way to authenticate to GitHub's API and perform actions on your behalf, similar to a password but with specific permissions (scopes).

Think of it like:
- **Password**: Full access to everything (not recommended for automation)
- **PAT**: Limited access to only what you specify (recommended for automation)

---

## 🔑 When Do You Need a PAT?

### You NEED a PAT when:
1. **Cross-repository access** - Accessing repositories that the default `GITHUB_TOKEN` can't reach
2. **GitHub Actions workflows** - When workflow needs access to other repos
3. **API automation** - Scripts or tools that interact with GitHub API
4. **CI/CD pipelines** - Automated deployments and integrations
5. **Third-party tools** - Tools like GitHub CLI, automation scripts

### You DON'T need a PAT when:
- Working within a single repository (use `GITHUB_TOKEN`)
- Both repos are in the same organization (usually works with `GITHUB_TOKEN`)
- Using GitHub's web interface

---

## 📝 How to Create a PAT

### Step-by-Step Guide

1. **Go to GitHub Settings**
   - Click your profile picture (top right)
   - Click **Settings**
   - Or go directly: https://github.com/settings/profile

2. **Navigate to Developer Settings**
   - Scroll down in left sidebar
   - Click **Developer settings** (at the bottom)

3. **Go to Personal Access Tokens**
   - Click **Personal access tokens**
   - Click **Tokens (classic)** or **Fine-grained tokens** (newer)

4. **Generate New Token**
   - Click **Generate new token** → **Generate new token (classic)**
   - Or **Generate new token** → **Fine-grained token** (recommended)

5. **Configure Token**

   **For Classic Tokens:**
   - **Note**: Give it a descriptive name (e.g., "Battle Arena Issue Migration")
   - **Expiration**: Choose expiration (30 days, 60 days, 90 days, or no expiration)
   - **Scopes**: Select the permissions you need:
     - ✅ **`repo`** - Full control of private repositories (includes all repo permissions)
     - ✅ **`workflow`** - Update GitHub Action workflows (if needed)
     - ✅ **`read:org`** - Read org and team membership (if accessing org repos)

   **For Fine-grained Tokens (Recommended):**
   - **Name**: Descriptive name
   - **Expiration**: Choose expiration
   - **Repository access**: 
     - Select "Only select repositories"
     - Choose: `Event-Management-System` and `battle-arena`
   - **Repository permissions**:
     - ✅ **Issues**: Read and write
     - ✅ **Metadata**: Read (always required)

6. **Generate and Copy**
   - Click **Generate token**
   - **⚠️ IMPORTANT**: Copy the token immediately! You won't see it again.
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

7. **Store Securely**
   - Never commit tokens to code
   - Store in password manager
   - Add to GitHub Secrets (see below)

---

## 🔐 Adding PAT to GitHub Secrets

### For This Workflow:

1. **Go to Repository Settings**
   - In your `battle-arena` repository
   - Click **Settings** (top menu)

2. **Navigate to Secrets**
   - Click **Secrets and variables** → **Actions**

3. **Add New Secret**
   - Click **New repository secret**
   - **Name**: `GITHUB_PAT`
   - **Secret**: Paste your PAT token
   - Click **Add secret**

4. **Done!**
   - The workflow will automatically use `GITHUB_PAT` if available
   - Falls back to `GITHUB_TOKEN` if not set

---

## ✅ Pros of Using PAT

### 1. **Cross-Repository Access**
- ✅ Can access multiple repositories
- ✅ Works across different organizations
- ✅ Not limited to single repo like `GITHUB_TOKEN`

### 2. **Granular Permissions**
- ✅ Fine-grained control over what the token can do
- ✅ Can limit to specific repositories
- ✅ Can set expiration dates
- ✅ Better security than using your password

### 3. **Automation-Friendly**
- ✅ Perfect for CI/CD pipelines
- ✅ Works with GitHub Actions
- ✅ Can be used in scripts and tools
- ✅ No need for username/password

### 4. **Audit Trail**
- ✅ Can see when and where token was used
- ✅ Can revoke tokens individually
- ✅ Better than sharing passwords

### 5. **Flexibility**
- ✅ Can create multiple tokens for different purposes
- ✅ Can have different expiration dates
- ✅ Can be scoped to specific repos

---

## ❌ Cons of Using PAT

### 1. **Security Risks**
- ❌ If leaked, can be used to access your repositories
- ❌ No way to recover token if lost (must regenerate)
- ❌ If compromised, attacker has access until token expires or is revoked

### 2. **Management Overhead**
- ❌ Need to remember to rotate tokens regularly
- ❌ Need to update secrets when tokens expire
- ❌ Multiple tokens can be hard to track

### 3. **Token Expiration**
- ❌ Tokens expire (unless set to "no expiration")
- ❌ Workflows can break if token expires
- ❌ Need to monitor and renew

### 4. **Limited by Scopes**
- ❌ If you forget to grant a scope, workflow fails
- ❌ Need to understand what each scope does
- ❌ Can't do more than granted permissions

### 5. **No Built-in Rate Limiting Protection**
- ❌ Subject to GitHub API rate limits
- ❌ Need to implement retry logic in workflows
- ❌ Can hit limits with high-volume operations

---

## 🛡️ Security Best Practices

### 1. **Use Fine-Grained Tokens (New)**
- ✅ More secure than classic tokens
- ✅ Can limit to specific repositories
- ✅ Better permission control

### 2. **Set Expiration Dates**
- ✅ Don't use "no expiration" unless necessary
- ✅ Set to 90 days or less
- ✅ Renew before expiration

### 3. **Minimal Permissions**
- ✅ Only grant permissions you actually need
- ✅ Use `repo` scope only if you need write access
- ✅ Prefer fine-grained permissions

### 4. **Store Securely**
- ✅ Never commit tokens to code
- ✅ Use GitHub Secrets for workflows
- ✅ Use environment variables for local scripts
- ✅ Don't share tokens in chat/email

### 5. **Monitor Usage**
- ✅ Regularly check token usage in GitHub settings
- ✅ Revoke unused tokens
- ✅ Rotate tokens periodically

### 6. **Use Different Tokens**
- ✅ Create separate tokens for different purposes
- ✅ Use descriptive names
- ✅ Revoke tokens when no longer needed

---

## 🔄 PAT vs GITHUB_TOKEN

| Feature | PAT | GITHUB_TOKEN |
|---------|-----|--------------|
| **Access Scope** | Multiple repos/orgs | Single repo only |
| **Creation** | Manual (you create) | Automatic (GitHub provides) |
| **Expiration** | Configurable | Never expires |
| **Permissions** | Configurable | Limited to repo |
| **Security** | Higher risk if leaked | Lower risk (repo-scoped) |
| **Use Case** | Cross-repo access | Single repo operations |

---

## 📋 For Your Use Case (Issue Migration)

### Do You Need a PAT?

**Maybe not!** Try first with `GITHUB_TOKEN`:
- Both repos (`Event-Management-System` and `battle-arena`) are under `Buffden`
- `GITHUB_TOKEN` might work if both are in same account

**You DO need PAT if:**
- `GITHUB_TOKEN` fails with 403/404 errors
- Repos are in different organizations
- You want more control over permissions

### Recommended Setup:

1. **First, try without PAT**
   - Run the workflow with just `GITHUB_TOKEN`
   - If it works, you're done! ✅

2. **If it fails, create PAT:**
   - Use **Fine-grained token** (recommended)
   - Grant access to both repos
   - Add `GITHUB_PAT` secret
   - Workflow will automatically use it

---

## 🚨 What to Do If Token is Leaked

1. **Immediately revoke the token**
   - Go to: https://github.com/settings/tokens
   - Find the compromised token
   - Click **Revoke**

2. **Check for unauthorized activity**
   - Review repository activity
   - Check GitHub audit logs
   - Look for unexpected commits/issues

3. **Create new token**
   - Generate a new PAT
   - Update all places using the old token
   - Update GitHub Secrets

4. **Enable 2FA** (if not already)
   - Two-factor authentication adds extra security
   - Required for some GitHub features

---

## 📚 Additional Resources

- **GitHub Docs**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- **Fine-grained tokens**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- **Token scopes**: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps

---

## ✅ Quick Checklist

- [ ] Understand what PAT is and when you need it
- [ ] Create PAT with minimal required permissions
- [ ] Set appropriate expiration date
- [ ] Store PAT in GitHub Secrets (not in code)
- [ ] Test workflow with PAT
- [ ] Monitor token usage
- [ ] Rotate tokens periodically
- [ ] Revoke unused tokens

---

**Remember**: PATs are powerful but need to be handled securely. Always use the principle of least privilege - only grant the minimum permissions needed!

