# 🚀 PlantUML Quick Start Guide

## ⚡ 3-Minute Setup

### 1. Run Setup Script
```bash
./scripts/setup-plantuml.sh
```

### 2. Install VS Code Extension
- Open Cursor/VS Code
- Install "PlantUML" extension by jebbs
- Press `Alt+D` to preview diagrams

### 3. Generate Diagrams
```bash
./scripts/generate-diagrams.sh
```

**That's it!** You're ready to create and view UML diagrams.

---

## 📝 Common Commands

### Generate All Diagrams
```bash
./scripts/generate-diagrams.sh
```

### Validate Diagrams
```bash
./scripts/generate-diagrams.sh --validate
```

### Clean Generated Diagrams
```bash
./scripts/generate-diagrams.sh --clean
```

### Generate with Docker
```bash
./scripts/generate-diagrams.sh --method docker
```

---

## 🎨 Create Your First Diagram

1. **Create a new file**: `docs/diagrams/architecture/my-diagram.puml`
2. **Add PlantUML code**:
   ```plantuml
   @startuml
   Alice -> Bob: Hello
   Bob -> Alice: Hi
   @enduml
   ```
3. **Preview**: Press `Alt+D` in VS Code
4. **Export**: `Cmd+Shift+P` → "PlantUML: Export Current Diagram"

---

## 📚 Documentation

- **[Complete Setup Guide](./docs/UML_DIAGRAM_SETUP.md)** - Detailed setup instructions
- **[Scripts README](./scripts/README.md)** - Script documentation
- **[Diagrams README](./docs/diagrams/README.md)** - Diagram documentation
- **[Setup Complete](./docs/PLANTUML_SETUP_COMPLETE.md)** - Implementation summary

---

## 🔗 Quick Links

- **PlantUML Docs**: https://plantuml.com/
- **Examples**: https://real-world-plantuml.com/
- **VS Code Extension**: Search "PlantUML" in extensions

---

## ✅ Checklist

- [ ] Run setup script
- [ ] Install VS Code extension
- [ ] Generate diagrams
- [ ] Create your first diagram
- [ ] View example diagrams

---

**Ready to go! 🎉**

