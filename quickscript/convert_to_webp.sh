#!/bin/bash
# Convert ALL gallery images to WebP format
# Works with any number of images

echo "🖼️  Gallery WebP Converter"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -d "assets/gallery" ]; then
    echo "❌ Error: assets/gallery directory not found"
    echo "Please run this script from the root of your repository!"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is required"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install --quiet Pillow pyyaml 2>/dev/null || {
    echo "Installing Pillow and PyYAML..."
    pip3 install Pillow pyyaml
}

echo ""
echo "Step 1: Converting images to WebP..."
echo "-------------------------------------"

# Run conversion
python3 - << 'CONVERT_SCRIPT'
import os
from PIL import Image
import yaml

def convert_to_webp(input_path, max_width=1920, quality=80):
    """Convert any image to optimized WebP"""
    try:
        with Image.open(input_path) as img:
            orig_size = os.path.getsize(input_path)
            
            # Convert to RGB if needed
            if img.mode in ('RGBA', 'P', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Create output path
            name_without_ext = os.path.splitext(input_path)[0]
            output_path = f"{name_without_ext}.webp"
            
            # Save as WebP
            img.save(output_path, format='WebP', quality=quality, method=6)
            
            new_size = os.path.getsize(output_path)
            reduction = ((orig_size - new_size) / orig_size) * 100
            
            return output_path, orig_size, new_size, reduction
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None, None, None, None

# Find all images
gallery_dir = "assets/gallery"
image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.JPG', '.JPEG', '.PNG', '.GIF')
files = [f for f in os.listdir(gallery_dir) if f.lower().endswith(image_extensions)]

if not files:
    print("No images found to convert!")
    exit(0)

print(f"Found {len(files)} images to convert")
print("")

total_orig = 0
total_new = 0
converted_count = 0
file_mappings = {}  # old filename -> new filename

for i, filename in enumerate(sorted(files), 1):
    input_path = os.path.join(gallery_dir, filename)
    
    print(f"[{i}/{len(files)}] {filename}")
    
    output_path, orig_size, new_size, reduction = convert_to_webp(input_path)
    
    if output_path:
        print(f"   {orig_size / 1024:.1f} KB → {new_size / 1024:.1f} KB ({reduction:.1f}% reduction)")
        
        # Delete original if different from output
        if input_path != output_path:
            os.remove(input_path)
            
            # Track mapping
            old_filename = filename
            new_filename = os.path.basename(output_path)
            file_mappings[old_filename] = new_filename
        
        total_orig += orig_size
        total_new += new_size
        converted_count += 1
        print(f"   ✅ Converted to WebP")
    print("")

print("=" * 50)
print(f"✅ Converted {converted_count}/{len(files)} images")
if total_orig > 0:
    total_reduction = ((total_orig - total_new) / total_orig) * 100
    print(f"📊 Total: {total_orig / (1024*1024):.1f} MB → {total_new / (1024*1024):.1f} MB")
    print(f"💾 Saved: {(total_orig - total_new) / (1024*1024):.1f} MB ({total_reduction:.1f}%)")

# Save mappings for YAML update
if file_mappings:
    with open('/tmp/file_mappings.yaml', 'w') as f:
        yaml.dump(file_mappings, f)

CONVERT_SCRIPT

echo ""
echo "Step 2: Updating YAML file..."
echo "-------------------------------------"

# Update YAML
python3 - << 'YAML_SCRIPT'
import yaml
import os

# Load mappings
mappings_file = '/tmp/file_mappings.yaml'
if not os.path.exists(mappings_file):
    print("ℹ️  No filename mappings needed")
    exit(0)

with open(mappings_file, 'r') as f:
    file_mappings = yaml.safe_load(f) or {}

if not file_mappings:
    print("ℹ️  No filename mappings needed")
    exit(0)

# Load gallery YAML
yaml_path = "_data/gallery/items.yml"
with open(yaml_path, "r") as f:
    entries = yaml.safe_load(f) or []

changes = 0
for entry in entries:
    old_filename = entry.get("filename", "")
    
    if old_filename in file_mappings:
        new_filename = file_mappings[old_filename]
        print(f"   {old_filename} → {new_filename}")
        entry["filename"] = new_filename
        changes += 1

if changes > 0:
    # Save updated YAML
    with open(yaml_path, "w") as f:
        yaml.dump(entries, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
    print(f"\n✅ Updated {changes} filenames in YAML")
else:
    print("ℹ️  No YAML updates needed")

# Cleanup
os.remove(mappings_file)

YAML_SCRIPT

echo ""
echo "======================================"
echo "✅ Conversion complete!"
echo ""
echo "Next steps:"
echo "1. Review changes: git status"
echo "2. Test locally: bundle exec jekyll serve"
echo "3. If all looks good:"
echo "   git add assets/gallery/ _data/gallery/items.yml"
echo "   git commit -m 'Convert gallery images to WebP'"
echo "   git push"
