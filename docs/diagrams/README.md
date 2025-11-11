# 📊 Diagrams Directory

This directory contains all UML diagrams for the Battle Arena project documentation.

---

## ⚠️ CRITICAL DESIGN PRINCIPLES

**All diagrams MUST strictly adhere to the following principles:**

1. **REUSABILITY** - Design components for maximum reusability
2. **GOOD CODE PRACTICES** - Follow SOLID principles and best practices
3. **CLEAN CODE** - Clear, readable diagrams
4. **CLEAN ARCHITECTURE** - Show proper separation of concerns
5. **SECURE PROGRAMMING** - Highlight security considerations

---

## 📁 Directory Structure

```
diagrams/
├── architecture/           # System architecture diagrams
│   └── system-architecture.puml
├── class-diagrams/         # Class diagrams for each service
│   └── auth-service.puml
├── sequence-diagrams/      # Sequence diagrams for key flows
│   ├── authentication-flow.puml
│   └── matchmaking-flow.puml
├── exported/               # Exported PNG files (generated)
│   └── (PNG files)
└── README.md               # This file
```

---

## 🛠️ Tools Required

### PlantUML (Recommended)
- **Extension:** PlantUML by jebbs
- **Dependencies:** Graphviz
- **Installation:** See [UML_DIAGRAM_SETUP.md](../UML_DIAGRAM_SETUP.md)

### Mermaid (Alternative)
- **Extension:** Mermaid Preview by vstirbu
- **Installation:** See [UML_DIAGRAM_SETUP.md](../UML_DIAGRAM_SETUP.md)

---

## 📝 Diagram Files

### Architecture Diagrams
- **system-architecture.puml** - High-level system architecture

### Class Diagrams
- **auth-service.puml** - Auth Service class diagram
- **profile-service.puml** - Profile Service class diagram (TODO)
- **leaderboard-service.puml** - Leaderboard Service class diagram (TODO)
- **matchmaking-service.puml** - Matchmaking Service class diagram (TODO)
- **game-engine-service.puml** - Game Engine Service class diagram (TODO)

### Sequence Diagrams
- **authentication-flow.puml** - User authentication flow
- **matchmaking-flow.puml** - Matchmaking flow
- **gameplay-flow.puml** - Gameplay flow (TODO)
- **post-match-flow.puml** - Post-match flow (TODO)

---

## 🚀 How to Use

### Viewing Diagrams
1. Install PlantUML extension in Cursor/VS Code
2. Install Graphviz (required for PlantUML)
3. Open `.puml` file
4. Press `Alt+D` to preview

### Exporting to PNG
1. Open `.puml` file
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "PlantUML: Export Current Diagram"
4. Select PNG format
5. Save to `exported/` directory

### Using in Documentation
1. Export diagram to PNG
2. Save PNG to `exported/` directory
3. Reference in markdown:
   ```markdown
   ![System Architecture](./diagrams/exported/system-architecture.png)
   ```

---

## 📚 Diagram Guidelines

### Naming Conventions
- Use kebab-case for file names: `auth-service.puml`
- Use descriptive names: `authentication-flow.puml`
- Group related diagrams in subdirectories

### Diagram Standards
- Use consistent colors and styles
- Add notes for complex concepts
- Keep diagrams readable and simple
- Update diagrams when architecture changes

### Version Control
- Commit `.puml` source files to Git
- Commit exported PNG files to Git
- Keep diagrams in sync with code
- Document diagram changes in commits

---

## 🔄 Maintaining Diagrams

### When to Update
- When architecture changes
- When new services are added
- When API contracts change
- When security requirements change

### Update Process
1. Update `.puml` source file
2. Export to PNG
3. Update documentation references
4. Commit changes to Git
5. Document changes in commit message

---

## 📖 Additional Resources

- [UML Diagram Setup Guide](../UML_DIAGRAM_SETUP.md)
- [PlantUML Documentation](https://plantuml.com/)
- [Mermaid Documentation](https://mermaid.js.org/)

---

## ✅ Checklist

### Setup
- [ ] Install PlantUML extension
- [ ] Install Graphviz
- [ ] Create diagrams directory structure
- [ ] Create first diagram
- [ ] Test export to PNG

### Diagram Creation
- [ ] System architecture diagram
- [ ] Class diagrams for all services
- [ ] Sequence diagrams for key flows
- [ ] Export all diagrams to PNG
- [ ] Update documentation with diagram references

---

**⚠️ REMINDER: Reusability | Good Code Practices | Clean Code | Clean Architecture | Secure Programming**

---

**Document Control:**
- **Author:** Documentation Team
- **Last Updated:** 2024
- **Status:** Active

