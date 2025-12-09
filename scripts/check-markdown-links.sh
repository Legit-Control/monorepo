#!/bin/bash

# Script to check all markdown files for broken links
# Uses markdown-link-check (must be installed globally: npm install -g markdown-link-check)

set -e

# ============================================================================
# CONFIGURATION
# ============================================================================
# Edit the patterns below to customize which files and links are checked

# Files to exclude from checking (glob patterns)
# Add patterns to exclude specific files or directories
EXCLUDE_FILE_PATTERNS=(
    "*/node_modules/*"
    "*/dist/*"
    "*/.git/*"
    # "*/CHANGELOG.md"  # Uncomment to exclude all CHANGELOG files
    # "*/examples/*"     # Uncomment to exclude examples directory
)

# Links to ignore (regex patterns)
# Links matching these patterns will not be reported as broken
IGNORE_LINK_PATTERNS=(
    "^mailto:core@"
    "^http://localhost"
    "^../../issues$"
    # "^https://example.com/.*"  # Uncomment to ignore specific domain
)

# ============================================================================
# END CONFIGURATION
# ============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;38;2;255;97;26;49m'
NC='\033[0m' # No Color

# Check if markdown-link-check is installed, install if not
if ! command -v markdown-link-check &> /dev/null; then
    echo -e "${YELLOW}markdown-link-check not found. Installing...${NC}"
    npm install -g markdown-link-check
fi

# Build find command with exclude patterns
FIND_ARGS=("." "-name" "*.md")
for pattern in "${EXCLUDE_FILE_PATTERNS[@]}"; do
    FIND_ARGS+=("-not" "-path" "$pattern")
done

# Find all markdown files using the configured patterns
echo -e "${YELLOW}Finding all markdown files...${NC}"
md_files=$(find "${FIND_ARGS[@]}")

if [ -z "$md_files" ]; then
    echo -e "${YELLOW}No markdown files found.${NC}"
    exit 0
fi

# Count files
file_count=$(echo "$md_files" | wc -l | tr -d ' ')
echo -e "${YELLOW}Found $file_count markdown file(s) to check${NC}\n"

# Track failures
failed_files=0
total_errors=0
failed_file_list=()
failed_links_list=()  # Parallel array to store broken links (index matches failed_file_list)

# Check each file
while IFS= read -r file; do
    if [ -f "$file" ]; then
        echo -e "${YELLOW}Checking: $file${NC}"
        
        # Create temporary config file with ignore patterns if any are defined
        if [ ${#IGNORE_LINK_PATTERNS[@]} -gt 0 ]; then
            TEMP_CONFIG=$(mktemp)
            
            # Build mN config with ignore patterns
            echo "{" > "$TEMP_CONFIG"
            echo "  \"ignorePatterns\": [" >> "$TEMP_CONFIG"
            PATTERN_COUNT=${#IGNORE_LINK_PATTERNS[@]}
            for i in "${!IGNORE_LINK_PATTERNS[@]}"; do
                pattern="${IGNORE_LINK_PATTERNS[$i]}"
                echo "    {" >> "$TEMP_CONFIG"
                echo "      \"pattern\": \"$pattern\"" >> "$TEMP_CONFIG"
                if [ $((i + 1)) -lt $PATTERN_COUNT ]; then
                    echo "    }," >> "$TEMP_CONFIG"
                else
                    echo "    }" >> "$TEMP_CONFIG"
                fi
            done
            echo "  ]" >> "$TEMP_CONFIG"
            echo "}" >> "$TEMP_CONFIG"
            
            # Run markdown-link-check with config
            if output=$(markdown-link-check --config "$TEMP_CONFIG" "$file" 2>&1); then
                MLC_SUCCESS=true
            else
                MLC_SUCCESS=false
            fi
            rm -f "$TEMP_CONFIG"
        else
            # Run without config if no ignore patterns
            if output=$(markdown-link-check "$file" 2>&1); then
                MLC_SUCCESS=true
            else
                MLC_SUCCESS=false
            fi
        fi
        
        if [ "$MLC_SUCCESS" = true ]; then
            echo -e "${GREEN}✓ $file - OK${NC}\n"
        else
            echo -e "${RED}✗ $file - FAILED${NC}"
            echo "$output"
            echo ""
            failed_files=$((failed_files + 1))
            failed_file_list+=("$file")
            
            # Extract broken links from output (lines with [✖] pattern)
            # Format: [✖] https://example.com → Status: 404
            broken_links=""
            while IFS= read -r line; do
                if echo "$line" | grep -q '\[\✖\]'; then
                    # Extract the link (everything between [✖] and →)
                    link=$(echo "$line" | sed -E 's/.*\[\✖\]\s+([^→]+)→.*/\1/' | xargs)
                    if [ -n "$link" ]; then
                        if [ -z "$broken_links" ]; then
                            broken_links="$link"
                        else
                            broken_links="$broken_links"$'\n'"$link"
                        fi
                    fi
                fi
            done <<< "$output"
            
            if [ -n "$broken_links" ]; then
                failed_links_list+=("$broken_links")
            else
                failed_links_list+=("")
            fi
            
            # Count errors in output (lines containing "ERROR" or "✖")
            errors=$(echo "$output" | grep -c "ERROR\|✖" || true)
            total_errors=$((total_errors + errors))
        fi
    fi
done <<< "$md_files"

# Summary
echo -e "\n${YELLOW}=== Summary ===${NC}"
echo "Files checked: $file_count"
echo "Files with errors: $failed_files"

# Display list of failed files if any
if [ $failed_files -gt 0 ]; then
    echo -e "\n${RED}Files with broken links:${NC}"
    for i in "${!failed_file_list[@]}"; do
        failed_file="${failed_file_list[$i]}"
        broken_links="${failed_links_list[$i]}"
        echo -e "${RED}  - $failed_file${NC}"
        # Display broken links for this file if available
        if [ -n "$broken_links" ]; then
            echo "$broken_links" | while IFS= read -r link; do
                if [ -n "$link" ]; then
                    echo -e "${RED}    → $link${NC}"
                fi
            done
        fi
    done
fi

if [ $failed_files -eq 0 ]; then
    echo -e "${GREEN}All links are valid! ✓${NC}"
    exit 0
else
    echo -e "${RED}Found broken links in $failed_files file(s)${NC}"
    exit 1
fi

