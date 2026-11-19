import { Award, CircuitBoard, Cloud, GitPullRequest, Leaf, Radio, Swords, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const profile = {
  name: 'Sajan Kamboj',
  greeting: 'Hi, i’m sajan',
  tagline: 'a software engineer building ai-powered web apps and solving hard problems fast',
  email: 'kambojsajan646@gmail.com',
  // 3D character from the design template. Replace this file with a cut-out of yourself (transparent WebP/PNG).
  portrait: '/images/hero-portrait.webp',
  education: 'B.Tech ECE (IoT) · NSUT Delhi · Class of 2027',
  availability: 'Open to SDE internships & full-time roles',
};

// The Contact Me form posts to FormSubmit (https://formsubmit.co), which forwards each message to your inbox.
// The very first message sends an "Activate Form" email to this address: click it once and every message after
// that is delivered. FormSubmit then emails you a random alias you can put here in place of your address.
export const contactForm = {
  endpoint: `https://formsubmit.co/ajax/${profile.email}`,
  subject: 'New message from your portfolio',
};

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const socials = [
  { label: 'GitHub', href: 'https://github.com/kamboj-sajan' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/sajan-kamboj-427793289' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/Sajan__kamboj/' },
  { label: 'Codeforces', href: 'https://codeforces.com/profile/kambojsajan646' },
  { label: 'CodeChef', href: 'https://www.codechef.com/users/mysterious_98' },
];

export const about =
  'I’m an ECE (IoT) undergrad at NSUT Delhi who builds AI-powered web apps with Next.js, Node.js and PostgreSQL, backends in Go that stay correct when a process dies mid-write, competes in C++ on LeetCode and Codeforces, and goes close to the metal with RISC-V cores and PCBs. Let’s build something incredible together!';

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 2041, label: 'LeetCode peak · Knight' },
  { value: 1456, label: 'Codeforces peak · Specialist' },
  { value: 1626, label: 'CodeChef max rating' },
  { value: 780, suffix: '+', label: 'Problems solved' },
];

export const skills = [
  {
    name: 'Full-Stack & Backend',
    description:
      'Production web apps in Next.js, React and TypeScript, with backends in Node.js, Go and FastAPI — typed APIs, auth, payments, idempotent webhooks and real-time sync over PostgreSQL, Prisma and Redis.',
  },
  {
    name: 'Applied AI & ML',
    description:
      'RAG pipelines, AI tutors and autonomous agents with LangChain, LangGraph, Gemini, Azure OpenAI and Bedrock, plus vision, graph and multimodal speech models in PyTorch — grounded in sources and measured on held-out data.',
  },
  {
    name: 'Data Engineering',
    description:
      'A lakehouse on AWS: PySpark on Glue, incremental loads with Step Functions and EventBridge, Athena and Redshift, all in Terraform, with quality gates that quarantine bad rows. Analytics dashboards in Streamlit and Power BI.',
  },
  {
    name: 'Cloud & DevOps',
    description:
      'Docker, Kubernetes and GitHub Actions; serverless pipelines on AWS Lambda, Step Functions and SQS; deploys to Cloud Run, Azure Container Apps, Amplify and Vercel.',
  },
  {
    name: 'Competitive Programming',
    description:
      'Fast, correct C++ under contest pressure — graphs, DP, greedy and number theory. LeetCode Knight, Codeforces Specialist, 780+ problems solved.',
  },
  {
    name: 'Hardware & Systems',
    description:
      'A pipelined RISC-V core in SystemVerilog, Linux hardware diagnostics in C++, an 865 MHz RFID reader PCB in KiCad and Cisco enterprise network labs.',
  },
];

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  name: string;
  category: string;
  description: string;
  stack: string[];
  code: string;
  live?: string;
  images: [ProjectImage, ProjectImage, ProjectImage];
}

const shot = (file: string, alt: string): ProjectImage => ({ src: `/images/projects/${file}.webp`, alt });

export const projects: Project[] = [
  {
    name: 'Ledgerline',
    category: 'Backend · Payments',
    description:
      'Payments API and double-entry ledger in Go that stays correct under races, retries and crashes. Postgres itself rejects unbalanced entries, every POST is idempotent (including the card-network call) and webhooks go out through a transactional outbox. A chaos suite SIGKILLs the services 100+ times per run, with 3M property-tested operations.',
    stack: ['Go', 'PostgreSQL', 'pgx', 'testcontainers', 'k6', 'Docker'],
    code: 'https://github.com/kamboj-sajan/Ledgerline',
    images: [
      shot('ledgerline-1', 'Ledgerline: 0 double charges, 100+ SIGKILLs per chaos run, 3M property-test operations'),
      shot('ledgerline-2', 'Terminal demo: a payment is authorized and captured, and a retried capture is replayed instead of charged twice'),
      shot('ledgerline-3', 'Terminal demo: the ledger balances, the audit passes, and the concurrency and chaos tests pass'),
    ],
  },
  {
    name: 'AfterPass',
    category: 'Hackathon · Geospatial AI',
    description:
      'Finds the Punjab stubble fires that official satellite counts miss from burn scars in Sentinel-2 imagery, forecasts where the smoke goes over Delhi, and answers questions in English and Hindi.',
    stack: ['Python', 'React', 'AWS Lambda', 'Step Functions', 'Bedrock'],
    live: 'https://main.dx6zgy1knro1d.amplifyapp.com',
    code: 'https://github.com/kamboj-sajan/Afterpass',
    images: [
      shot('afterpass-1', 'AfterPass landing page: the satellites look at 1:30 PM, the fields burn after'),
      shot('afterpass-2', 'Village-level burn scars over Sentinel-2 imagery in the AfterPass explorer'),
      shot('afterpass-3', 'Smoke forecast drifting from Punjab toward Delhi on the AfterPass map'),
    ],
  },
  {
    name: 'Issue Intelligence',
    category: 'ML · Graph Research',
    description:
      'Mines 42,555 Ask Different questions (2019–2026) for emerging issues: FDR-controlled anomaly signals, related-question search comparing BM25, embeddings and GraphSAGE over a 47k-node knowledge graph, and calibrated monthly drift alerts, served to a Next.js dashboard.',
    stack: ['Python', 'PyTorch Geometric', 'FastAPI', 'pgvector', 'Next.js'],
    code: 'https://github.com/kamboj-sajan/issue_Intelligence',
    images: [
      shot('issue-intelligence-1', 'Emerging-issue signal: 124 macOS Catalina questions in one week against 6.8 expected'),
      shot('issue-intelligence-2', 'Knowledge graph neighbourhood of a question, linked to its tags, categories and the known duplicate'),
      shot('issue-intelligence-3', 'Issue Intelligence overview: 42,555 indexed questions, 21 anomaly signals and the most active issue categories'),
    ],
  },
  {
    name: 'CodeNova',
    category: 'SaaS · Cloud IDE',
    description:
      'Cloud IDE with isolated code execution in 10+ languages, a Monaco editor, real-time snippet sharing and a webhook-driven Pro tier.',
    stack: ['Next.js 15', 'TypeScript', 'Convex', 'Monaco', 'Clerk', 'Lemon Squeezy'],
    live: 'https://codenova-sigma.vercel.app',
    code: 'https://github.com/kamboj-sajan/codenova',
    images: [
      shot('codenova-1', 'CodeNova Pro pricing page'),
      shot('codenova-2', 'CodeNova community snippet library'),
      shot('codenova-3', 'CodeNova editor with a C++ program and its output panel'),
    ],
  },
  {
    name: 'RV32I Pipelined Core',
    category: 'Hardware · SystemVerilog',
    description:
      'A 5-stage pipelined RISC-V core with full forwarding and hazard handling, verified in lockstep against a Python reference ISS cross-checked with Spike. 147/147 tests pass.',
    stack: ['SystemVerilog', 'Verilator', 'Python', 'RISC-V'],
    code: 'https://github.com/kamboj-sajan/Risc-V',
    images: [
      shot('riscv-1', 'Waveform of an EX-to-EX forwarding event'),
      shot('riscv-2', 'Waveform of a load-use stall'),
      shot('riscv-3', 'Block diagram of the five-stage pipeline with its forwarding and hazard units'),
    ],
  },
  {
    name: 'NeuroPilot',
    category: 'AI · Career Coach',
    description:
      'AI career coach: resume builder, AI cover letters, mock interview quizzes with performance analytics, and industry insights refreshed by background jobs.',
    stack: ['Next.js', 'Prisma', 'Gemini', 'Inngest', 'Clerk'],
    live: 'https://neuro-pilot-rho.vercel.app',
    code: 'https://github.com/kamboj-sajan/NeuroPilot',
    images: [
      shot('neuropilot-1', 'NeuroPilot feature overview'),
      shot('neuropilot-2', 'NeuroPilot stats and how-it-works steps'),
      shot('neuropilot-3', 'NeuroPilot landing page'),
    ],
  },
  {
    name: 'hwdiag',
    category: 'Systems · Linux',
    description:
      'Linux hardware diagnostics: hardware inventory, cache and DRAM latency, STREAM bandwidth, memory testing and perf counters, plus a Python harness for reports, regressions and stress tests.',
    stack: ['C++', 'Python', 'Linux', 'perf_event'],
    code: 'https://github.com/kamboj-sajan/hwdiag',
    images: [
      shot('hwdiag-1', 'STREAM memory bandwidth by thread count on a cloud VM'),
      shot('hwdiag-2', 'Memory latency by access pattern and page size'),
      shot('hwdiag-3', 'Random-access latency curve showing the L1, L2 and L3 cache boundaries'),
    ],
  },
];

export interface Repo {
  name: string;
  description: string;
  stack: string[];
  code: string;
  live?: string;
  demo?: string;
  status?: string;
}

export const moreProjects: Repo[] = [
  {
    name: 'EdFirst',
    description:
      'Turns lecture videos and PDFs into a study workspace — an outline, source-linked notes, quizzes graded from the source and a tutor that answers only from your material — with learning commitments escrowed on-chain.',
    stack: ['Next.js', 'Express', 'TypeScript', 'pgvector', 'Gemini', 'Solidity', 'Docker'],
    code: 'https://github.com/kamboj-sajan/Edfirst',
  },
  {
    name: 'Pocket AOI',
    description:
      'Finds assembly mistakes on a circuit board from one phone photo by comparing it with a known-good golden board, then says what each fault will break. SAM 3.1 locates the parts, classical vision flags suspects and Muse Glimmer can only confirm or reject them. Flagged 86% of on-board defects across 134 real VisA photos. Built for the Meta Global AI Developer Hackathon.',
    stack: ['Python', 'SAM 3.1', 'Muse Glimmer 30B', 'OpenCV', 'Gradio'],
    code: 'https://github.com/kamboj-sajan/Pocket-AOI',
    demo: 'https://youtu.be/38sRM_zsY7Y',
  },
  {
    name: 'Precision PR Reviewer',
    description:
      'AI pull-request reviewer that pairs Tree-sitter AST queries with a ChromaDB call-graph index, so it sees callers in untouched files. Webhooks are queued on SQS with retries and a dead-letter queue. On its 5-scenario benchmark: 100% precision and recall, against 50% and 67% for a diff-only baseline.',
    stack: ['FastAPI', 'Node.js', 'LangChain', 'Tree-sitter', 'ChromaDB', 'MongoDB', 'Amazon SQS'],
    code: 'https://github.com/kamboj-sajan/Precision-PR-Reviewer',
  },
  {
    name: 'Viva',
    description:
      'Interviews you about your own GitHub repos like a senior engineer, then grades your spoken answers against the actual code. When you’re wrong, it shows the exact lines that prove it, linked to GitHub.',
    stack: ['Python', 'FastAPI', 'pgvector', 'tree-sitter', 'React', 'Azure OpenAI'],
    live: 'https://viva.victoriousbeach-5e8cd7ae.koreacentral.azurecontainerapps.io',
    code: 'https://github.com/kamboj-sajan/Viva',
  },
  {
    name: 'Wayfinder',
    description:
      'Autonomous testing agent: point it at a URL and it explores the app in a real browser, checks invariants after every action, learns from past runs and replays the traversal as a state graph — no test scripts.',
    stack: ['TypeScript', 'LangGraph', 'Playwright', 'Qdrant', 'React Flow', 'Azure'],
    code: 'https://github.com/kamboj-sajan/Wayfinder',
    demo: 'https://drive.google.com/file/d/1-7oueO3SMrvWXI1vLhPWmnbxOXuc2fpt/view?usp=sharing',
  },
  {
    name: 'Retail Reviews Lakehouse',
    description:
      'Data lake and warehouse on AWS over 64M Amazon reviews: PySpark on Glue through raw, cleaned and curated layers, monthly incremental loads with Step Functions that change nothing when re-run, a quality gate that quarantines bad rows, and benchmarks of the same queries on every layer.',
    stack: ['PySpark', 'AWS Glue', 'Step Functions', 'Athena', 'Redshift', 'Terraform'],
    code: 'https://github.com/kamboj-sajan/retail-reviews-lakehouse',
  },
  {
    name: 'Nimbus',
    description:
      'Real-time collaborative cloud IDE with a Monaco editor, a real terminal, live preview and an isolated Kubernetes runtime per user.',
    stack: ['React', 'Express 5', 'Socket.IO', 'node-pty', 'Drizzle', 'Kubernetes'],
    code: 'https://github.com/kamboj-sajan/Nimbus',
  },
  {
    name: 'Alzheimer’s Speech Detection',
    description:
      'Detects dementia and MCI from spontaneous speech by fusing Wav2Vec2 audio, BERT transcript and prosodic features through stacked co-attention layers. ROC-AUC 0.889 ± 0.016 on the PROCESS-2 official test split, over 5 seeds.',
    stack: ['PyTorch', 'Wav2Vec2', 'BERT', 'librosa', 'spaCy'],
    code: 'https://github.com/kamboj-sajan/AlzeimerSpeechDetection',
  },
  {
    name: 'AskPDF',
    description:
      'RAG app to chat with your PDFs: LangChain chunking and vector search, with persistent multi-document chat sessions.',
    stack: ['React', 'Express', 'LangChain', 'Gemini', 'PostgreSQL', 'Redis'],
    live: 'https://askpdf-livid.vercel.app/',
    code: 'https://github.com/kamboj-sajan/AskPdf',
  },
  {
    name: 'Cisco Office Network Lab',
    description:
      'Two-site enterprise network: multi-area OSPF, eBGP to two ISPs with automatic failover, a GRE-over-IPsec VPN and a Python checker that cross-validates all 11 device configs.',
    stack: ['Cisco IOS', 'OSPF', 'BGP', 'IPsec', 'Python'],
    code: 'https://github.com/kamboj-sajan/cisco-office-network-lab',
  },
  {
    name: 'Zomato Bangalore Dashboard',
    description:
      'Interactive dashboard on what drives ratings across 9,359 Bangalore restaurants, filterable by area, format, price, online ordering and table booking, with a Power BI version of the report.',
    stack: ['Python', 'pandas', 'Streamlit', 'Plotly', 'Power BI'],
    live: 'https://zomato-bangalore-dashboard.streamlit.app',
    code: 'https://github.com/kamboj-sajan/Zomato-Data-Analysis-Dashboard-main',
  },
  {
    name: 'Pixi',
    description:
      'AI image editing SaaS: photo restore, recolor, object and background removal and generative fill, with a credits system and Stripe payments.',
    stack: ['Next.js', 'TypeScript', 'Cloudinary', 'MongoDB', 'Stripe'],
    code: 'https://github.com/kamboj-sajan/Pixi',
  },
  {
    name: 'Medify',
    description: 'Doctor appointment booking with video consultations.',
    stack: ['Next.js', 'Prisma', 'Vonage'],
    code: 'https://github.com/kamboj-sajan/medify',
  },
  {
    name: 'LeetCode Solutions',
    description: '1,200+ C++ solutions.',
    stack: ['C++'],
    code: 'https://github.com/kamboj-sajan/leetcode',
  },
];

export interface Achievement {
  title: string;
  detail: string;
  icon: LucideIcon;
  links?: { label: string; href: string }[];
}

export const achievements: Achievement[] = [
  {
    title: 'LeetCode Knight',
    detail: 'Peak rating 2041 · top 3% globally · 780+ problems solved',
    icon: Trophy,
    links: [{ label: 'LeetCode', href: 'https://leetcode.com/u/Sajan__kamboj/' }],
  },
  {
    title: 'Codeforces Specialist',
    detail: 'Peak rating 1456 · CodeChef max rating 1626',
    icon: Swords,
    links: [
      { label: 'Codeforces', href: 'https://codeforces.com/profile/kambojsajan646' },
      { label: 'CodeChef', href: 'https://www.codechef.com/users/mysterious_98' },
    ],
  },
  {
    title: 'Ericsson Edge Academia 2.0',
    detail: 'Selected in the Top 700 · 5G, AI, IoT & Telecom',
    icon: Radio,
  },
  {
    title: 'TVS Credit E.P.I.C 7.0',
    detail: 'National Finalist',
    icon: Award,
  },
  {
    title: 'Google Cloud Gen AI Academy',
    detail: 'APAC 2026 · built and deployed AI agents on Cloud Run',
    icon: Cloud,
  },
  {
    title: 'WeMakeDevs × AWS',
    detail: 'Built AfterPass for Environmental Hacks (Bharat Builds Tour), Air track',
    icon: Leaf,
  },
  {
    title: 'Meta Global AI Developer Hackathon',
    detail: 'Built Pocket AOI for the manufacturing track: circuit-board inspection from one phone photo',
    icon: CircuitBoard,
    links: [
      { label: 'Code', href: 'https://github.com/kamboj-sajan/Pocket-AOI' },
      { label: 'Demo', href: 'https://youtu.be/38sRM_zsY7Y' },
    ],
  },
  {
    title: 'Open Source · Hugging Face',
    detail: 'Reported two torch.compile(fullgraph=True) training bugs in Whisper and Wav2Vec2 in transformers, and opened a PR to fix the Wav2Vec2 one',
    icon: GitPullRequest,
    links: [
      { label: 'Pull request', href: 'https://github.com/huggingface/transformers/pull/50544' },
      { label: 'Issue', href: 'https://github.com/huggingface/transformers/issues/50459' },
    ],
  },
];

export const marqueeImages = [
  'afterpass-hero',
  'ledgerline',
  'codenova-editor',
  'afterpass-smoke',
  'issue-intelligence',
  'neuropilot-hero',
  'riscv-block',
  'askpdf',
  'pocket-aoi',
  'afterpass-scars',
  'portfolio-v1-hero',
  'hwdiag-latency',
  'codenova-pricing',
  'afterpass-ask',
  'afterpass-overview',
  'lakehouse-dashboard',
  'mocha-delight',
  'riscv-waveform',
  'neuropilot-features',
  'afterpass-delhi',
  'speech-seeds',
  'portfolio-v1-skills',
  'codenova-snippets',
  'afterpass-story',
  'hwdiag-bandwidth',
  'portfolio-v1-work',
].map((name) => `/images/marquee/${name}.webp`);
