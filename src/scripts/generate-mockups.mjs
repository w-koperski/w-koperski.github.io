import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, '../content/projects');
const mockupsDir = path.join(__dirname, '../../public/mockups');

// Ensure mockups directory exists
if (!fs.existsSync(mockupsDir)) {
  fs.mkdirSync(mockupsDir, { recursive: true });
}

// Helper to convert title to slug
function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

// Helper to escape XML/SVG special characters
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate SVG mockup for a project
function generateMockup(project) {
  const { title, categoryEmoji, description, techStack } = project;
  
  // Get English description or fallback to Polish
  const desc = typeof description === 'string' 
    ? description 
    : (description.en || description.pl || '');
  
  const descPreview = desc.substring(0, 55).replace(/\s+$/, '');
  const slug = titleToSlug(title);
  const tech = techStack.slice(0, 3).join(' | ');
  
  const svg = `<svg width="640" height="360" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="640" height="360" fill="#0A0A0A"/>
  
  <!-- Title bar -->
  <rect x="0" y="0" width="640" height="32" fill="#1F2937"/>
  <circle cx="16" cy="16" r="6" fill="#EF4444"/>
  <circle cx="36" cy="16" r="6" fill="#F59E0B"/>
  <circle cx="56" cy="16" r="6" fill="#4AF626"/>
  <text x="320" y="20" fill="#9CA3AF" font-size="12" text-anchor="middle" font-family="monospace" font-weight="500">${escapeXml(title)}</text>
  
  <!-- Terminal content area -->
  <rect x="0" y="32" width="640" height="328" fill="#0A0A0A"/>
  
  <!-- Prompt line 1 -->
  <text x="16" y="60" fill="#4AF626" font-size="14" font-family="monospace" font-weight="500">$ ${categoryEmoji} ./${slug}</text>
  
  <!-- Description -->
  <text x="16" y="90" fill="#E5E7EB" font-size="13" font-family="monospace">${escapeXml(descPreview)}</text>
  
  <!-- Tech stack label -->
  <text x="16" y="120" fill="#9CA3AF" font-size="12" font-family="monospace">Stack: ${escapeXml(tech)}</text>
  
  <!-- Decorative separator -->
  <text x="16" y="160" fill="#1F2937" font-size="12" font-family="monospace">────────────────────────────────────</text>
  
  <!-- Cursor -->
  <text x="16" y="185" fill="#4AF626" font-size="14" font-family="monospace" font-weight="500">$ ▌</text>
</svg>`;

  return svg;
}

// Main execution
async function main() {
  try {
    const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} project files`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      try {
        const filePath = path.join(projectsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const project = JSON.parse(content);
        
        // Generate mockup
        const svg = generateMockup(project);
        const slug = titleToSlug(project.title);
        const outputPath = path.join(mockupsDir, `${slug}.svg`);
        
        // Write SVG
        fs.writeFileSync(outputPath, svg, 'utf-8');
        
        // Update project JSON with screenshot path
        project.screenshot = `/mockups/${slug}.svg`;
        fs.writeFileSync(filePath, JSON.stringify(project, null, 2) + '\n', 'utf-8');
        
        console.log(`✓ ${project.title}`);
        successCount++;
      } catch (err) {
        console.error(`✗ Error processing ${file}:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n✓ Generated ${successCount} mockups`);
    if (errorCount > 0) {
      console.log(`⚠ ${errorCount} errors encountered`);
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

main();
