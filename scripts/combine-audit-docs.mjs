import fs from 'fs';
import path from 'path';

const AUDIT_DIR = path.resolve('docs/audit');

const ORDERED_FILES = [
  { file: 'PROJECT_OVERVIEW.md', title: 'Part 1: Project Overview & System Architecture' },
  { file: 'FUNCTIONAL_AUDIT.md', title: 'Part 2: Complete E-Commerce Functionality Audit' },
  { file: 'JEWELRY_COMMERCE_AUDIT.md', title: 'Part 3: Jewelry-Specific Commerce & Regulatory Audit' },
  { file: 'UI_UX_AUDIT.md', title: 'Part 4: UI/UX Visual & Multi-Viewport Audit' },
  { file: 'TESTING_TOOLING_AND_AUTOMATION_REPORT.md', title: 'Part 5: Automated Testing Tooling & Setup' },
  { file: 'SECURITY_AUDIT.md', title: 'Part 6: Security Audit, Threat Model & Compliance' },
  { file: 'SEO_AUDIT.md', title: 'Part 7: SEO & Discoverability Audit' },
  { file: 'PERFORMANCE_AUDIT.md', title: 'Part 8: Performance & Core Web Vitals Audit' },
  { file: 'PRODUCTION_READINESS.md', title: 'Part 9: Domain, Hosting & Production Readiness' },
  { file: 'TEST_RESULTS.md', title: 'Part 10: Master Test Execution Results' },
  { file: 'MASTER_ACTION_PLAN.md', title: 'Part 11: Master Pre-Launch Action Plan & Roadmap' }
];

let masterContent = `# Ambika Jewels — Master Consolidated Pre-Launch E-Commerce Audit

**Website:** [ambikajewelsonline.com](https://ambikajewelsonline.com)  
**Registered Showroom:** Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013, India  
**Date of Audit:** November 5, 2026  
**Consolidated Document:** All pre-launch audit markdown reports combined into a single unified reference.

---

## Master Table of Contents

`;

ORDERED_FILES.forEach((item, idx) => {
  const anchor = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  masterContent += `${idx + 1}. [${item.title}](#${anchor})\n`;
});

masterContent += `\n---\n\n`;

ORDERED_FILES.forEach((item, idx) => {
  const filePath = path.join(AUDIT_DIR, item.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    masterContent += `\n\n# ${item.title}\n\n`;
    masterContent += `> Source Report: \`docs/audit/${item.file}\`\n\n`;
    masterContent += content;
    masterContent += `\n\n---\n\n`;
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

// Output targets
const TARGETS = [
  path.resolve('docs/audit/COMBINED_AUDIT_REPORT.md'),
  path.resolve('docs/audit/ALL_IN_ONE_AUDIT.md'),
  path.resolve('audio/COMBINED_AUDIT_REPORT.md'),
  path.resolve('audio/ALL_IN_ONE_AUDIT.md')
];

TARGETS.forEach(target => {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(target, masterContent, 'utf-8');
  console.log(`✓ Wrote combined audit to ${target} (${masterContent.length} bytes)`);
});

