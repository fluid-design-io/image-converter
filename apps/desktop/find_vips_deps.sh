#!/usr/bin/env bash

echo "--- Finding all required libraries for libvips... ---"

# This script uses a simple "to-do" list to find all nested dependencies.
# It is more robust than the previous recursive version.

# Start with the main library your app depends on.
declare -a todo_list=("/opt/homebrew/lib/libvips.dylib")

# This will hold our final, unique list of all libraries.
declare -A final_list

# Keep looping as long as there are libraries in our to-do list.
while [ ${#todo_list[@]} -gt 0 ]; do
    # Get the next library to check.
    lib_path=${todo_list[0]}
    
    # Remove it from the to-do list.
    todo_list=("${todo_list[@]:1}")

    # Clean up the path by removing trailing colon if present
    lib_path=$(echo "$lib_path" | sed 's/:$//')

    # If we've already processed this library, skip it.
    if [[ ${final_list[$lib_path]} ]]; then
        continue
    fi
    
    # Mark this library as found and add it to our final list.
    final_list[$lib_path]=1

    # Now, find all of its dependencies that live in Homebrew.
    # The '|| true' prevents the script from exiting if otool fails on a bad file.
    deps=$(otool -L "$lib_path" 2>/dev/null | grep '/opt/homebrew/' | awk '{print $1}' | sed 's/:$//' || true)

    # Add each new dependency to the end of our to-do list.
    for dep in $deps; do
        # Skip if this dependency is already in our final list
        if [[ ! ${final_list[$dep]} ]]; then
            todo_list+=("$dep")
        fi
    done
done

# Function to copy libraries to destination folder
copy_libraries() {
    local dest_folder="$1"
    
    if [[ -z "$dest_folder" ]]; then
        echo "Error: Please specify a destination folder"
        echo "Usage: $0 [copy <destination_folder>]"
        exit 1
    fi
    
    # Create destination folder if it doesn't exist
    mkdir -p "$dest_folder"
    
    echo ""
    echo "--- Copying libraries to $dest_folder ---"
    
    local copied_count=0
    local failed_count=0
    
    for lib in "${!final_list[@]}"; do
        if [[ -f "$lib" ]]; then
            if cp "$lib" "$dest_folder/"; then
                echo "✓ Copied: $(basename "$lib")"
                ((copied_count++))
            else
                echo "✗ Failed to copy: $(basename "$lib")"
                ((failed_count++))
            fi
        else
            echo "✗ File not found: $lib"
            ((failed_count++))
        fi
    done
    
    echo ""
    echo "--- Copy Summary ---"
    echo "Successfully copied: $copied_count libraries"
    echo "Failed to copy: $failed_count libraries"
    echo "Destination: $dest_folder"
}

# Check command line arguments
if [[ "$1" == "copy" ]]; then
    copy_libraries "$2"
else
    echo ""
    echo "--- COMPLETE DEPENDENCY LIST ---"
    echo "Add all of these files to your 'Copy Files' build phase in Xcode:"
    echo ""

    # Print the sorted list of found libraries.
    printf "%s\n" "${!final_list[@]}" | sort

    echo ""
    echo "--- End of list ---"
    echo ""
    echo "To copy all libraries to a folder, run:"
    echo "  $0 copy <destination_folder>"
fi