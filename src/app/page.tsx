import Link from "next/link";

const experiences = [
  {
    company: "JetBrains AI",
    role: "Staff Research Engineer / Team Lead",
    period: "Mar 2024 – Present",
    location: "Berlin, Germany",
    description: "Leading development of Mellum, an open-source code LLM family. Training billion-parameter models on 512×H200 GPUs.",
  },
  {
    company: "Yandex",
    role: "AI Research Scientist",
    period: "Sep 2020 – Mar 2024",
    location: "Belgrade, Serbia",
    description: "Deep learning research for Toloka AI. Led alignment (SFT/RLHF) for LLM training. 6 publications at NeurIPS, SIGIR, HCOMP.",
  },
  {
    company: "MIPT & Inria NANO-D",
    role: "Research Intern",
    period: "Mar 2020 – Sep 2020",
    location: "Moscow / Grenoble",
    description: "Developed S-GCN for protein quality prediction. Achieved state-of-the-art on CASP MQA challenge.",
  },
  {
    company: "Yandex",
    role: "ML/SWE Intern",
    period: "2018 – 2019",
    location: "Moscow, Russia",
    description: "Built ML models for video ranking. Improved search anti-spam systems performance by 5%.",
  },
];

const publications = [
  {
    title: "Mellum: Open-Source Code LLMs",
    venue: "HuggingFace, 2024",
    link: "https://huggingface.co/collections/JetBrains/mellum-68120b4ae1423c86a2da007a",
  },
  {
    title: "Best Prompts for Text-to-Image Models",
    venue: "SIGIR 2023",
    link: "https://dl.acm.org/doi/10.1145/3539618.3592000",
  },
  {
    title: "CrowdSpeech and Vox DIY",
    venue: "NeurIPS Datasets Track 2021",
    link: "https://zenodo.org/record/8186168",
  },
  {
    title: "S-GCN for Protein Model Quality Assessment",
    venue: "ML: Science and Technology 2021",
    link: "https://iopscience.iop.org/article/10.1088/2632-2153/abf856",
  },
];

const skills = [
  "Python", "C++", "Rust", "PyTorch", "Distributed Training",
  "LLMs", "RLHF", "NLP", "Computer Vision", "Kubernetes"
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="font-mono text-accent-secondary mb-2">
          <span className="text-accent">$</span> whoami
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 cursor-blink">
          Nikita Pavlichenko
        </h1>
        <p className="text-xl text-accent-secondary mb-6">
          Staff Research Engineer / Team Lead @ JetBrains AI
        </p>
        <p className="text-lg leading-relaxed max-w-2xl">
          I build and train large language models for code. Currently leading the development of{" "}
          <a 
            href="https://huggingface.co/collections/JetBrains/mellum-68120b4ae1423c86a2da007a"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Mellum
          </a>
          , an open-source code LLM family. Previously at Yandex, working on crowdsourcing and AI research.
        </p>
      </section>

      {/* Experience Section */}
      <section className="mb-16">
        <div className="font-mono text-accent-secondary mb-6">
          <span className="text-accent">$</span> cat experience.json
        </div>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div 
              key={index}
              className="border border-border rounded-lg p-6 bg-card-bg hover:border-accent-secondary transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{exp.company}</h3>
                  <p className="text-accent">{exp.role}</p>
                </div>
                <div className="text-sm text-accent-secondary font-mono text-right">
                  <div>{exp.period}</div>
                  <div>{exp.location}</div>
                </div>
              </div>
              <p className="text-accent-secondary">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-16">
        <div className="font-mono text-accent-secondary mb-6">
          <span className="text-accent">$</span> cat education.md
        </div>
        <div className="border border-border rounded-lg p-6 bg-card-bg">
          <h3 className="text-lg font-semibold mb-1">Moscow Institute of Physics and Technology</h3>
          <p className="text-accent mb-4">MSc & BSc in Computer Science</p>
          <p className="text-accent-secondary">
            Graduated 2023. Focus on machine learning and algorithms.
          </p>
        </div>
      </section>

      {/* Publications Section */}
      <section className="mb-16">
        <div className="font-mono text-accent-secondary mb-6">
          <span className="text-accent">$</span> ls publications/ | head -4
        </div>
        <div className="grid gap-4">
          {publications.map((pub, index) => (
            <a
              key={index}
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border rounded-lg p-4 bg-card-bg hover:border-accent transition-colors block"
            >
              <h3 className="font-medium mb-1">{pub.title}</h3>
              <p className="text-sm text-accent-secondary font-mono">{pub.venue}</p>
            </a>
          ))}
        </div>
        <p className="text-sm text-accent-secondary mt-4 font-mono">
          + more on{" "}
          <a 
            href="https://scholar.google.com/citations?user=2mSLYhcAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Google Scholar
          </a>
        </p>
      </section>

      {/* Skills Section */}
      <section className="mb-16">
        <div className="font-mono text-accent-secondary mb-6">
          <span className="text-accent">$</span> echo $SKILLS
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-card-bg border border-border rounded-md text-sm font-mono"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Blog Teaser */}
      <section>
        <div className="font-mono text-accent-secondary mb-6">
          <span className="text-accent">$</span> ls blog/
        </div>
        <div className="border border-border rounded-lg p-6 bg-card-bg">
          <p className="text-accent-secondary mb-4">
            I occasionally write about ML, engineering, and random thoughts.
          </p>
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-accent hover:underline font-mono"
          >
            cd blog/ <span className="text-accent-secondary">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
