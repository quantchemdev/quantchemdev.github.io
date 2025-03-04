# Website Directory Structure

## Key Directories

- `_data/`: Contains data files

  - `members.yml`: Information about team members
  - `publications.yml`: Publication data

- `assets/`: Contains all media files

  - `css/`: Stylesheets
  - `js/`: JavaScript files
  - `images/`: General images
  - `member_photos/`: Team member photos
  - `gallery/`: Gallery images

- `_includes/`: Reusable HTML components

  - `nav.html`: Navigation menu
  - `alumni_list.html`, `phd_list.html`, etc.: Member list components

- `_layouts/`: Page templates

  - `default.html`: Base template
  - `member.html`: Member profile template
  - `post.html`: Blog post template

- `_scripts/`: Automation scripts

  - `generate_publications.py`: Script to generate publication pages

- `.github/`: GitHub specific files

  - `ISSUE_TEMPLATE/`: Templates for creating issues
  - `workflows/`: GitHub Actions configuration

- `docs/`: Documentation
  - `WORKFLOW.md`: Development workflow guide
  - `MAINTENANCE.md`: Guide for site maintenance
