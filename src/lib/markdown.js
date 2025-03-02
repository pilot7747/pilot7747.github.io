import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { compareDesc } from 'date-fns';

const contentDirectory = path.join(process.cwd(), 'content');

export function getAllProjects() {
  const projectsDirectory = path.join(contentDirectory, 'projects');
  const filenames = fs.readdirSync(projectsDirectory);
  
  const projects = filenames.map((filename) => {
    const filePath = path.join(projectsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug: filename.replace(/\.md$/, ''),
      ...data,
      content,
    };
  });
  
  // Sort projects by date in descending order
  return projects.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });
}

export function getAllJobs() {
  const jobsDirectory = path.join(contentDirectory, 'jobs');
  const filenames = fs.readdirSync(jobsDirectory);
  
  const jobs = filenames.map((filename) => {
    const filePath = path.join(jobsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug: filename.replace(/\.md$/, ''),
      ...data,
      content,
    };
  });
  
  // Sort jobs by date in descending order
  return jobs.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });
}

export async function markdownToHtml(markdown) {
  const result = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(markdown);
  
  return result.toString();
} 