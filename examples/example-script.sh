#!/bin/bash

# =============================================================================
# SynthWave Dark Theme - Bash Script Showcase
# 
# This script demonstrates various bash syntax elements to showcase
# the SynthWave Dark VS Code theme's shell script highlighting.
#
# Author: Sammy Kumar
# Theme: SynthWave Dark
# Version: 1.1.0
# =============================================================================

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# ===== CONSTANTS AND VARIABLES =====
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly THEME_NAME="SynthWave Dark"
readonly VERSION="1.1.0"

# Color constants for neon theme
declare -r NEON_PINK='\033[38;2;249;38;114m'
declare -r NEON_CYAN='\033[38;2;102;217;239m'
declare -r NEON_YELLOW='\033[38;2;230;219;116m'
declare -r NEON_PURPLE='\033[38;2;174;129;255m'
declare -r NEON_GREEN='\033[38;2;74;222;128m'
declare -r RESET='\033[0m'
declare -r BOLD='\033[1m'

# Configuration variables
ENABLE_GLOW=${ENABLE_GLOW:-false}
GLOW_INTENSITY=${GLOW_INTENSITY:-50}
DEBUG_MODE=${DEBUG_MODE:-false}
INSTALL_PATH=${INSTALL_PATH:-"$HOME/.vscode/extensions"}

# Arrays for demonstration
declare -a SUPPORTED_LANGUAGES=("javascript" "typescript" "python" "css" "html" "bash")
declare -A THEME_COLORS=(
    ["pink"]="#f92672"
    ["cyan"]="#66d9ef" 
    ["yellow"]="#e6db74"
    ["purple"]="#ae81ff"
    ["green"]="#4ade80"
)

# ===== FUNCTIONS =====

# Display colored output
print_colored() {
    local color="$1"
    local message="$2"
    local no_newline="${3:-false}"
    
    if [[ "$no_newline" == "true" ]]; then
        printf "${color}%s${RESET}" "$message"
    else
        printf "${color}%s${RESET}\n" "$message"
    fi
}

# Print banner with neon colors
print_banner() {
    echo
    print_colored "$NEON_PINK" "=================================="
    print_colored "$NEON_CYAN" "  🌈 $THEME_NAME Theme Installer"
    print_colored "$NEON_YELLOW" "  Version: $VERSION"
    print_colored "$NEON_PURPLE" "  Author: Sammy Kumar"
    print_colored "$NEON_PINK" "=================================="
    echo
}

# Logging functions
log_info() {
    print_colored "$NEON_CYAN" "[INFO] $*"
}

log_success() {
    print_colored "$NEON_GREEN" "[SUCCESS] $*"
}

log_warning() {
    print_colored "$NEON_YELLOW" "[WARNING] $*"
}

log_error() {
    print_colored "$NEON_PINK" "[ERROR] $*" >&2
}

log_debug() {
    if [[ "$DEBUG_MODE" == "true" ]]; then
        print_colored "$NEON_PURPLE" "[DEBUG] $*"
    fi
}

# Check if command exists
command_exists() {
    local cmd="$1"
    command -v "$cmd" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    local -a required_commands=("code" "git" "curl" "jq")
    local missing_commands=()
    
    log_info "Checking prerequisites..."
    
    for cmd in "${required_commands[@]}"; do
        if ! command_exists "$cmd"; then
            missing_commands+=("$cmd")
        else
            log_debug "Found command: $cmd"
        fi
    done
    
    if [[ ${#missing_commands[@]} -gt 0 ]]; then
        log_error "Missing required commands: ${missing_commands[*]}"
        log_info "Please install the missing commands and try again."
        return 1
    fi
    
    log_success "All prerequisites satisfied!"
    return 0
}

# Get VS Code version
get_vscode_version() {
    local version
    if command_exists code; then
        version=$(code --version 2>/dev/null | head -n1 || echo "unknown")
        echo "$version"
    else
        echo "not-installed"
    fi
}

# Check if VS Code is running
is_vscode_running() {
    if command_exists pgrep; then
        pgrep -f "Visual Studio Code" >/dev/null 2>&1
    elif command_exists ps; then
        ps aux | grep -i "visual studio code" | grep -v grep >/dev/null 2>&1
    else
        return 1
    fi
}

# Download theme files
download_theme() {
    local download_url="$1"
    local destination="$2"
    
    log_info "Downloading theme from: $download_url"
    
    if command_exists curl; then
        curl -fsSL "$download_url" -o "$destination"
    elif command_exists wget; then
        wget -q "$download_url" -O "$destination"
    else
        log_error "Neither curl nor wget found. Cannot download theme."
        return 1
    fi
    
    if [[ -f "$destination" ]]; then
        log_success "Theme downloaded successfully!"
        return 0
    else
        log_error "Failed to download theme file."
        return 1
    fi
}

# Install theme
install_theme() {
    local theme_file="$1"
    local install_directory="$INSTALL_PATH/sammykumar.synthwave-dark-vscode"
    
    log_info "Installing theme to: $install_directory"
    
    # Create installation directory
    if ! mkdir -p "$install_directory"; then
        log_error "Failed to create installation directory"
        return 1
    fi
    
    # Extract or copy theme files
    if [[ "$theme_file" == *.zip ]]; then
        if command_exists unzip; then
            unzip -q "$theme_file" -d "$install_directory"
        else
            log_error "unzip command not found. Cannot extract theme."
            return 1
        fi
    else
        cp "$theme_file" "$install_directory/"
    fi
    
    log_success "Theme installed successfully!"
}

# Configure theme settings
configure_theme() {
    local settings_file="$HOME/.vscode/User/settings.json"
    local backup_file="${settings_file}.backup.$(date +%s)"
    
    log_info "Configuring theme settings..."
    
    # Backup existing settings
    if [[ -f "$settings_file" ]]; then
        cp "$settings_file" "$backup_file"
        log_debug "Settings backed up to: $backup_file"
    fi
    
    # Create settings directory if it doesn't exist
    mkdir -p "$(dirname "$settings_file")"
    
    # Update settings using jq if available
    if command_exists jq; then
        local temp_file
        temp_file=$(mktemp)
        
        # Create or update settings
        if [[ -f "$settings_file" ]]; then
            jq '. + {
                "workbench.colorTheme": "SynthWave 84",
                "synthwaveDark.enableGlow": true,
                "synthwaveDark.glowIntensity": 50
            }' "$settings_file" > "$temp_file"
        else
            echo '{
                "workbench.colorTheme": "SynthWave 84",
                "synthwaveDark.enableGlow": true,
                "synthwaveDark.glowIntensity": 50
            }' > "$temp_file"
        fi
        
        mv "$temp_file" "$settings_file"
        log_success "Theme settings configured!"
    else
        log_warning "jq not found. Please configure theme manually in VS Code."
    fi
}

# Enable glow effects
enable_glow_effects() {
    if [[ "$ENABLE_GLOW" != "true" ]]; then
        log_info "Glow effects disabled. Use --enable-glow to enable."
        return 0
    fi
    
    log_info "Enabling neon glow effects..."
    
    # This would typically modify VS Code's workbench files
    # For demonstration purposes, we'll just show the concept
    
    local workbench_file="$INSTALL_PATH/../workbench/workbench.desktop.main.css"
    
    if [[ -f "$workbench_file" ]]; then
        # Add glow styles (in a real implementation)
        log_debug "Would modify: $workbench_file"
        log_success "Glow effects enabled! ✨"
    else
        log_warning "Workbench file not found. Glow effects may not work."
    fi
}

# Cleanup function
cleanup() {
    local exit_code=$?
    
    log_debug "Cleaning up temporary files..."
    
    # Remove temporary files
    rm -f /tmp/synthwave-*.tmp
    
    if [[ $exit_code -eq 0 ]]; then
        log_success "Installation completed successfully! 🌈"
    else
        log_error "Installation failed with exit code: $exit_code"
    fi
    
    exit $exit_code
}

# Print usage information
usage() {
    cat << EOF
Usage: $SCRIPT_NAME [OPTIONS]

Install and configure the SynthWave Dark VS Code theme.

OPTIONS:
    -h, --help              Show this help message
    -v, --verbose           Enable verbose output
    -d, --debug             Enable debug mode
    -g, --enable-glow       Enable neon glow effects
    -i, --install-path DIR  Set custom installation path
    --intensity LEVEL       Set glow intensity (0-100)
    --version               Show version information

EXAMPLES:
    $SCRIPT_NAME                    # Basic installation
    $SCRIPT_NAME --enable-glow      # Install with glow effects
    $SCRIPT_NAME --debug --verbose  # Install with detailed output

For more information, visit:
https://github.com/sammykumar/synthwave-dark-vscode

EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                exit 0
                ;;
            -v|--verbose)
                set -x
                shift
                ;;
            -d|--debug)
                DEBUG_MODE=true
                log_debug "Debug mode enabled"
                shift
                ;;
            -g|--enable-glow)
                ENABLE_GLOW=true
                shift
                ;;
            -i|--install-path)
                INSTALL_PATH="$2"
                shift 2
                ;;
            --intensity)
                if [[ "$2" =~ ^[0-9]+$ ]] && [[ "$2" -ge 0 ]] && [[ "$2" -le 100 ]]; then
                    GLOW_INTENSITY="$2"
                else
                    log_error "Invalid intensity value: $2 (must be 0-100)"
                    exit 1
                fi
                shift 2
                ;;
            --version)
                echo "$THEME_NAME v$VERSION"
                exit 0
                ;;
            -*)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
            *)
                log_error "Unexpected argument: $1"
                usage
                exit 1
                ;;
        esac
    done
}

# Main installation function
main() {
    local theme_url="https://github.com/sammykumar/synthwave-dark-vscode/releases/latest/download/theme.vsix"
    local temp_file="/tmp/synthwave-dark-theme.vsix"
    
    print_banner
    
    # Check if running as root (not recommended)
    if [[ $EUID -eq 0 ]]; then
        log_warning "Running as root is not recommended for VS Code extensions"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Installation cancelled."
            exit 0
        fi
    fi
    
    # Check prerequisites
    if ! check_prerequisites; then
        exit 1
    fi
    
    # Show VS Code version
    local vscode_version
    vscode_version=$(get_vscode_version)
    log_info "VS Code version: $vscode_version"
    
    # Warn if VS Code is running
    if is_vscode_running; then
        log_warning "VS Code is currently running. Please close it before installation."
        read -p "Close VS Code and continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Installation cancelled."
            exit 0
        fi
    fi
    
    # Download theme
    if ! download_theme "$theme_url" "$temp_file"; then
        exit 1
    fi
    
    # Install theme
    if ! install_theme "$temp_file"; then
        exit 1
    fi
    
    # Configure theme
    configure_theme
    
    # Enable glow effects if requested
    enable_glow_effects
    
    # Show completion message
    echo
    print_colored "$NEON_GREEN" "🎉 SynthWave Dark theme installed successfully!"
    print_colored "$NEON_CYAN" "💡 Restart VS Code to see the changes."
    
    if [[ "$ENABLE_GLOW" == "true" ]]; then
        print_colored "$NEON_PURPLE" "✨ Glow effects are enabled!"
    fi
    
    echo
}

# ===== SCRIPT EXECUTION =====

# Set up error handling
trap cleanup EXIT

# Parse command line arguments
parse_arguments "$@"

# Run main function
main

# End of script