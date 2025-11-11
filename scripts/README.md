# 🛠️ Scripts Directory

This directory contains utility scripts for the Battle Arena project.

---

## ⚠️ CRITICAL DESIGN PRINCIPLES

**All scripts MUST strictly adhere to the following principles:**

1. **REUSABILITY** - Scripts should be reusable and configurable
2. **GOOD CODE PRACTICES** - Follow best practices and error handling
3. **CLEAN CODE** - Scripts must be readable and maintainable
4. **SECURE PROGRAMMING** - Validate inputs and handle errors securely

---

## 📁 Available Scripts

### 1. `setup-plantuml.sh`
**Purpose:** Set up PlantUML for local development

**Usage:**
```bash
./scripts/setup-plantuml.sh
```

**Features:**
- Checks for Java, Graphviz, and Docker
- Installs missing dependencies (macOS/Linux)
- Downloads PlantUML JAR
- Creates directory structure
- Provides setup instructions

**Requirements:**
- macOS or Linux
- Homebrew (macOS) or package manager (Linux)
- Internet connection

---

### 2. `generate-diagrams.sh`
**Purpose:** Generate PNG diagrams from PlantUML source files

**Usage:**
```bash
# Auto-detect method (Docker or JAR)
./scripts/generate-diagrams.sh

# Use specific method
./scripts/generate-diagrams.sh --method jar
./scripts/generate-diagrams.sh --method docker

# Clean generated diagrams
./scripts/generate-diagrams.sh --clean

# Validate PlantUML syntax
./scripts/generate-diagrams.sh --validate

# Show help
./scripts/generate-diagrams.sh --help
```

**Features:**
- Auto-detects Docker or JAR method
- Generates PNG files from all .puml files
- Validates PlantUML syntax
- Cleans generated diagrams
- Error handling and logging

**Requirements:**
- Java 11+ (for JAR method) OR Docker (for Docker method)
- PlantUML JAR file (auto-downloaded if missing)

**Output:**
- Generated PNG files in `docs/diagrams/exported/`

---

## 🚀 Quick Start

### Initial Setup
```bash
# 1. Run setup script
./scripts/setup-plantuml.sh

# 2. Install VS Code extensions (manual)
# - PlantUML by jebbs
# - Markdown Preview Mermaid Support

# 3. Generate diagrams
./scripts/generate-diagrams.sh
```

### Daily Usage
```bash
# Generate all diagrams
./scripts/generate-diagrams.sh

# Validate diagrams before committing
./scripts/generate-diagrams.sh --validate

# Clean and regenerate
./scripts/generate-diagrams.sh --clean
./scripts/generate-diagrams.sh
```

---

## 🔧 Configuration

### Environment Variables
- `PLANTUML_VERSION`: PlantUML version (default: 1.2023.12)
- `DIAGRAMS_DIR`: Diagrams directory (default: docs/diagrams)
- `EXPORT_DIR`: Export directory (default: docs/diagrams/exported)

### Script Configuration
Edit script variables at the top of each script:
```bash
PLANTUML_JAR="plantuml.jar"
PLANTUML_VERSION="1.2023.12"
DIAGRAMS_DIR="docs/diagrams"
EXPORT_DIR="docs/diagrams/exported"
```

---

## 📚 Additional Resources

- [PlantUML Documentation](https://plantuml.com/)
- [UML Diagram Setup Guide](../docs/UML_DIAGRAM_SETUP.md)
- [Diagrams Directory](../docs/diagrams/README.md)

---

## ✅ Checklist

### Setup Checklist
- [ ] Run `setup-plantuml.sh`
- [ ] Install VS Code extensions
- [ ] Verify Java/Graphviz installation
- [ ] Test diagram generation
- [ ] Verify exported PNG files

### Usage Checklist
- [ ] Create/update .puml files
- [ ] Validate diagrams
- [ ] Generate PNG files
- [ ] Commit .puml and .png files
- [ ] Update documentation

---

## 🐛 Troubleshooting

### Java Issues
```bash
# Check Java version
java -version

# Install Java (macOS)
brew install openjdk@17

# Install Java (Linux)
sudo apt-get install openjdk-17-jdk
```

### Graphviz Issues
```bash
# Check Graphviz installation
dot -V

# Install Graphviz (macOS)
brew install graphviz

# Install Graphviz (Linux)
sudo apt-get install graphviz
```

### Docker Issues
```bash
# Check Docker installation
docker --version

# Test Docker
docker run hello-world
```

### Script Permission Issues
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

---

## 🔒 Security Considerations

- Scripts validate inputs before processing
- Scripts use secure download methods (HTTPS)
- Scripts check for required dependencies
- Scripts handle errors gracefully
- Scripts don't execute arbitrary code

---

## 📝 Maintenance

### Updating PlantUML Version
1. Update `PLANTUML_VERSION` in scripts
2. Delete old `plantuml.jar`
3. Run setup script again

### Adding New Scripts
1. Create script in `scripts/` directory
2. Make it executable: `chmod +x scripts/script-name.sh`
3. Document in this README
4. Add to CI/CD if needed

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** DevOps Team
- **Last Updated:** 2024
- **Status:** Active

