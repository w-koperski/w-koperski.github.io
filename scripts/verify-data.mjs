#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, '../src/content/projects');

// Category to expected tech stack keywords mapping
const categoryTechStackRules = {
  'rust-cli': ['Rust', 'clap', 'tokio', 'serde', 'walkdir'],
  'python-cli': ['Python'],
  'vue-spa': ['Vue'],
  'react-spa': ['React'],
  'laravel-api': ['Laravel', 'PHP'],
  'csharp-api': ['C#', '.NET', 'ASP.NET'],
  'cpp': ['C++'],
  'python-ml': ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn'],
};

function checkTechStackMatch(category, techStack) {
  const keywords = categoryTechStackRules[category];
  if (!keywords) {
    return { match: false, reason: `Unknown category: ${category}` };
  }

  const hasMatch = keywords.some(keyword =>
    techStack.some(tech => tech.includes(keyword))
  );

  if (!hasMatch) {
    return {
      match: false,
      reason: `No match found. Expected one of: ${keywords.join(', ')}. Got: ${techStack.join(', ')}`,
    };
  }

  return { match: true };
}

async function verifyData() {
  try {
    const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
      console.error('FAIL: No project JSON files found');
      process.exit(1);
    }

    const results = [];
    const failures = [];

    for (const file of files) {
      const filePath = path.join(projectsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const project = JSON.parse(content);

      const check = checkTechStackMatch(project.category, project.techStack);

      results.push({
        file,
        title: project.title,
        category: project.category,
        techStack: project.techStack,
        ...check,
      });

      if (!check.match) {
        failures.push({
          file,
          title: project.title,
          category: project.category,
          techStack: project.techStack,
          reason: check.reason,
        });
      }
    }

    if (failures.length > 0) {
      console.error('FAIL: category↔techStack inconsistencies found:\n');
      failures.forEach(f => {
        console.error(`  ${f.file} (${f.title})`);
        console.error(`    Category: ${f.category}`);
        console.error(`    TechStack: ${f.techStack.join(', ')}`);
        console.error(`    Issue: ${f.reason}\n`);
      });
      process.exit(1);
    }

    console.log(`PASS: all ${results.length} projects have consistent category↔techStack mapping`);
    process.exit(0);
  } catch (error) {
    console.error('FAIL: Error during verification:', error.message);
    process.exit(1);
  }
}

verifyData();
