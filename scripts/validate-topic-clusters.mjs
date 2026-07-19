import { blogArticles } from '../src/blogData.js';
import { pillarPages } from '../src/authorityData.js';
import { topicClusters } from '../src/topicClusters.js';

const errors = [];
const expectedSlugs = [
  'oem-manufacturing',
  'pet-training-pads',
  'adult-underpads',
  'dog-poop-bags',
  'private-label',
  'customization',
  'quality-control',
  'factory-audit',
  'packaging',
  'shipping',
  'materials',
  'sap-technology',
  'pe-film',
  'import-guide',
  'industry-insights',
];

const wordCount = (page) =>
  page.sections.flatMap((section) => section.paragraphs).join(' ').trim().split(/\s+/).filter(Boolean).length;

if (topicClusters.length !== 15) {
  errors.push(`Expected 15 topic clusters, found ${topicClusters.length}.`);
}

expectedSlugs.forEach((slug) => {
  if (!topicClusters.some((cluster) => cluster.slug === slug)) {
    errors.push(`Missing required topic cluster: ${slug}.`);
  }
});

if (pillarPages.length !== 15) {
  errors.push(`Expected 15 pillar pages, found ${pillarPages.length}.`);
}

pillarPages.forEach((page) => {
  const words = wordCount(page);

  if (words < 4000 || words > 6000) {
    errors.push(`${page.path} has ${words} words; expected 4,000-6,000.`);
  }
  if (!page.articles.length) {
    errors.push(`${page.path} has no connected child articles.`);
  }
  if (!page.faqs.length || !page.sections.some((section) => section.comparisonRows)) {
    errors.push(`${page.path} is missing FAQs or a comparison table.`);
  }
});

const connectedArticleSlugs = pillarPages.flatMap((page) => page.articles.map((article) => article.slug));
const connectedSet = new Set(connectedArticleSlugs);

if (connectedArticleSlugs.length !== blogArticles.length || connectedSet.size !== blogArticles.length) {
  errors.push(
    `Expected every article to connect once; found ${connectedArticleSlugs.length} connections for ${blogArticles.length} articles.`,
  );
}

if (errors.length) {
  console.error('Topic-cluster validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Topic-cluster validation passed: 15 pillar pages and ${blogArticles.length} connected articles.`);
