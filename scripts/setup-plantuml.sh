#!/bin/bash

# PlantUML Setup Script
# This script helps set up PlantUML for local development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PLANTUML_JAR="plantuml.jar"
PLANTUML_VERSION="1.2023.12"
SCRIPTS_DIR="scripts"
DIAGRAMS_DIR="docs/diagrams"

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to check OS
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Java on macOS
install_java_macos() {
    print_step "Installing Java on macOS..."
    
    if command_exists brew; then
        print_info "Installing Java using Homebrew..."
        brew install openjdk@17
        brew link --overwrite openjdk@17
        
        # Add to PATH
        echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
        echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
        
        print_info "Java installed successfully"
        print_warn "Please restart your terminal or run: source ~/.zshrc"
    else
        print_error "Homebrew is not installed"
        print_info "Please install Homebrew from https://brew.sh"
        print_info "Or install Java manually from https://adoptium.net"
        return 1
    fi
}

# Function to install Java on Linux
install_java_linux() {
    print_step "Installing Java on Linux..."
    
    if command_exists apt-get; then
        print_info "Installing Java using apt-get..."
        sudo apt-get update
        sudo apt-get install -y openjdk-17-jdk
    elif command_exists yum; then
        print_info "Installing Java using yum..."
        sudo yum install -y java-17-openjdk-devel
    elif command_exists dnf; then
        print_info "Installing Java using dnf..."
        sudo dnf install -y java-17-openjdk-devel
    else
        print_error "No supported package manager found"
        print_info "Please install Java manually from https://adoptium.net"
        return 1
    fi
    
    print_info "Java installed successfully"
}

# Function to install Graphviz on macOS
install_graphviz_macos() {
    print_step "Installing Graphviz on macOS..."
    
    if command_exists brew; then
        brew install graphviz
        print_info "Graphviz installed successfully"
    else
        print_error "Homebrew is not installed"
        print_info "Please install Homebrew from https://brew.sh"
        return 1
    fi
}

# Function to install Graphviz on Linux
install_graphviz_linux() {
    print_step "Installing Graphviz on Linux..."
    
    if command_exists apt-get; then
        sudo apt-get install -y graphviz
    elif command_exists yum; then
        sudo yum install -y graphviz
    elif command_exists dnf; then
        sudo dnf install -y graphviz
    else
        print_error "No supported package manager found"
        print_info "Please install Graphviz manually from https://graphviz.org"
        return 1
    fi
    
    print_info "Graphviz installed successfully"
}

# Function to download PlantUML JAR
download_plantuml_jar() {
    print_step "Downloading PlantUML JAR..."
    
    if [ -f "$PLANTUML_JAR" ]; then
        print_info "PlantUML JAR already exists"
        return 0
    fi
    
    PLANTUML_URL="https://github.com/plantuml/plantuml/releases/download/v${PLANTUML_VERSION}/plantuml-${PLANTUML_VERSION}.jar"
    
    if command_exists curl; then
        curl -L -o "$PLANTUML_JAR" "$PLANTUML_URL"
    elif command_exists wget; then
        wget -O "$PLANTUML_JAR" "$PLANTUML_URL"
    else
        print_error "Neither curl nor wget is installed"
        return 1
    fi
    
    print_info "PlantUML JAR downloaded successfully"
}

# Function to check Java installation
check_java() {
    if command_exists java; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | sed '/^1\./s///' | cut -d'.' -f1)
        if [ "$JAVA_VERSION" -ge 11 ]; then
            print_info "Java $JAVA_VERSION is installed"
            return 0
        else
            print_warn "Java $JAVA_VERSION is installed, but Java 11+ is recommended"
            return 1
        fi
    else
        print_warn "Java is not installed"
        return 1
    fi
}

# Function to check Graphviz installation
check_graphviz() {
    if command_exists dot; then
        print_info "Graphviz is installed"
        return 0
    else
        print_warn "Graphviz is not installed"
        return 1
    fi
}

# Function to check Docker installation
check_docker() {
    if command_exists docker; then
        print_info "Docker is installed"
        return 0
    else
        print_warn "Docker is not installed (optional)"
        return 1
    fi
}

# Function to create directory structure
create_directory_structure() {
    print_step "Creating directory structure..."
    
    mkdir -p "$DIAGRAMS_DIR/architecture"
    mkdir -p "$DIAGRAMS_DIR/class-diagrams"
    mkdir -p "$DIAGRAMS_DIR/sequence-diagrams"
    mkdir -p "$DIAGRAMS_DIR/component-diagrams"
    mkdir -p "$DIAGRAMS_DIR/deployment-diagrams"
    mkdir -p "$DIAGRAMS_DIR/exported"
    
    print_info "Directory structure created"
}

# Function to setup VS Code extensions (informational)
setup_vscode_extensions() {
    print_step "VS Code Extension Setup (Informational)..."
    
    print_info "To use PlantUML in VS Code/Cursor:"
    print_info "1. Install 'PlantUML' extension by jebbs"
    print_info "2. Install 'Markdown Preview Mermaid Support' for Mermaid diagrams"
    print_info "3. Press Alt+D to preview PlantUML diagrams"
    print_info "4. Use Cmd+Shift+P -> 'PlantUML: Export Current Diagram' to export"
}

# Main setup function
main() {
    print_info "PlantUML Setup Script"
    print_info "===================="
    echo ""
    
    OS=$(detect_os)
    print_info "Detected OS: $OS"
    echo ""
    
    # Check Java
    if ! check_java; then
        print_warn "Java is not installed or version is too old"
        read -p "Do you want to install Java? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            case $OS in
                macos)
                    install_java_macos
                    ;;
                linux)
                    install_java_linux
                    ;;
                *)
                    print_error "Automatic Java installation is not supported for $OS"
                    print_info "Please install Java manually from https://adoptium.net"
                    ;;
            esac
        else
            print_error "Java is required for PlantUML"
            exit 1
        fi
    fi
    echo ""
    
    # Check Graphviz
    if ! check_graphviz; then
        print_warn "Graphviz is not installed (recommended for better diagram rendering)"
        read -p "Do you want to install Graphviz? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            case $OS in
                macos)
                    install_graphviz_macos
                    ;;
                linux)
                    install_graphviz_linux
                    ;;
                *)
                    print_error "Automatic Graphviz installation is not supported for $OS"
                    print_info "Please install Graphviz manually from https://graphviz.org"
                    ;;
            esac
        fi
    fi
    echo ""
    
    # Check Docker (optional)
    check_docker
    echo ""
    
    # Download PlantUML JAR
    download_plantuml_jar
    echo ""
    
    # Create directory structure
    create_directory_structure
    echo ""
    
    # Setup VS Code extensions info
    setup_vscode_extensions
    echo ""
    
    # Final summary
    print_info "Setup Summary"
    print_info "============="
    check_java && echo "✅ Java is installed" || echo "❌ Java is not installed"
    check_graphviz && echo "✅ Graphviz is installed" || echo "⚠️  Graphviz is not installed (optional)"
    check_docker && echo "✅ Docker is installed" || echo "⚠️  Docker is not installed (optional)"
    [ -f "$PLANTUML_JAR" ] && echo "✅ PlantUML JAR is downloaded" || echo "❌ PlantUML JAR is not downloaded"
    echo ""
    
    print_info "Next Steps:"
    print_info "1. Install PlantUML extension in VS Code/Cursor"
    print_info "2. Open a .puml file and press Alt+D to preview"
    print_info "3. Run './scripts/generate-diagrams.sh' to generate all diagrams"
    print_info "4. Check docs/diagrams/ for example diagrams"
    echo ""
    
    print_info "Setup completed successfully! 🎉"
}

# Run main function
main "$@"

