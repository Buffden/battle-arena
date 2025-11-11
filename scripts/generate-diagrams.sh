#!/bin/bash

# Generate UML Diagrams Script
# This script generates PNG diagrams from PlantUML source files
# Supports both JAR and Docker methods

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DIAGRAMS_DIR="docs/diagrams"
EXPORT_DIR="docs/diagrams/exported"
PLANTUML_JAR="plantuml.jar"
PLANTUML_VERSION="1.2023.12"
JAVA_MIN_VERSION=11

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

# Function to check if Java is installed
check_java() {
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | sed '/^1\./s///' | cut -d'.' -f1)
        if [ "$JAVA_VERSION" -ge "$JAVA_MIN_VERSION" ]; then
            print_info "Java $JAVA_VERSION detected"
            return 0
        else
            print_error "Java $JAVA_VERSION detected, but Java $JAVA_MIN_VERSION+ is required"
            return 1
        fi
    else
        print_error "Java is not installed"
        return 1
    fi
}

# Function to check if Docker is installed
check_docker() {
    if command -v docker &> /dev/null; then
        print_info "Docker detected"
        return 0
    else
        print_error "Docker is not installed"
        return 1
    fi
}

# Function to download PlantUML JAR
download_plantuml_jar() {
    if [ ! -f "$PLANTUML_JAR" ]; then
        print_info "Downloading PlantUML JAR..."
        PLANTUML_URL="https://github.com/plantuml/plantuml/releases/download/v${PLANTUML_VERSION}/plantuml-${PLANTUML_VERSION}.jar"
        
        if command -v curl &> /dev/null; then
            curl -L -o "$PLANTUML_JAR" "$PLANTUML_URL"
        elif command -v wget &> /dev/null; then
            wget -O "$PLANTUML_JAR" "$PLANTUML_URL"
        else
            print_error "Neither curl nor wget is installed"
            return 1
        fi
        
        print_info "PlantUML JAR downloaded successfully"
    else
        print_info "PlantUML JAR already exists"
    fi
}

# Function to generate diagrams using JAR
generate_with_jar() {
    print_info "Generating diagrams using PlantUML JAR..."
    
    if [ ! -f "$PLANTUML_JAR" ]; then
        download_plantuml_jar
    fi
    
    # Create export directory if it doesn't exist
    mkdir -p "$EXPORT_DIR"
    
    # Find all .puml files and generate PNGs
    find "$DIAGRAMS_DIR" -name "*.puml" -type f | while read -r file; do
        relative_path=$(echo "$file" | sed "s|^$DIAGRAMS_DIR/||")
        output_dir="$EXPORT_DIR/$(dirname "$relative_path")"
        mkdir -p "$output_dir"
        
        print_info "Processing: $file"
        java -jar "$PLANTUML_JAR" -tpng "$file" -o "$(pwd)/$output_dir" || {
            print_error "Failed to generate diagram from $file"
        }
    done
    
    print_info "Diagrams generated successfully in $EXPORT_DIR"
}

# Function to generate diagrams using Docker
generate_with_docker() {
    print_info "Generating diagrams using Docker..."
    
    # Create export directory if it doesn't exist
    mkdir -p "$EXPORT_DIR"
    
    # Generate diagrams using Docker
    docker run --rm \
        -v "$(pwd):/data" \
        plantuml/plantuml:latest \
        -tpng \
        "/data/$DIAGRAMS_DIR/**/*.puml" \
        -o "/data/$EXPORT_DIR" || {
        print_error "Failed to generate diagrams with Docker"
        return 1
    }
    
    print_info "Diagrams generated successfully in $EXPORT_DIR"
}

# Function to clean generated diagrams
clean_diagrams() {
    print_info "Cleaning generated diagrams..."
    if [ -d "$EXPORT_DIR" ]; then
        rm -rf "$EXPORT_DIR"/*
        print_info "Generated diagrams cleaned"
    else
        print_warn "Export directory does not exist"
    fi
}

# Function to validate PlantUML syntax
validate_diagrams() {
    print_info "Validating PlantUML diagrams..."
    
    if [ ! -f "$PLANTUML_JAR" ]; then
        download_plantuml_jar
    fi
    
    errors=0
    find "$DIAGRAMS_DIR" -name "*.puml" -type f | while read -r file; do
        print_info "Validating: $file"
        java -jar "$PLANTUML_JAR" -checkmetadata "$file" || {
            print_error "Validation failed for $file"
            errors=$((errors + 1))
        }
    done
    
    if [ $errors -eq 0 ]; then
        print_info "All diagrams are valid"
    else
        print_error "$errors diagram(s) have validation errors"
        return 1
    fi
}

# Main function
main() {
    print_info "PlantUML Diagram Generator"
    print_info "=========================="
    
    # Parse arguments
    METHOD="auto"
    CLEAN=false
    VALIDATE=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --method)
                METHOD="$2"
                shift 2
                ;;
            --clean)
                CLEAN=true
                shift
                ;;
            --validate)
                VALIDATE=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --method METHOD    Method to use: jar, docker, or auto (default: auto)"
                echo "  --clean            Clean generated diagrams"
                echo "  --validate         Validate PlantUML syntax"
                echo "  --help             Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Clean if requested
    if [ "$CLEAN" = true ]; then
        clean_diagrams
        exit 0
    fi
    
    # Validate if requested
    if [ "$VALIDATE" = true ]; then
        validate_diagrams
        exit $?
    fi
    
    # Determine method
    if [ "$METHOD" = "auto" ]; then
        if check_docker; then
            METHOD="docker"
        elif check_java; then
            METHOD="jar"
        else
            print_error "Neither Docker nor Java is available"
            print_error "Please install Docker or Java to generate diagrams"
            exit 1
        fi
    fi
    
    # Generate diagrams
    case $METHOD in
        jar)
            if check_java; then
                generate_with_jar
            else
                print_error "Java is required for JAR method"
                exit 1
            fi
            ;;
        docker)
            if check_docker; then
                generate_with_docker
            else
                print_error "Docker is required for Docker method"
                exit 1
            fi
            ;;
        *)
            print_error "Invalid method: $METHOD"
            print_error "Use: jar, docker, or auto"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"

