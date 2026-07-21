import { blogArticles, getRelatedBlogArticles } from '../src/blogData.js';
import {
  authorityPages,
  caseStudyPages,
  comparisonPages,
  pillarPages,
} from '../src/authorityData.js';
import { factoryPages } from '../src/factoryData.js';
import { ecosystemBlogArticles } from '../src/contentEcosystemBlogData.js';
import {
  buyerGuidePages,
  ecosystemCaseStudyPages,
  ecosystemComparisonPages,
  ecosystemFactoryPages,
  faqLandingPages,
  industryReportPages,
  materialKnowledgePages,
  resourcePages,
} from '../src/contentEcosystemAuthorityData.js';
import { ecosystemWordCount } from '../src/contentEcosystemUtils.js';

const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const expected = {
  blogs: 150,
  buyerGuides: 40,
  comparisons: 30,
  caseStudies: 20,
  factoryPages: 20,
  materialPages: 15,
  faqLandingPages: 15,
  reports: 10,
  pillars: 15,
  resources: 10,
};

const actual = {
  blogs: blogArticles.length,
  buyerGuides: buyerGuidePages.length,
  comparisons: comparisonPages.length + ecosystemComparisonPages.length,
  caseStudies: caseStudyPages.length + ecosystemCaseStudyPages.length,
  factoryPages: factoryPages.length + ecosystemFactoryPages.length,
  materialPages: materialKnowledgePages.length,
  faqLandingPages: 1 + faqLandingPages.length,
  reports: industryReportPages.length,
  pillars: pillarPages.length,
  resources: resourcePages.length,
};

Object.entries(expected).forEach(([key, count]) => {
  assert(actual[key] === count, `${key}: expected ${count}, found ${actual[key]}`);
});

ecosystemBlogArticles.forEach((article) => {
  const words = ecosystemWordCount(article);
  assert(words >= 1800 && words <= 2500, `${article.path}: ${words} words; expected 1,800-2,500`);
  assert(article.faqs.length >= 5, `${article.path}: missing useful FAQ coverage`);
  assert(article.checklist.length >= 5, `${article.path}: missing buyer checklist`);
  assert(article.toc.every((item) => typeof item === 'string'), `${article.path}: table of contents does not match the Blog component contract`);
  assert(getRelatedBlogArticles(article.slug).length >= 3, `${article.path}: fewer than three related articles`);
  assert(article.cta?.links?.length >= 4, `${article.path}: incomplete conversion links`);
});

buyerGuidePages.forEach((page) => {
  const words = ecosystemWordCount(page);
  assert(words >= 2500 && words <= 4000, `${page.path}: ${words} words; expected 2,500-4,000`);
  assert(page.downloadPath, `${page.path}: missing download request route`);
});

industryReportPages.forEach((page) => {
  const words = ecosystemWordCount(page);
  assert(words >= 5000, `${page.path}: ${words} words; expected at least 5,000`);
  assert(page.chart?.length >= 4, `${page.path}: missing analysis chart`);
  assert(page.references?.length >= 3, `${page.path}: missing authoritative references`);
});

const ecosystemPages = [
  ...buyerGuidePages,
  ...ecosystemComparisonPages,
  ...ecosystemCaseStudyPages,
  ...ecosystemFactoryPages,
  ...materialKnowledgePages,
  ...faqLandingPages,
  ...industryReportPages,
  ...resourcePages,
];

ecosystemPages.forEach((page) => {
  assert(page.sections?.length > 0, `${page.path}: missing body sections`);
  assert(page.faqs?.length >= 8, `${page.path}: missing FAQ coverage`);
  assert(page.articles?.length >= 3, `${page.path}: missing related articles`);
  assert(page.products?.length >= 1, `${page.path}: missing related products`);
  assert(page.cards?.length >= 3, `${page.path}: missing semantic internal links`);
  assert(page.breadcrumbs?.length >= 3, `${page.path}: incomplete breadcrumbs`);
  assert(page.schemaType, `${page.path}: missing schema type`);
});

faqLandingPages.forEach((page) => {
  assert(page.faqs.length >= 20 && page.faqs.length <= 30, `${page.path}: expected 20-30 FAQs`);
});

const paths = new Set();
const titles = new Set();
const descriptions = new Set();
authorityPages.forEach((page) => {
  assert(!paths.has(page.path), `${page.path}: duplicate authority URL`);
  assert(!titles.has(page.seoTitle), `${page.path}: duplicate authority SEO title`);
  assert(!descriptions.has(page.metaDescription), `${page.path}: duplicate authority meta description`);
  paths.add(page.path);
  titles.add(page.seoTitle);
  descriptions.add(page.metaDescription);
});

const paragraphs = new Set();
ecosystemPages.forEach((page) => page.sections.forEach((section) => section.paragraphs.forEach((paragraph) => {
  assert(!paragraphs.has(paragraph), `${page.path}: exact duplicate paragraph detected`);
  paragraphs.add(paragraph);
})));

if (errors.length) {
  console.error(`Content ecosystem validation failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const contentPageTotal = Object.values(actual).reduce((total, count) => total + count, 0);
console.log(`Content ecosystem validation passed: ${contentPageTotal} target pages, ${authorityPages.length} authority routes, and no duplicate authority metadata or paragraphs.`);
