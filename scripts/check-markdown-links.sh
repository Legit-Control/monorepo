#!/bin/bash

# Script to check all markdown files for broken links
# Uses markdown-link-check (must be installed globally: npm install -g markdown-link-check)

set -e

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

# Find all markdown files, excluding node_modules and dist directories
echo -e "${YELLOW}Finding all markdown files...${NC}"
md_files=$(find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.git/*")

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
        
        # Run markdown-link-check and capture output and exit code
        if output=$(markdown-link-check "$file" 2>&1); then
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

