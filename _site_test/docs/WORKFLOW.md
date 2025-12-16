# Website Development Workflow

## Branch Strategy

- `main`: Production branch - changes here are automatically deployed to the live site
- `dev`: Development branch for ongoing work and testing
- Feature branches: Create from `dev` for specific updates (e.g., `feature/new-member-page`)

## Basic Development Process

1. **Start in the development branch**

   ```
   git checkout dev
   git pull origin dev  # Make sure you have the latest changes
   ```

2. **Make your changes**

   - Update content files
   - Add new members, publications, or news items
   - Test locally if possible using Jekyll's local server:
     ```
     bundle exec jekyll serve
     ```
   - View the local site at http://localhost:4000

3. **Commit your changes with descriptive messages**

   ```
   git add .
   git commit -m "Add description of what you changed"
   ```

4. **Push to GitHub**

   ```
   git push origin dev
   ```

5. **Create a pull request when ready to deploy**
   - Go to GitHub repository
   - Create a PR from `dev` to `main`
   - Describe your changes
   - Wait for the automated checks to complete
   - Merge after review

## Working with Issues

1. **Creating an issue**

   - Go to the "Issues" tab in GitHub
   - Click "New issue"
   - Choose an issue template (Bug report or Content update)
   - Fill in the required information
   - Submit the issue

2. **Working on an issue**
   - Assign yourself to the issue
   - Reference the issue number in your commit messages:
     ```
     git commit -m "Add new team member photo (fixes #42)"
     ```

## Content Organization

- `_data/`: Centralized data files (members, publications)
- `assets/member_photos/`: Team member photos
- `assets/gallery/`: Gallery images
- `_scripts/`: Automation scripts

## Common Tasks

### Adding a New Team Member

1. Add their photo to `assets/member_photos/`
2. Create or update their data in the appropriate files
3. Add them to the correct navigation list in `_includes/`

### Adding a Publication

1. Add the publication to `_bibliography/publications.bib`
2. Run the generation script: `python3 _scripts/generate_publications.py`
3. Commit both the updated BibTeX file and the generated files

### Adding a News Post

1. Create a new file in `_posts/` with the format `YYYY-MM-DD-title.md`
2. Add required front matter and content
3. Add any related images to `assets/images/`

## Getting Help

If you encounter issues or need assistance:

1. Check the documentation in the `docs/` directory
2. Create an issue on GitHub describing your problem
3. Ask a team member for guidance
