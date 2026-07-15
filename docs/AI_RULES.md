# AI Development Rules

## General Rules
- Do not modify website source code unless the task explicitly asks for implementation.
- Inspect existing files before editing.
- Preserve user-created changes.
- Keep edits tightly scoped.
- Do not remove existing functionality without approval.
- Do not change layout, animation, image assets, or copy unless requested.
- Run build checks after code, dependency, routing, or SEO infrastructure changes.

## Coding Standards
- Use React and Vite conventions already present in the project.
- Keep components readable and practical.
- Prefer structured arrays or objects for repeated content.
- Avoid unnecessary abstraction.
- Avoid duplicate constants and route definitions when a shared source is available.
- Keep comments brief and useful.
- Use clear function and variable names.
- Do not commit `node_modules`, `dist`, `.env`, `.vercel`, or raw oversized local media.

## Naming Conventions
- Files: use lowercase descriptive names where possible.
- React components: use PascalCase.
- Constants and arrays: use camelCase.
- Routes: use lowercase kebab-case.
- CSS classes: use descriptive kebab-case.
- Image names: use descriptive kebab-case and include purpose or subject.

## SEO Standards
Every public page should have:

- Unique title.
- Unique meta description.
- Canonical URL.
- Open Graph title, description, image, type, and URL.
- Twitter Card metadata.
- Relevant H1.
- Clear internal links.
- Structured data where applicable.
- Image alt text.
- Indexable URL unless intentionally private.

Avoid:

- Duplicate metadata.
- Thin pages.
- Keyword stuffing.
- Unsupported claims.
- Pages that exist only for search engines without buyer value.

## Technical SEO Standards
- Maintain valid `robots.txt`.
- Maintain automatic `sitemap.xml`.
- Use HTTPS absolute URLs in sitemap and canonical tags.
- Do not let Vercel SPA rewrites return HTML for XML files.
- Keep schema valid JSON-LD.
- Include Organization and WebSite schema globally.
- Include Breadcrumb schema for important pages.
- Include FAQ schema where actual FAQ content exists.

## Content Standards
Use professional B2B language:

- Source factory
- OEM/ODM manufacturing
- Private-label support
- Product planning
- Sample development
- Absorbent core structure
- Quality control
- Production coordination
- Export-oriented supply

Avoid risky or exaggerated language:

- Absolute guarantees.
- Unsupported superiority claims.
- Medical claims.
- Overpromising delivery, quality, performance, or certification.
- Consumer-style hype.

## UI Consistency Rules
- Keep the premium dark green visual system.
- Use consistent spacing, radius, and button hierarchy.
- Avoid template-like sections.
- Avoid random color additions.
- Keep CTAs visually consistent.
- Maintain desktop-first composition with responsive support.
- Do not add cards inside cards unless necessary.
- Keep typography clean and intentional.

## Accessibility Rules
- Use semantic HTML where possible.
- Maintain readable contrast.
- Provide useful image alt text.
- Ensure links and buttons have understandable labels.
- Avoid relying only on color to communicate meaning.
- Preserve keyboard-accessible links and form controls.
- Do not hide essential information behind motion.

## Performance Rules
- Keep large videos compressed or externally hosted.
- Use appropriate image formats and dimensions.
- Avoid unnecessary JavaScript dependencies.
- Lazy-load heavy visual effects where practical.
- Preserve build stability.
- Monitor large bundle warnings.
- Do not upload raw oversized assets unless required.

## Quality Standards
Before completing technical work:

- Confirm the intended files changed.
- Run `npm run build` when relevant.
- Check routing if routes changed.
- Check SEO output if metadata, sitemap, or schema changed.
- Verify deployed URLs when deployment is part of the task.
- Report warnings separately from errors.

