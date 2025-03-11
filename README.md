# Quantum Chemistry Development Group Website

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-brightgreen)](https://quantchemdev.github.io)
[![Jekyll](https://img.shields.io/badge/Built%20with-Jekyll-red)](https://jekyllrb.com/)

This repository contains the source code for the [Quantum Chemistry Development Group](https://quantchemdev.github.io) website based at the Donostia International Physics Center (DIPC).

## Project Overview

The Quantum Chemistry Development Group website serves as the central hub for showcasing our research, team members, publications, and resources in quantum chemistry development and computational chemistry. The site is built with Jekyll and hosted on GitHub Pages, combining a clean, professional design with an efficient content management system.

### Project Goals

- Maintain an up-to-date, visually engaging group webpage
- Establish sustainable update workflows using git-based development processes
- Leverage GitHub capabilities for collaboration
- Automate repetitive content updates where possible
- Enable both technical and non-technical team members to contribute content

## Repository Structure

```
group-webpage/
├── .github/                  # GitHub configurations and templates
├── _data/                    # Structured data files for members and publications
├── _scripts/                 # Automation scripts for content generation
├── _includes/                # Reusable HTML components
│   ├── nav.html              # Navigation bar
│   ├── alumni_list.html      # List of alumni members
│   └── ...
├── _layouts/                 # Page templates
│   ├── default.html          # Base layout
│   ├── member.html           # Member profile layout
│   └── ...
├── _members/                 # Member profile pages
├── _publications/            # Publication pages (auto-generated)
├── _bibliography/            # Bibliography data in BibTeX format
│   └── publications.bib      # Source data for publications
├── assets/                   # Static assets
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   ├── images/               # General images
│   ├── member_photos/        # Team member photos
│   └── gallery/              # Gallery images
├── _config.yml               # Jekyll configuration
└── various HTML pages        # Content pages
```

## Getting Started

### Prerequisites

- Git
- Ruby (2.7.0 or higher recommended)
- Bundler gem
- Python 3.6+ (for automation scripts)

### Local Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/quantchemdev/quantchemdev.github.io.git
   cd quantchemdev.github.io
   ```

2. Install dependencies
   ```bash
   bundle install
   ```

3. Run the Jekyll site locally
   ```bash
   bundle exec jekyll serve
   ```

4. View the site at `http://localhost:4000`

## Development Workflow

We follow a structured, git-based workflow:

1. **Branch Strategy**
   - `main`: Production branch, auto-deploys to GitHub Pages
   - `dev`: Development branch for ongoing work
   - Feature branches: `feature/brief-description`
   - Content branches: `content/section-name`
   - Hotfix branches: `hotfix/issue-description`

2. **Making Changes**
   - Create a new branch from `dev` for your changes
   - Make your changes locally and test them
   - Commit with descriptive messages
   - Push your branch and create a pull request to `dev`
   - After review, changes will be merged to `dev` then to `main`

3. **Content Updates**
   - For simple content updates, use the `content/` branch prefix
   - For larger features or technical changes, use the `feature/` prefix
   - Reference related issues in commit messages with `#issue-number`

## Common Tasks

### Adding/Updating Team Members

1. Create or edit the appropriate YAML file in `_data/`
2. Add member photo to `assets/member_photos/`
3. Run the member generation script:
   ```bash
   python _scripts/generate_members.py
   ```
4. Update navigation lists in `_includes/` if needed

### Adding Publications

1. Add new entries to `_bibliography/publications.bib`
2. Run the publication generation script:
   ```bash
   python _scripts/generate_publications.py
   ```

### Adding News/Blog Posts

1. Create a new file in `_posts/` with format `YYYY-MM-DD-title.md`
2. Add required front matter (layout, title, featured image)
3. Add associated images to `assets/images/`
4. Write your content using Markdown

## Technology Stack

- **Jekyll**: Static site generator
- **HTML5/CSS3**: Core web technologies
- **GitHub Pages**: Hosting platform
- **Python**: Automation scripts
- **GitHub Actions**: CI/CD pipeline (planned)

## Data Privacy

All member personal information (photos, names, contacts) from this website cannot be used by anyone outside of our group without contacting us and requesting permission.

## Contributing

We welcome contributions to improve the website! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to make contributions.

## Maintenance

For detailed information on maintaining and updating the website, please refer to our [MAINTENANCE.md](MAINTENANCE.md) guide.

## Contact

For questions or suggestions, please contact:
- **Email**: quantchemdev@gmail.com
- **Location**: Donostia International Physics Center (DIPC), San Sebastian, Spain

## Acknowledgments

This website was built by forking and extensively modifying the [Horizons Jekyll Theme](https://github.com/old-jekyll-templates/Horizons-Jekyll-Theme).