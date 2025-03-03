import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';
import { getAllProjects, getAllJobs, markdownToHtml } from '@/lib/markdown';
import JobSelector from '@/components/JobSelector';

export default async function Home() {
  const projects = getAllProjects();
  const jobs = getAllJobs();
  
  // Process job content to HTML
  const jobsWithHtml = await Promise.all(
    jobs.map(async (job) => {
      const contentHtml = await markdownToHtml(job.content);
      
      // Add logos to the job objects
      let logo;
      switch (job.company) {
        case 'JetBrains':
          logo = '/content/img/companies/jetbrains.svg';
          break;
        case 'Toloka AI':
          logo = '/content/img/companies/toloka.svg';
          break;
        case 'Yandex':
          logo = '/content/img/companies/yandex.svg';
          break;
        case 'MIPT':
          logo = '/content/img/companies/mipt.svg';
          break;
        default:
          logo = null;
      }
      
      return { ...job, contentHtml, logo };
    })
  );
  
  // Process project content to HTML
  const projectsWithHtml = await Promise.all(
    projects.map(async (project) => {
      const contentHtml = await markdownToHtml(project.content);
      return { ...project, contentHtml };
    })
  );

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-blur"></div>
        <div className="container overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full mb-12 md:mb-0 md:max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 break-words">
                Nikita <span className="text-gradient">Pavlichenko</span>
              </h1>
              <h2 className="text-2xl md:text-3xl mb-6 break-words">
                Senior Machine Learning Engineer
              </h2>
              <p className="text-lg leading-relaxed mb-8">
                Developing cutting-edge AI applications with expertise in <span className="text-gradient">LLMs</span>,
                Natural Language Processing, and crowdsourcing technologies. Currently building
                advanced code completion models at JetBrains AI.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-center md:justify-start w-full max-w-full overflow-hidden">
                <a 
                  href="https://github.com/pilot7747" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <FaGithub size={16} /> GitHub
                </a>
                <a 
                  href="https://www.linkedin.com/in/nikita-pavlichenko/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <FaLinkedin size={16} /> LinkedIn
                </a>
                <a 
                  href="https://scholar.google.com/citations?user=2mSLYhcAAAAJ" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <SiGooglescholar size={16} /> Scholar
                </a>
                <a 
                  href="/CV.pdf" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <FaFileAlt size={16} /> Resume
                </a>
              </div>
            </div>
            <div className="relative flex-shrink-0">
              <div className="w-64 h-64 md:w-80 md:h-80 profile-image relative">
                <Image
                  src="/content/img/me.jpg"
                  alt="Nikita Pavlichenko"
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-cover rounded-full"
                  priority
                />
              </div>
              <div className="absolute -z-10 top-4 -right-4 w-64 h-64 md:w-80 md:h-80 rounded-full blur-lg opacity-70 animate-blob" style={{ backgroundColor: "rgba(14, 165, 233, 0.2)" }}></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Experience Section */}
      <section id="experience" className="py-20 bg-alternate">
        <div className="container">
          <h2 className="section-heading">Experience</h2>
          
          <div className="mt-12">
            <JobSelector jobs={jobsWithHtml} />
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container">
          <h2 className="section-heading">Projects</h2>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectsWithHtml.map((project) => (
              <div key={project.slug} className="publication-card">
                <div className="card p-6 flex flex-col h-full overflow-hidden">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-sm mt-1 text-muted">
                    {new Date(project.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                  
                  <div 
                    className="mt-4 prose prose-sm max-w-none flex-grow"
                    dangerouslySetInnerHTML={{ __html: project.contentHtml }}
                  />
                  
                  {project.tech && (
                    <div className="mt-4 flex flex-wrap gap-2 overflow-hidden">
                      {project.tech.map((tech) => (
                        <span 
                          key={tech}
                          className="publication-tag"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                      {project.github && (
                        <a 
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="icon-link"
                          aria-label="GitHub repository"
                        >
                          <FaGithub className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    
                    {project.external && (
                      <a 
                        href={project.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="publication-link"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Publications Section */}
      <section id="publications" className="py-20 bg-alternate">
        <div className="container">
          <h2 className="section-heading">Publications</h2>
          
          <div className="mt-8 mb-12">
            <p className="max-w-3xl">
              My research contributions span multiple domains including machine learning, crowdsourcing, and AI-generated content. 
              You can find my complete publication history on <a href="https://scholar.google.com/citations?user=2mSLYhcAAAAJ" 
              target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Scholar</a>.
            </p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-8">
            <div className="publication-card">
              <div className="card p-6 overflow-hidden">
                <h3 className="text-xl font-bold">Best Prompts for Text-to-Image Models and How to Find Them</h3>
                <p className="text-sm mt-1 text-muted">SIGIR 2023</p>
                <p className="mt-4">
                  A novel approach for optimizing text prompts for text-to-image generation models using crowdsourcing techniques and evolutionary algorithms.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 overflow-hidden">
                  <span className="publication-tag">AI</span>
                  <span className="publication-tag">Generative Models</span>
                  <span className="publication-tag">Prompting</span>
                </div>
                <div className="mt-4">
                  <a 
                    href="https://dl.acm.org/doi/10.1145/3539618.3591909" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="publication-link"
                  >
                    View Publication
                  </a>
                </div>
              </div>
            </div>

            <div className="publication-card">
              <div className="card p-6 overflow-hidden">
                <h3 className="text-xl font-bold">CrowdSpeech and Vox DIY: Benchmark Dataset for Crowdsourced Audio Transcription</h3>
                <p className="text-sm mt-1 text-muted">NeurIPS Datasets and Benchmarks 2021</p>
                <p className="mt-4">
                  A benchmark dataset for evaluating crowdsourced audio transcription methods, featuring diverse languages and recording conditions.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 overflow-hidden">
                  <span className="publication-tag">NLP</span>
                  <span className="publication-tag">Crowdsourcing</span>
                  <span className="publication-tag">Datasets</span>
                </div>
                <div className="mt-4">
                  <a 
                    href="https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/hash/a684eceee76fc522773286a895bc8436-Abstract-round1.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="publication-link"
                  >
                    View Publication
                  </a>
                </div>
              </div>
            </div>
            
            <div className="publication-card">
              <div className="card p-6 overflow-hidden">
                <h3 className="text-xl font-bold">Spherical convolutions on molecular graphs for protein model quality assessment</h3>
                <p className="text-sm mt-1 text-muted">Machine Learning: Science and Technology 2021</p>
                <p className="mt-4">
                  A deep learning model operating on molecular graphs (S-GCN) for protein model quality prediction that achieved state-of-the-art results on the CASP MQA challenge.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 overflow-hidden">
                  <span className="publication-tag">Graph ML</span>
                  <span className="publication-tag">Bioinformatics</span>
                  <span className="publication-tag">GCN</span>
                </div>
                <div className="mt-4">
                  <a 
                    href="https://iopscience.iop.org/article/10.1088/2632-2153/abf856" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="publication-link"
                  >
                    View Publication
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <a 
                href="https://scholar.google.com/citations?user=2mSLYhcAAAAJ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline inline-flex items-center"
              >
                <SiGooglescholar className="mr-2" /> View All Publications
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container">
          <h2 className="section-heading">Contact</h2>
          
          <div className="mt-10 relative overflow-hidden">
            {/* Animated background elements - made smaller */}
            <div className="absolute -z-10 top-10 -right-10 w-64 h-64 rounded-full blur-xl opacity-20 animate-blob" 
              style={{ backgroundColor: "rgba(99, 102, 241, 0.3)", animationDelay: "0s" }}></div>
            <div className="absolute -z-10 bottom-10 -left-20 w-56 h-56 rounded-full blur-xl opacity-20 animate-blob" 
              style={{ backgroundColor: "rgba(14, 165, 233, 0.2)", animationDelay: "3s" }}></div>
            
            <div className="card backdrop-blur-sm p-0 relative overflow-hidden border-gradient">
              {/* Subtle grid pattern overlay */}
              <div className="absolute inset-0 opacity-5 grid-pattern"></div>
              
              {/* Main content with reduced padding */}
              <div className="p-6 md:p-8">
                <div>
                  <div className="inline-block mb-4 gradient-text">
                    <h3 className="text-2xl font-bold">Let's Connect</h3>
                  </div>
                  
                  <p className="mb-6">
                    I'm always open to discussing new projects, opportunities, or partnerships. 
                    Feel free to reach out through any of these channels!
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email - Compact contact card */}
                    <a href="mailto:nikita.pavlichenko@gmail.com" className="contact-card-compact group">
                      <div className="contact-card-icon-container-sm">
                        <FaEnvelope className="contact-card-icon-sm" />
                      </div>
                      <div className="contact-card-content-sm">
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted">nikita.pavlichenko@gmail.com</div>
                      </div>
                    </a>
                    
                    {/* LinkedIn */}
                    <a href="https://www.linkedin.com/in/nikita-pavlichenko/" target="_blank" rel="noopener noreferrer" className="contact-card-compact group">
                      <div className="contact-card-icon-container-sm">
                        <FaLinkedin className="contact-card-icon-sm" />
                      </div>
                      <div className="contact-card-content-sm">
                        <div className="font-medium">LinkedIn</div>
                        <div className="text-sm text-muted">linkedin.com/in/nikita-pavlichenko</div>
                      </div>
                    </a>
                    
                    {/* GitHub */}
                    <a href="https://github.com/pilot7747" target="_blank" rel="noopener noreferrer" className="contact-card-compact group">
                      <div className="contact-card-icon-container-sm">
                        <FaGithub className="contact-card-icon-sm" />
                      </div>
                      <div className="contact-card-content-sm">
                        <div className="font-medium">GitHub</div>
                        <div className="text-sm text-muted">github.com/pilot7747</div>
                      </div>
                    </a>
                    
                    {/* Google Scholar */}
                    <a href="https://scholar.google.com/citations?user=2mSLYhcAAAAJ" target="_blank" rel="noopener noreferrer" className="contact-card-compact group">
                      <div className="contact-card-icon-container-sm">
                        <SiGooglescholar className="contact-card-icon-sm" />
                      </div>
                      <div className="contact-card-content-sm">
                        <div className="font-medium">Google Scholar</div>
                        <div className="text-sm text-muted">View Academic Publications</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Bottom call to action with reduced padding */}
              <div className="p-6 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold">Need my resume?</h4>
                    <p className="text-sm text-muted">Download for complete details on my experience and skills.</p>
                  </div>
                  <a href="/CV.pdf" target="_blank" rel="noopener noreferrer" className="cta-button-compact self-start sm:self-center">
                    <span>Download Resume</span>
                    <FaFileAlt size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 