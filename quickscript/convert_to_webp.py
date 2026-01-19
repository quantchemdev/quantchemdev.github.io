#!/usr/bin/env python3
"""
Convert all gallery images to WebP format
Works with any number of images in assets/gallery/
"""

import os
from PIL import Image
import yaml

def convert_to_webp(input_path, max_width=1920, quality=80):
    """Convert any image to optimized WebP"""
    try:
        with Image.open(input_path) as img:
            orig_size = os.path.getsize(input_path)
            
            # Convert to RGB
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
        print(f"❌ Error processing {input_path}: {str(e)}")
        return None, None, None, None

def update_yaml(file_mappings):
    """Update YAML with new filenames"""
    yaml_path = "_data/gallery/items.yml"
    
    if not os.path.exists(yaml_path):
        print(f"⚠️  YAML file not found: {yaml_path}")
        return 0
    
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
        with open(yaml_path, "w") as f:
            yaml.dump(entries, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
    
    return changes

def main():
    print("🖼️  Gallery WebP Converter")
    print("=" * 60)
    print()
    
    gallery_dir = "assets/gallery"
    
    if not os.path.exists(gallery_dir):
        print(f"❌ Directory not found: {gallery_dir}")
        print("Run this script from the root of your repository!")
        return
    
    # Find all images
    image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.JPG', '.JPEG', '.PNG', '.GIF')
    files = [f for f in os.listdir(gallery_dir) if f.lower().endswith(image_extensions)]
    
    if not files:
        print("No images found to convert!")
        return
    
    print(f"Found {len(files)} images to convert")
    print()
    
    total_orig = 0
    total_new = 0
    converted_count = 0
    file_mappings = {}
    
    # Convert each image
    for i, filename in enumerate(sorted(files), 1):
        input_path = os.path.join(gallery_dir, filename)
        
        print(f"[{i}/{len(files)}] {filename}")
        
        output_path, orig_size, new_size, reduction = convert_to_webp(input_path)
        
        if output_path:
            print(f"   {orig_size / 1024:.1f} KB → {new_size / 1024:.1f} KB ({reduction:.1f}% reduction)")
            
            # Delete original if different
            if input_path != output_path:
                os.remove(input_path)
                
                old_filename = filename
                new_filename = os.path.basename(output_path)
                file_mappings[old_filename] = new_filename
            
            total_orig += orig_size
            total_new += new_size
            converted_count += 1
            print(f"   ✅ Converted to WebP")
        print()
    
    # Summary
    print("=" * 60)
    print(f"✅ Converted {converted_count}/{len(files)} images")
    
    if total_orig > 0:
        total_reduction = ((total_orig - total_new) / total_orig) * 100
        print(f"📊 Total: {total_orig / (1024*1024):.1f} MB → {total_new / (1024*1024):.1f} MB")
        print(f"💾 Saved: {(total_orig - total_new) / (1024*1024):.1f} MB ({total_reduction:.1f}%)")
    
    # Update YAML
    if file_mappings:
        print()
        print("Updating YAML file...")
        print("-" * 60)
        changes = update_yaml(file_mappings)
        
        if changes > 0:
            print(f"\n✅ Updated {changes} filenames in _data/gallery/items.yml")
        else:
            print("\nℹ️  No YAML updates needed")
    
    print()
    print("=" * 60)
    print("Next steps:")
    print("1. Test: bundle exec jekyll serve")
    print("2. Commit: git add assets/gallery/ _data/gallery/items.yml")
    print("3. Commit: git commit -m 'Convert gallery images to WebP'")
    print("4. Push: git push")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
