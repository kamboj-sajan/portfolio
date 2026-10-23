import { Award, Cloud, Leaf, Radio, Swords, Trophy } from 'lucide-react';
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
  'I’m an ECE (IoT) undergrad at NSUT Delhi who builds AI-powered web apps with Next.js, Node.js and PostgreSQL, competes in C++ on LeetCode and Codeforces, and goes close to the metal with RISC-V cores and PCBs. Let’s build something incredible together!';

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
    name: 'Full-Stack Web',
    description:
      'Production web apps in Next.js, React and TypeScript on Node.js and Express — typed APIs, auth, payments, webhooks and real-time sync over PostgreSQL, Prisma and Redis.',
  },
  {
    name: 'Applied AI',
    description:
      'RAG pipelines, AI tutors and autonomous agents with LangChain, LangGraph, Gemini, Azure OpenAI and Bedrock — grounded in sources, with citations instead of guesses.',
  },
  {
    name: 'Cloud & DevOps',
    description:
      'Docker, Kubernetes and GitHub Actions; serverless pipelines on AWS Lambda and Step Functions; deploys to Cloud Run, Azure Container Apps, Amplify and Vercel.',
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
    name: 'Precision PR Reviewer',
    description:
      'AI pull-request reviewer that pairs Tree-sitter AST queries with a ChromaDB call-graph index, so it sees callers in untouched files. On its 5-scenario benchmark: 100% precision and recall, against 50% and 67% for a diff-only baseline.',
    stack: ['FastAPI', 'Node.js', 'LangChain', 'Tree-sitter', 'ChromaDB', 'MongoDB'],
    code: 'https://github.com/kamboj-sajan/Precision-PR-Reviewer',
  },
  {
    name: 'Wayfinder',
    description:
      'Autonomous testing agent: point it at a URL and it explores the app in a real browser, checks invariants after every action, learns from past runs and replays the traversal as a state graph — no test scripts.',
    stack: ['TypeScript', 'LangGraph', 'Playwright', 'Qdrant', 'React Flow', 'Azure'],
    code: 'https://github.com/kamboj-sajan/Wayfinder',
  },
  {
    name: 'Nimbus',
    description:
      'Real-time collaborative cloud IDE with a Monaco editor, a real terminal, live preview and an isolated Kubernetes runtime per user.',
    stack: ['React', 'Express 5', 'Socket.IO', 'node-pty', 'Drizzle', 'Kubernetes'],
    code: 'https://github.com/kamboj-sajan/Nimbus',
  },
  {
    name: 'Viva',
    description:
      'Interviews you about your own GitHub repos like a senior engineer, then grades your spoken answers against the actual code, citing the exact file and lines.',
    stack: ['Python', 'pgvector', 'tree-sitter', 'Azure OpenAI'],
    code: 'https://github.com/kamboj-sajan/Viva',
    status: 'In progress',
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
];

export const marqueeImages = [
  'afterpass-hero',
  'codenova-editor',
  'afterpass-smoke',
  'neuropilot-hero',
  'riscv-block',
  'askpdf',
  'afterpass-scars',
  'portfolio-v1-hero',
  'hwdiag-latency',
  'codenova-pricing',
  'afterpass-ask',
  'afterpass-overview',
  'mocha-delight',
  'riscv-waveform',
  'neuropilot-features',
  'afterpass-delhi',
  'portfolio-v1-skills',
  'codenova-snippets',
  'afterpass-story',
  'hwdiag-bandwidth',
  'portfolio-v1-work',
].map((name) => `/images/marquee/${name}.webp`);
