import { chromium } from 'playwright';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

interface ProjectData {
  title: string;
  previewData?: {
    type: string;
    liveUrl?: string;
    screenshots?: string[];
  };
}

const SCREENSHOT_DIR = join(process.cwd(), 'public', 'screenshots');
const PROJECTS_DIR = join(process.cwd(), 'src', 'content', 'projects');
const TIMEOUT = parseInt(process.env.SCREENSHOT_TIMEOUT || '30000', 10);
const VIEWPORTS = [
  { width: 1280, height: 720, suffix: '1280' },
  { width: 1920, height: 1080, suffix: '1920' },
];

async function ensureScreenshotDir(): Promise<void> {
  if (!existsSync(SCREENSHOT_DIR)) {
    await mkdir(SCREENSHOT_DIR, { recursive: true });
    console.log(`✓ Created screenshot directory: ${SCREENSHOT_DIR}`);
  }
}

async function loadProject(filename: string): Promise<{ slug: string; data: ProjectData } | null> {
  try {
    const slug = filename.replace('.json', '');
    const filePath = join(PROJECTS_DIR, filename);
    const content = await import(filePath, { assert: { type: 'json' } });
    return { slug, data: content.default };
  } catch (error) {
    console.error(`✗ Failed to load project ${filename}:`, error);
    return null;
  }
}

async function captureScreenshots(slug: string, liveUrl: string): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();

    for (const viewport of VIEWPORTS) {
      try {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(liveUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });

        const filename = `${slug}-${viewport.suffix}.webp`;
        const filepath = join(SCREENSHOT_DIR, filename);
        await page.screenshot({ path: filepath, type: 'png' });
        console.log(`  ✓ Captured ${filename}`);
      } catch (error) {
        console.error(`  ✗ Failed to capture ${slug}-${viewport.suffix}.webp:`, error instanceof Error ? error.message : error);
      }
    }
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  const projectArg = process.argv.find(arg => arg.startsWith('--project='))?.split('=')[1];

  await ensureScreenshotDir();

  try {
    const files = await readdir(PROJECTS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log('No projects found.');
      process.exit(0);
    }

    const projectsWithUrls: Array<{ slug: string; liveUrl: string }> = [];

    for (const file of jsonFiles) {
      const project = await loadProject(file);
      if (!project) continue;

      const { slug, data } = project;
      const previewData = data.previewData;
      const hasLiveUrl = previewData && previewData.type === 'browser' && previewData.liveUrl;

      if (hasLiveUrl && previewData && previewData.liveUrl) {
        projectsWithUrls.push({ slug, liveUrl: previewData.liveUrl });
      }
    }

    if (projectsWithUrls.length === 0) {
      console.log('No projects with live URLs found. Add liveUrl to previewData for browser projects.');
      process.exit(0);
    }

    const targetProjects = projectArg
      ? projectsWithUrls.filter(p => p.slug === projectArg)
      : projectsWithUrls;

    if (projectArg && targetProjects.length === 0) {
      console.error(`Project "${projectArg}" not found or has no liveUrl.`);
      process.exit(1);
    }

    console.log(`Capturing screenshots for ${targetProjects.length} project(s)...\n`);

    for (const { slug, liveUrl } of targetProjects) {
      console.log(`📸 ${slug}`);
      await captureScreenshots(slug, liveUrl);
    }

    console.log('\n✓ Screenshot capture complete.');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
