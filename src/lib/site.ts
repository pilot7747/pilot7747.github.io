// Everything personal lives here, so updating the site means editing one file.

export const site = {
  name: "Nikita Pavlichenko",
  url: "https://www.nikita-pavlichenko.com",
  email: "nikita.v.pavlichenko@gmail.com",
  location: "Berlin, Germany",
  role: "Member of Technical Staff",
  team: "Foundations",
  company: "Cohere",
  companyUrl: "https://cohere.com",
  tagline: "Research engineer working on LLM pre-training.",
  description:
    "Research engineer working on LLM pre-training: data, ablations and training infrastructure. Member of Technical Staff on Cohere's Foundations team; previously led Mellum, JetBrains' open code LLMs.",
  links: {
    github: "https://github.com/pilot7747",
    scholar: "https://scholar.google.com/citations?user=2mSLYhcAAAAJ",
    linkedin: "https://www.linkedin.com/in/nikita-pavlichenko/",
    huggingface: "https://huggingface.co/JetBrains",
  },
} as const;

export const socials = [
  { label: "Email", href: `mailto:${site.email}` },
  { label: "GitHub", href: site.links.github },
  { label: "Scholar", href: site.links.scholar },
  { label: "LinkedIn", href: site.links.linkedin },
] as const;

export const toolbox = [
  { label: "Languages", items: "Python, C++, Rust, Bash" },
  { label: "Training", items: "PyTorch, multi-node mixed precision, MoE, LLM evaluation" },
  { label: "Data & infra", items: "Spark, AWS, Kubernetes, Docker, multi-TB pipelines" },
] as const;

export type Link = { label: string; href: string };

export type Highlight = {
  year: string;
  title: string;
  kicker: string;
  body: string;
  links: Link[];
};

export const highlights: Highlight[] = [
  {
    year: "2026",
    title: "Mellum2",
    kicker: "Open-weight code LLM",
    body: "A 12B mixture-of-experts model with 2.5B active parameters. I led pre-training: data mixture, filtering, dedup and FIM ablations, attention design for latency, and the runs on 512×H200.",
    links: [
      { label: "Technical report", href: "https://arxiv.org/abs/2605.31268" },
      { label: "Weights", href: "https://huggingface.co/JetBrains/Mellum2-12B-A2.5B-Base" },
    ],
  },
  {
    year: "2025",
    title: "Mellum in the IDE",
    kicker: "Production code completion",
    body: "In-IDE completion with multi-file project context. Competitive with commercial solutions in offline evals and online A/B tests, and used by hundreds of thousands of developers every month.",
    links: [
      { label: "Paper", href: "https://arxiv.org/abs/2510.05788" },
      { label: "Product", href: "https://www.jetbrains.com/mellum/" },
    ],
  },
  {
    year: "2023",
    title: "RLHF at Toloka",
    kicker: "Alignment",
    body: "Led SFT and RLHF for Toloka's LLM, from data collection to training. The model beat Falcon-40B-Instruct with a >65% win rate on real user requests. Authored the ICML 2023 tutorial on RLHF.",
    links: [],
  },
  {
    year: "2021",
    title: "Crowd-Kit",
    kicker: "Open-source library",
    body: "A Python toolkit for aggregating crowdsourced annotations, alongside benchmark datasets for crowdsourced audio transcription (NeurIPS) and pairwise comparisons.",
    links: [
      { label: "Paper", href: "https://arxiv.org/abs/2109.08584" },
      { label: "Code", href: "https://github.com/Toloka/crowd-kit" },
    ],
  },
];

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  href?: string;
  current?: boolean;
  points: string[];
};

export const experience: Experience[] = [
  {
    id: "cohere",
    company: "Cohere",
    role: "Member of Technical Staff, Foundations",
    period: "Nov 2026 – now",
    location: "Berlin · remote",
    href: "https://cohere.com",
    current: true,
    points: [],
  },
  {
    id: "jetbrains",
    company: "JetBrains",
    role: "Staff Research Engineer / Team Lead",
    period: "Mar 2024 – Oct 2026",
    location: "Berlin",
    href: "https://www.jetbrains.com/mellum/",
    points: [
      "Led Mellum, JetBrains' open-source code LLM family, and a team of 7 researchers and engineers.",
      "Led pre-training of Mellum2: large-scale ablations on data (mixtures, synthetic generation, filtering, dedup, FIM) and architecture (GQA/MLA, sliding-window attention), with distributed runs on 512×H200.",
      "Designed and built a 10 TB+ data processing and streaming pipeline for training.",
      "Shipped completion models competitive with commercial solutions offline and in online A/B tests, serving hundreds of thousands of monthly users.",
      "Built large-scale RLVR pipelines for coding agents, competitive programming, instruction following and math. Owned research-engineer hiring.",
    ],
  },
  {
    id: "yandex",
    company: "Yandex · Toloka AI",
    role: "AI Research Scientist",
    period: "Sep 2020 – Mar 2024",
    location: "Moscow · Belgrade",
    href: "https://toloka.ai/",
    points: [
      "Led deep-learning research for Toloka AI: 6 papers on NLP, computer vision and generative AI at NeurIPS, SIGIR and HCOMP.",
      "Led SFT and RLHF in Toloka's LLM project; the model beat Falcon-40B-Instruct with a >65% win rate on real user requests.",
      "Authored the ICML 2023 tutorial on RLHF.",
      "Built an AI-assisted annotation service that raised revenue on text-classification projects by up to 30%. 3 patent applications.",
    ],
  },
  {
    id: "inria",
    company: "MIPT & Inria NANO-D",
    role: "Research Intern",
    period: "Mar 2020 – Sep 2020",
    location: "Moscow · Grenoble",
    points: [
      "Developed S-GCN, spherical convolutions on molecular graphs for protein model quality assessment. State of the art on the CASP MQA challenge; published in Machine Learning: Science and Technology.",
    ],
  },
  {
    id: "yandex-intern",
    company: "Yandex",
    role: "Software Engineering / ML Intern",
    period: "2018 – 2019",
    location: "Moscow",
    points: [
      "Built a model for ranking video clips in web-crawler schedules that removed over 90% of deleted videos from search results.",
      "Sped up all search anti-spam systems by 5% with the fastest C++ hash table at Yandex.",
    ],
  },
];

export const education = [
  { school: "Moscow Institute of Physics and Technology", degree: "MSc, Computer Science", period: "2021 – 2023" },
  { school: "Moscow Institute of Physics and Technology", degree: "BSc, Computer Science", period: "2017 – 2021" },
] as const;

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year?: number;
  href?: string;
};

// Newest first. Authors are abbreviated the way the CV lists them.
export const publications: Publication[] = [
  {
    title: "Mellum2 Technical Report",
    authors: "M. Kojic, I. Bondyrev, A. de Moor, J. Shtok, P. Borovlev, K. Lysaniuk, M. Kannan, I. Dolgov, N. Pavlichenko",
    venue: "arXiv:2605.31268",
    year: 2026,
    href: "https://arxiv.org/abs/2605.31268",
  },
  {
    title: "Mellum: Production-Grade in-IDE Contextual Code Completion with Multi-File Project Understanding",
    authors: "N. Pavlichenko, I. Nazarov, I. Dolgov, E. Garanina, D. Ustalov, I. Bondyrev, K. Lysaniuk, E. Vu, K. Chekmenev, J. Shtok, Y. Golubev, A. Semenkin, U. Sazanovich",
    venue: "arXiv:2510.05788",
    year: 2025,
    href: "https://arxiv.org/abs/2510.05788",
  },
  {
    title: "Best Prompts for Text-to-Image Models and How to Find Them",
    authors: "N. Pavlichenko, D. Ustalov",
    venue: "SIGIR 2023",
    year: 2023,
    href: "https://arxiv.org/abs/2209.11711",
  },
  {
    title: "WSDM Cup 2023 Challenge on Visual Question Answering",
    authors: "D. Ustalov, N. Pavlichenko, D. Likhobaba, A. Smirnova",
    venue: "WSDM Cup 2023",
    year: 2023,
  },
  {
    title: "CrowdSpeech and Vox DIY: Benchmark Dataset for Crowdsourced Audio Transcription",
    authors: "N. Pavlichenko, I. Stelmakh, D. Ustalov",
    venue: "NeurIPS 2021 Datasets and Benchmarks",
    year: 2021,
    href: "https://arxiv.org/abs/2107.01091",
  },
  {
    title: "Spherical Convolutions on Molecular Graphs for Protein Model Quality Assessment",
    authors: "I. Igashov, N. Pavlichenko, S. Grudinin",
    venue: "Machine Learning: Science and Technology",
    year: 2021,
    href: "https://iopscience.iop.org/article/10.1088/2632-2153/abf856",
  },
  {
    title: "IMDB-WIKI-SbS: An Evaluation Dataset for Crowdsourced Pairwise Comparisons",
    authors: "N. Pavlichenko, D. Ustalov",
    venue: "NeurIPS 2021 Data-Centric AI Workshop",
    year: 2021,
    href: "https://arxiv.org/abs/2110.14990",
  },
  {
    title: "Learning from Crowds with Crowd-Kit",
    authors: "D. Ustalov, N. Pavlichenko, B. Tseitlin",
    venue: "arXiv:2109.08584",
    year: 2021,
    href: "https://arxiv.org/abs/2109.08584",
  },
  {
    title: "A General-Purpose Crowdsourcing Computational Quality Control Toolkit for Python",
    authors: "D. Ustalov, N. Pavlichenko, V. Losev, I. Giliazev, E. Tulin",
    venue: "HCOMP 2021 Works-in-Progress & Demos",
    year: 2021,
  },
  {
    title: "VLDB 2021 Crowd Science Challenge on Aggregating Crowdsourced Audio Transcriptions",
    authors: "D. Ustalov, N. Pavlichenko, I. Stelmakh, D. Kuznetsov",
    venue: "Crowd Science Workshop at VLDB 2021",
    year: 2021,
  },
  {
    title: "Toloka at LMNL Challenge: Learning from Noisy Labels with Annotator Reliabilities and Self-Supervised Training",
    authors: "B. Tseytlin, N. Pavlichenko, D. Likhobaba, A. Smirnova, D. Ustalov",
    venue: "LMNL Challenge",
  },
];

export type Checkpoint = {
  t: number; // fractional year
  date: string;
  title: string;
  note: string;
  spike?: number; // a fresh domain bumps the loss for a while
};

// The x-axis of the hero figure.
export const checkpoints: Checkpoint[] = [
  { t: 2018.55, date: "2018", title: "Yandex", note: "Search & ML internships" },
  { t: 2020.2, date: "2020", title: "MIPT × Inria", note: "Graph nets for protein structures", spike: 0.55 },
  { t: 2020.7, date: "2020", title: "Toloka AI", note: "Crowdsourcing, evaluation, RLHF", spike: 0.4 },
  { t: 2024.2, date: "2024", title: "JetBrains", note: "Leading Mellum code LLMs", spike: 0.45 },
  { t: 2026.4, date: "2026", title: "Mellum2", note: "12B MoE, open weights" },
  { t: 2026.84, date: "Nov 2026", title: "Cohere", note: "Foundations team" },
];
