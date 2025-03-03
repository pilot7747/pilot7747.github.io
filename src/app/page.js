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
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute hero-blur" style={{ top: "-10rem", left: "-10rem" }}></div>
          <div className="absolute hero-blur" style={{ bottom: "-10rem", right: "-10rem" }}></div>
        </div>
        <div className="container overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full mb-12 md:mb-0 md:max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 break-words">
                Nikita Pavlichenko
              </h1>
              <h2 className="text-2xl md:text-3xl mb-6 text-muted break-words">
                Senior Machine Learning Engineer
              </h2>
              <p className="text-lg leading-relaxed mb-8 text-muted">
                Developing cutting-edge AI applications with expertise in LLMs,
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
              <div key={project.slug} className="card p-6 flex flex-col h-full project-card">
                {project.external ? (
                  <a 
                    href={project.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contents" // Makes the link wrapper preserve the original styling
                  >
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
                      <div className="tech-tags-container">
                        {project.tech.map((tech) => (
                          <span 
                            key={tech}
                            className="tech-tag"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                ) : (
                  <>
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
                      <div className="tech-tags-container">
                        {project.tech.map((tech) => (
                          <span 
                            key={tech}
                            className="tech-tag"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
                
                <div className="mt-6 flex space-x-4">
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
                  {project.external && (
                    <a 
                      href={project.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-link"
                      aria-label="External link"
                    >
                      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
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
          
          <div className="mt-12 space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold">Best Prompts for Text-to-Image Models and How to Find Them</h3>
              <p className="text-sm mt-1 text-muted">SIGIR 2023</p>
              <p className="mt-4">
                A novel approach for optimizing text prompts for text-to-image generation models using crowdsourcing techniques and evolutionary algorithms.
              </p>
              <div className="mt-4">
                <a 
                  href="https://dl.acm.org/doi/10.1145/3539618.3591909" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  View Publication
                </a>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold">CrowdSpeech and Vox DIY: Benchmark Dataset for Crowdsourced Audio Transcription</h3>
              <p className="text-sm mt-1 text-muted">NeurIPS Datasets and Benchmarks 2021</p>
              <p className="mt-4">
                A benchmark dataset for evaluating crowdsourced audio transcription methods, featuring diverse languages and recording conditions.
              </p>
              <div className="mt-4">
                <a 
                  href="https://datasets-benchmarks-proceedings.neurips.cc/paper/2021/hash/a684eceee76fc522773286a895bc8436-Abstract-round1.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  View Publication
                </a>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-bold">Spherical convolutions on molecular graphs for protein model quality assessment</h3>
              <p className="text-sm mt-1 text-muted">Machine Learning: Science and Technology 2021</p>
              <p className="mt-4">
                A deep learning model operating on molecular graphs (S-GCN) for protein model quality prediction that achieved state-of-the-art results on the CASP MQA challenge.
              </p>
              <div className="mt-4">
                <a 
                  href="https://iopscience.iop.org/article/10.1088/2632-2153/abf856" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="icon-link"
                >
                  View Publication
                </a>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <a 
                href="https://scholar.google.com/citations?user=2mSLYhcAAAAJ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <SiGooglescholar style={{ marginRight: "0.5rem" }} /> View All Publications
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container">
          <h2 className="section-heading">Contact</h2>
          
          <div className="mt-12">
            <div className="card p-8">
              <p className="mb-6 text-muted">
                I'm always open to discussing new projects, opportunities, or partnerships. Feel free to reach out!
              </p>
              
              <div className="space-y-2">
                <a 
                  href="mailto:nikita.pavlichenko@gmail.com" 
                  className="contact-link"
                >
                  <FaEnvelope className="w-5 h-5 primary-icon" />
                  <span>nikita.pavlichenko@gmail.com</span>
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/nikita-pavlichenko/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <FaLinkedin className="w-5 h-5 primary-icon" />
                  <span>linkedin.com/in/nikita-pavlichenko</span>
                </a>
                
                <a 
                  href="https://github.com/pilot7747" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <FaGithub className="w-5 h-5 primary-icon" />
                  <span>github.com/pilot7747</span>
                </a>

                <a 
                  href="https://scholar.google.com/citations?user=2mSLYhcAAAAJ" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <SiGooglescholar className="w-5 h-5 primary-icon" />
                  <span>Google Scholar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 