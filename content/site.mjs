// Single source of truth for portfolio content.
// Edit this file, then run `npm run build` to regenerate index.html and projects/*.html.
//
// Content rule: everything here comes from the previous version of the portfolio.
// Do not add metrics, employers, technologies or architecture that are not real.

export const profile = {
  name: 'Daksh Goti',
  role: 'Software Engineer',
  eyebrow: ['Software Engineer', 'AI', 'Backend', 'Full Stack'],
  headline: 'I build scalable systems and AI-powered products.',
  summary:
    'Software Engineer with 3+ years of experience building backend services, full-stack applications, distributed systems, and AI-powered solutions with Python, Java, React, AWS, and modern GenAI tooling.',
  signals: ['3+ years experience', 'M.S. Computer Science', 'AI + Backend + Full Stack'],
  // City/region only — no street address.
  location: 'Long Beach, CA',
  email: 'daksh.g@myhotmail.net',
  github: 'https://github.com/dakshgoti14',
  linkedin: 'https://www.linkedin.com/in/dakshgoti',
  // Hosted on Google Drive (the same file the previous site linked to).
  resume: 'https://drive.google.com/file/d/1qJRzlVpfweuOgToqPl3rJtS8fSuhHnm-/view?usp=sharing',
  photo: 'assets/img/daksh-goti.jpg',
  // The same photo with its background removed locally (scripts/cutout.swift); WebP with transparency, keyed by width.
  cutout: { 520: 'assets/img/portrait-cutout-520.webp', 780: 'assets/img/portrait-cutout-780.webp', 1040: 'assets/img/portrait-cutout-1040.webp' },
  // Square crop of the same photo (with its sunset background) for the About page.
  round: { 480: 'assets/img/portrait-round-480.webp', 720: 'assets/img/portrait-round-720.webp', 960: 'assets/img/portrait-round-960.webp' },
  siteUrl: 'https://dakshgoti14.github.io',
};

// Hero: a one-line lead under the headline, plus the editorial blocks beside the portrait.
export const hero = {
  lead: 'I build scalable systems and AI-powered products — backend services, distributed systems, and GenAI applications.',
  side: [
    {
      label: 'About me',
      body: 'AI Software Engineer at ServiceNow, building generative AI services, retrieval systems, and backend platforms.',
      link: { href: 'about/', text: 'More about me' },
    },
    {
      label: 'My work',
      body: 'Six case studies — from a multi-agent document pipeline to a vector database built from the internals up.',
      link: { href: 'projects/', text: 'Browse projects' },
    },
  ],
};

// Inner pages. Intros restate facts that appear elsewhere on the site.
export const aboutPage = {
  title: ['Nice to meet you,', 'I’m Daksh Goti'],
  storyLabel: 'My story',
  storyTitle: 'Where software engineering meets AI',
  glanceTitle: '3+ years across backend, AI, and full-stack work',
  // "At a glance" columns. Core stack is a subset of `skills`; certifications and companies are listed below.
  coreStack: ['Python', 'Java', 'TypeScript', 'FastAPI', 'Spring Boot', 'React'],
};

export const experiencePage = {
  lead: 'Generative AI services, retrieval systems, and backend platforms at ServiceNow; event-driven systems and web applications at Orion Technolab.',
};

export const projectsPage = {
  lead: 'Case studies covering the problem, architecture, and engineering decisions — plus my professional work and open-source repositories.',
};

export const educationPage = {
  title: ['Education &', 'certifications'],
  lead: 'A master’s in Computer Science from California State University, Long Beach, a bachelor’s in Computer Science & Engineering, and cloud and AI credentials.',
};

export const contactPage = {
  title: ['Let’s build', 'something useful.'],
  lead: 'I’m always interested in hard engineering problems, AI applications, and opportunities to build products at scale.',
};

// Titles and descriptions for the inner pages (the homepage uses `seo`).
export const pageMeta = {
  about: {
    title: 'About | Daksh Goti — Software Engineer',
    description: 'About Daksh Goti, a Software Engineer building backend services, distributed systems, and AI-powered products with Python, Java, React, AWS, and GenAI tooling.',
  },
  experience: {
    title: 'Experience | Daksh Goti — Software Engineer',
    description: 'Work experience of Daksh Goti: AI Software Engineer at ServiceNow and Software Engineer at Orion Technolab — generative AI, microservices, and event-driven systems.',
  },
  projects: {
    title: 'Projects | Daksh Goti — Software Engineer',
    description: 'Case studies, professional work, and open-source projects by Daksh Goti, from a multi-agent document pipeline to a vector database built from the internals up.',
  },
  education: {
    title: 'Education & Certifications | Daksh Goti',
    description: 'M.S. Computer Science from California State University, Long Beach; B.Tech. in Computer Science & Engineering; AWS and IBM credentials.',
  },
  contact: {
    title: 'Contact | Daksh Goti — Software Engineer',
    description: 'Get in touch with Daksh Goti, a Software Engineer in Long Beach, CA: email, LinkedIn, GitHub, and résumé.',
  },
};

// The tool strip under the hero (every name here also appears in `skills`).
export const toolbelt = ['Python', 'Java', 'TypeScript', 'FastAPI', 'Spring Boot', 'React', 'Next.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Apache Kafka', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'OpenAI API', 'LangChain'];

export const seo = {
  title: 'Daksh Goti | Software Engineer | AI, Backend & Full Stack',
  description:
    'Daksh Goti is a Software Engineer building scalable backend systems, AI-powered applications, distributed systems, and full-stack products.',
  ogImage: 'assets/img/og-image.png',
};

export const about = [
  "I'm a Software Engineer focused on building scalable backend systems, AI-powered applications, and intuitive full-stack products.",
  "Over the past 3+ years, I've worked across enterprise and technology environments, building APIs, microservices, event-driven systems, and data-driven applications with Python, Java, React, AWS, and modern GenAI technologies.",
  "I'm particularly interested in where software engineering meets AI — turning LLMs, retrieval systems, and automation into reliable products that solve real problems.",
];

export const aboutIntro = {
  headline: 'Building production systems since 2022',
  // Every number here is stated elsewhere on the site.
  stats: [
    { value: '3+', label: 'Years of experience' },
    { value: '6', label: 'Case studies with architecture' },
    { value: '−18%', label: 'API latency at ServiceNow' },
  ],
};

export const capabilities = [
  {
    title: 'AI-Powered Applications',
    icon: 'sparkles',
    body: 'LLM applications, RAG pipelines, intelligent workflows, AI-assisted products, and automation.',
    tech: ['OpenAI API', 'LangChain', 'RAG', 'Vector Search', 'Python', 'FastAPI'],
  },
  {
    title: 'Scalable Backend Systems',
    icon: 'server',
    body: 'Production APIs, microservices, service integrations, authentication, data access, and backend architecture.',
    tech: ['Python', 'Java', 'Spring Boot', 'FastAPI', 'Node.js', 'REST', 'GraphQL'],
  },
  {
    title: 'Distributed & Real-Time Systems',
    icon: 'network',
    body: 'Event-driven systems, streaming pipelines, caching, and asynchronous message processing.',
    tech: ['Kafka', 'Spark Streaming', 'Redis', 'Microservices', 'Event-Driven Architecture'],
  },
  {
    title: 'Cloud-Native Engineering',
    icon: 'cloud',
    body: 'Containerized services, cloud infrastructure, CI/CD, and production operations.',
    tech: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'],
  },
];

export const experience = [
  {
    company: 'ServiceNow',
    url: 'https://www.servicenow.com/',
    role: 'AI Software Engineer',
    start: 'Feb 2025',
    end: 'Present',
    location: 'California',
    summary: 'Generative AI services, retrieval systems, and workflow automation for internal support.',
    highlights: [
      'Architected generative AI solutions with the OpenAI API, LangChain, and RAG for internal support workflows, reducing knowledge retrieval time by 14% and improving response accuracy.',
      'Engineered FastAPI microservices backed by PostgreSQL and Redis, lowering API response latency by 18% for AI-driven applications.',
      'Built workflow automation pipelines on AWS Lambda, Step Functions, and DynamoDB, cutting manual processing effort by 12%.',
      'Optimized retrieval with vector search strategies and prompt engineering, increasing relevant content matching by 11% for enterprise users.',
      'Streamlined CI/CD with Docker, Kubernetes, Terraform, and GitHub Actions, shortening release cycles by 15% and improving deployment reliability.',
    ],
    tech: ['Python', 'FastAPI', 'OpenAI API', 'LangChain', 'PostgreSQL', 'Redis', 'AWS Lambda', 'Step Functions', 'DynamoDB', 'Kubernetes', 'Terraform'],
  },
  {
    company: 'Orion Technolab',
    url: 'https://www.oriontechnolab.com/',
    role: 'Software Engineer',
    start: 'Jan 2022',
    end: 'Jul 2023',
    location: 'India',
    summary: 'Backend services, event-driven systems, and web applications across Java, React, and AWS.',
    highlights: [
      'Built backend services with Java, Spring Boot, and PostgreSQL, increasing transaction processing capacity by 24% while maintaining application stability.',
      'Designed event-driven and real-time streaming architectures with Apache Kafka and asynchronous messaging, reducing inter-service processing delays by 21% and data delivery lag by 19%.',
      'Modernized web applications with React, TypeScript, Redux, and GraphQL, improving user engagement metrics by 17% through better application performance.',
      'Refactored database schemas and query execution plans across MySQL and MongoDB, improving query performance by 26% for business-critical applications.',
      'Automated infrastructure provisioning with AWS and Terraform and improved CI/CD with Jenkins, GitLab CI/CD, Docker, and Kubernetes — cutting environment setup time by 28% and raising deployment success rates by 22%.',
    ],
    tech: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'MySQL', 'MongoDB', 'React', 'TypeScript', 'GraphQL', 'AWS', 'Terraform', 'Jenkins'],
  },
];

// Every entry gets a case-study page. Entries with `featured: false` lead the "More projects" list.
// Architecture diagrams are simplified views of each project's stated components.
// `tiers` render top-to-bottom; a tier with several nodes fans out from the tier above.
export const projects = [
  {
    slug: 'medinsight',
    name: 'MedInsight',
    tagline: 'AI-enabled healthcare dashboard',
    summary:
      'A real-time clinical insights platform that uses generative AI to summarize patient trends and surface actionable recommendations for care teams.',
    stack: ['Next.js', 'React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'OpenAI API', 'LangChain', 'AWS Lambda', 'Step Functions', 'S3', 'Docker', 'Kubernetes'],
    cardStack: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'OpenAI API', 'LangChain'],
    metrics: [
      { value: '50K+', label: 'records processed daily' },
      { value: '40%', label: 'faster data retrieval' },
      { value: '100+', label: 'clinicians on the dashboards' },
    ],
    problem:
      'Care teams make decisions from a high volume of patient data. Reading raw records to spot trends is slow, and the insight has to arrive while it is still actionable.',
    solution:
      'A full-stack platform that ingests clinical records through an authenticated FastAPI backend, uses an LLM layer to summarize patient trends into recommendations, and presents them in React dashboards built for clinicians.',
    architecture: {
      tiers: [
        [{ label: 'Clinician dashboards', meta: 'Next.js · React · TypeScript' }],
        [{ label: 'API service', meta: 'FastAPI · JWT auth' }],
        [
          { label: 'Clinical data', meta: 'PostgreSQL' },
          { label: 'AI layer', meta: 'LangChain · OpenAI API', accent: true },
          { label: 'Serverless jobs', meta: 'Lambda · Step Functions · S3' },
        ],
      ],
    },
    implementation: [
      { title: 'Backend', body: 'FastAPI service with JWT authentication that processes 50K+ records a day and serves the dashboards.' },
      { title: 'AI layer', body: 'OpenAI API orchestrated with LangChain to summarize patient trends and generate recommendations for care teams.' },
      { title: 'Frontend', body: 'React and TypeScript dashboards used by 100+ clinicians for faster, more accurate decisions.' },
      { title: 'Infrastructure', body: 'Microservices containerized with Docker and Kubernetes for scaling and CI/CD; serverless operations on AWS Lambda and S3, coordinated by Step Functions.' },
    ],
    challenges: [
      {
        title: 'Serving high-volume clinical data quickly',
        approach: 'Built the FastAPI backend as the single, authenticated access layer for 50K+ daily records feeding the dashboards.',
        result: 'Data retrieval time reduced by 40%.',
      },
      {
        title: 'Scaling operations without a large ops burden',
        approach: 'Containerized the microservices with Docker and Kubernetes, and moved scheduled workloads to AWS Lambda and S3 orchestrated by Step Functions.',
        result: 'Scalable operations with minimal maintenance.',
      },
    ],
    // TODO(daksh): the repository README lists a somewhat different stack (Next.js, FastAPI, SQLite/PostgreSQL,
    // ChromaDB, GPT-4o-mini, WebSockets, Docker) than the summary above (AWS Lambda, Step Functions, Kubernetes).
    // Confirm which description is current.
    repo: 'https://github.com/dakshgoti14/MedInsight',
  },
  {
    slug: 'orderstream',
    name: 'OrderStream',
    tagline: 'Distributed order management system',
    summary:
      'An event-driven backend that processes 200K+ healthcare orders a day on fault-tolerant Kafka streams, with real-time admin dashboards and FHIR-based interoperability.',
    stack: ['Spring Boot', 'Apache Kafka', 'Node.js', 'React', 'Redux', 'GraphQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'FHIR'],
    cardStack: ['Spring Boot', 'Kafka', 'GraphQL', 'MongoDB', 'Redis', 'Kubernetes'],
    metrics: [
      { value: '200K+', label: 'orders processed per day' },
      { value: '<200ms', label: 'order-processing latency' },
      { value: 'FHIR', label: 'interop with labs, pharmacies, insurers' },
    ],
    problem:
      'Healthcare orders move between providers, labs, pharmacies, and insurers. At hundreds of thousands of orders a day, the system has to tolerate failures, stay available, and exchange data in a standard format instead of relying on manual coordination.',
    solution:
      'A distributed order platform built on Spring Boot microservices and Kafka streams, with Redis caching for availability, GraphQL-backed admin dashboards for monitoring, and FHIR integrations with external partners.',
    architecture: {
      tiers: [
        [{ label: 'Admin dashboards', meta: 'React · Redux' }],
        [{ label: 'GraphQL API', meta: 'Queries · monitoring' }],
        [{ label: 'Order microservices', meta: 'Spring Boot · Node.js' }],
        [
          { label: 'Event streams', meta: 'Apache Kafka', accent: true },
          { label: 'Order store', meta: 'MongoDB' },
          { label: 'Cache', meta: 'Redis' },
        ],
      ],
      external: { label: 'FHIR integrations', meta: 'Labs · pharmacies · insurers' },
    },
    implementation: [
      { title: 'Event backbone', body: 'Fault-tolerant Kafka streams carry order events between services, processing 200K+ orders per day.' },
      { title: 'Services', body: 'Spring Boot and Node.js microservices with Redis caching for high availability.' },
      { title: 'Dashboards', body: 'React and Redux dashboards backed by GraphQL let administrators monitor order processing, with latency under 200ms.' },
      { title: 'Interoperability', body: 'FHIR standards for data exchange with labs, pharmacies, and insurers; deployments automated with Docker and Kubernetes.' },
    ],
    challenges: [
      {
        title: 'Not losing orders under failure',
        approach: 'Built order processing on fault-tolerant Kafka streams so services communicate through durable events.',
        result: '200K+ orders processed per day.',
      },
      {
        title: 'Staying available under load',
        approach: 'Split the domain into microservices, added Redis caching, and automated deployments with Docker and Kubernetes.',
        result: 'Order-processing latency kept under 200ms, monitored from the admin dashboards.',
      },
      {
        title: 'Exchanging data with external partners',
        approach: 'Integrated FHIR standards for interoperability with labs, pharmacies, and insurers.',
        result: 'Reduced manual coordination between parties.',
      },
    ],
    // TODO(daksh): replace with the OrderStream repository URL — currently links to the GitHub profile.
    repo: null,
  },
  {
    slug: 'contextflow',
    name: 'ContextFlow',
    tagline: 'Multi-agent document processing platform',
    summary:
      'An intelligent document-processing platform that turns PDFs, images, and scans into structured, searchable knowledge through a multi-agent AI pipeline, with RAG search and live WebSocket progress.',
    stack: ['React', 'TypeScript', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'FAISS', 'LangChain', 'OpenAI API', 'WebSockets', 'Prometheus', 'Docker'],
    cardStack: ['FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'FAISS', 'LangChain'],
    metrics: [
      { value: '7', label: 'specialized AI agents' },
      { value: '10', label: 'pipeline stages, tracked & retried' },
      { value: 'Live', label: 'WebSocket progress per agent' },
    ],
    problem:
      'Unstructured documents hold information teams need, but extracting it reliably takes classification, extraction, validation, and compliance checks — with sensitive data protected along the way and a person able to correct what the model gets wrong.',
    solution:
      'A FastAPI gateway queues each upload to Celery workers, where an orchestrator runs a deterministic per-document pipeline of specialized agents, stores results in PostgreSQL and a per-tenant FAISS index, and streams progress to a React dashboard over WebSockets.',
    architecture: {
      pipeline: { label: 'Per-document pipeline', steps: ['Classify', 'Extract', 'Validate', 'Mask PII', 'Compliance', 'Summarize', 'Embed & index'] },
      tiers: [
        [{ label: 'Dashboard', meta: 'React · TypeScript' }],
        [{ label: 'API gateway', meta: 'FastAPI · WebSockets' }],
        [{ label: 'Task queue', meta: 'Celery · Redis' }],
        [{ label: 'Agent orchestrator', meta: 'State machine · retries · events', accent: true }],
        [
          { label: 'Metadata', meta: 'PostgreSQL' },
          { label: 'Vector store', meta: 'FAISS' },
          { label: 'LLM', meta: 'LangChain · OpenAI API' },
        ],
      ],
    },
    implementation: [
      { title: 'Orchestration', body: 'A deterministic state machine runs each document through the pipeline, persisting step status and timestamps and retrying transient model or API failures with exponential backoff (up to 3 attempts).' },
      { title: 'Agents', body: 'Specialized agents for classification, vision extraction, validation, PII detection and masking, compliance analysis, and summarization share a document context and write their outputs to PostgreSQL.' },
      { title: 'Knowledge & RAG', body: 'Content is chunked by page and section, embedded with document, page, chunk, and tenant metadata into a per-tenant FAISS index; answers cite the document, page, and chunk they came from.' },
      { title: 'Real time & operations', body: 'Workers publish progress events to Redis pub/sub and a FastAPI WebSocket endpoint fans them out to the dashboard, alongside Prometheus metrics and JWT auth with role-based access.' },
    ],
    challenges: [
      {
        title: 'Keeping a multi-step AI pipeline reliable',
        approach: 'Modelled each document as a deterministic state machine driven by an orchestrator; every agent call is retried with exponential backoff and its status is persisted.',
        result: 'Transient model or API failures retry instead of failing the document, and every step is traceable.',
      },
      {
        title: 'Showing progress on long-running work',
        approach: 'Moved processing onto Celery workers that publish step events to Redis pub/sub, fanned out to clients by a FastAPI WebSocket endpoint.',
        result: 'The dashboard renders a live pipeline timeline with per-agent outputs.',
      },
      {
        title: 'Trusting low-confidence extractions',
        approach: 'Each extracted field carries a confidence score and provenance; low-confidence or invalid values are flagged for human review, and corrections are stored as feedback.',
        result: 'A human-in-the-loop path to correct extractions before they are relied on.',
      },
    ],
    repo: 'https://github.com/dakshgoti14/contextflow',
  },
  {
    slug: 'vectorforgedb',
    name: 'VectorForgeDB',
    tagline: 'Vector database built from the internals up',
    summary:
      'A vector database with approximate-nearest-neighbor search (HNSW and IVF), hybrid BM25 + semantic retrieval, metadata pre-filtering, a write-ahead log for crash recovery, and a Python SDK.',
    stack: ['Python', 'FastAPI', 'HNSW', 'FAISS', 'BM25', 'RocksDB', 'Kafka', 'Prometheus', 'Docker', 'Kubernetes'],
    cardStack: ['Python', 'FastAPI', 'HNSW', 'FAISS', 'RocksDB', 'Kubernetes'],
    // TODO(daksh): benchmarks/results.json in the repo covers 1K vectors (HNSW 0.1ms P95, IVF recall 0.525),
    // while the README table shows a 10K-vector run (below). Re-run the 10K benchmark and commit the results.
    metrics: [
      { value: '3', label: 'index types: Flat, HNSW, IVF' },
      { value: '~4ms', label: 'HNSW P95 · README 10K-vector benchmark' },
      { value: '0.97', label: 'HNSW recall@10 · same benchmark' },
    ],
    problem:
      'Retrieval for AI applications needs nearest-neighbor search that stays fast as collections grow, can be constrained by metadata, matches exact keywords as well as meaning, and does not lose writes when a process crashes.',
    solution:
      'A FastAPI service over a pluggable engine: Flat, HNSW, and IVF indexes behind one interface, a query planner that pre-filters candidates by metadata, BM25 + vector score fusion, RocksDB persistence with index snapshots, a write-ahead log, and Kafka replication hooks.',
    architecture: {
      pipeline: { label: 'Write path', steps: ['Append to WAL', 'Apply to index & storage', 'Truncate WAL'] },
      tiers: [
        [{ label: 'Clients', meta: 'Python SDK · REST' }],
        [{ label: 'API', meta: 'FastAPI · Prometheus' }],
        [{ label: 'Query planner', meta: 'Metadata pre-filter · hybrid BM25 fusion', accent: true }],
        [
          { label: 'ANN indexes', meta: 'HNSW · IVF · Flat' },
          { label: 'Storage', meta: 'RocksDB · WAL' },
          { label: 'Replication', meta: 'Kafka · in-memory' },
        ],
      ],
    },
    implementation: [
      { title: 'Indexes', body: 'A pluggable index layer with brute-force Flat search as the exact baseline, graph-based HNSW (hnswlib), and cluster-based IVF (FAISS), chosen per collection.' },
      { title: 'Query', body: 'A query planner pre-filters candidate IDs by metadata before the ANN search; hybrid mode fuses BM25 keyword and semantic scores, weighting semantic at 0.6 by default.' },
      { title: 'Durability', body: 'Inserts and deletes are appended to a write-ahead log before they are applied; on startup each collection replays its log, with vectors and metadata persisted in RocksDB alongside index snapshots.' },
      { title: 'Operations', body: 'FastAPI REST API and a Python SDK, Prometheus metrics at /metrics, Kafka replication hooks with an in-memory fallback, and Docker and Kubernetes manifests.' },
    ],
    challenges: [
      {
        title: 'Trading speed for recall',
        approach: 'Implemented three index strategies behind one interface, plus a benchmark harness that reports P95 latency and recall@10 for each.',
        result: 'In the README’s 10K-vector benchmark, HNSW reaches ~4ms P95 at 0.97 recall@10, versus ~120ms for exact search.',
      },
      {
        title: 'Filtering without a separate pass',
        approach: 'Added a query planner that narrows candidates by metadata before the ANN search runs.',
        result: 'Metadata-constrained search, such as filtering by country or topic, in a single query.',
      },
      {
        title: 'Not losing writes on a crash',
        approach: 'Every insert and delete is appended to a write-ahead log first and the log is replayed when a collection loads.',
        result: 'Writes in flight at the time of a crash are recovered on restart.',
      },
    ],
    repo: 'https://github.com/dakshgoti14/vectorforgedb',
  },
  {
    slug: 'streamguard',
    name: 'StreamGuard',
    tagline: 'Real-time fraud detection pipeline',
    summary:
      'A streaming pipeline that scores 1M+ transaction events an hour for fraud in milliseconds, then automatically flags and blocks high-risk activity.',
    stack: ['Python', 'Apache Kafka', 'Spark Streaming', 'scikit-learn', 'Redis', 'FastAPI', 'AWS', 'Docker', 'Kubernetes'],
    cardStack: ['Kafka', 'Spark Streaming', 'scikit-learn', 'Redis', 'FastAPI', 'AWS'],
    metrics: [
      { value: '1M+', label: 'events scored per hour' },
      { value: '~98%', label: 'detection precision' },
      { value: '<1s', label: 'scoring with Redis features' },
    ],
    problem:
      'Fraud has to be caught while a transaction is in flight. That means scoring a high, bursty event volume with low latency and acting on the result automatically.',
    solution:
      'A Kafka-based streaming pipeline that scores events with an anomaly-detection model using Redis-backed feature lookups, an alerting service that flags and blocks high-risk transactions, and a FastAPI dashboard for live metrics.',
    architecture: {
      tiers: [
        [{ label: 'Transaction events', meta: '1M+ per hour' }],
        [{ label: 'Event log', meta: 'Apache Kafka · fault-tolerant topics' }],
        [{ label: 'Stream scoring', meta: 'Spark Streaming · scikit-learn · Redis features', accent: true }],
        [
          { label: 'Alerting service', meta: 'Flag & block high-risk' },
          { label: 'Monitoring', meta: 'FastAPI · live metrics' },
        ],
      ],
    },
    implementation: [
      { title: 'Ingestion', body: 'Fault-tolerant Kafka topics absorb 1M+ transaction events per hour.' },
      { title: 'Scoring', body: 'Anomaly-detection model with Redis-backed feature lookups for sub-second scoring at ~98% precision.' },
      { title: 'Action', body: 'Alerting service that automatically flags and blocks high-risk transactions.' },
      { title: 'Operations', body: 'Live metrics via a FastAPI monitoring dashboard; services containerized with Docker and Kubernetes on AWS.' },
    ],
    challenges: [
      {
        title: 'Scoring fast enough to block in flight',
        approach: 'Served model features from Redis so each event can be scored without slow lookups.',
        result: 'Sub-second scoring at ~98% precision.',
      },
      {
        title: 'Handling bursty traffic',
        approach: 'Buffered events in fault-tolerant Kafka topics and ran services on Kubernetes on AWS for horizontal scaling.',
        result: 'High availability under bursty load at 1M+ events per hour.',
      },
    ],
    // TODO(daksh): replace with the StreamGuard repository URL — currently links to the GitHub profile.
    repo: null,
  },
  {
    slug: 'documind',
    featured: false,
    name: 'DocuMind',
    tagline: 'RAG document intelligence platform',
    summary:
      'A retrieval-augmented generation platform where teams upload documents and ask questions in natural language, getting grounded answers with source citations.',
    stack: ['Python', 'FastAPI', 'LangChain', 'OpenAI API', 'PostgreSQL', 'pgvector', 'Next.js', 'TypeScript', 'Docker', 'AWS'],
    cardStack: ['Python', 'FastAPI', 'LangChain', 'pgvector', 'OpenAI API', 'Next.js'],
    metrics: [
      { value: '1M+', label: 'passages indexed' },
      { value: '~92%', label: 'answer relevance' },
      { value: 'Cited', label: 'source-grounded answers' },
    ],
    problem:
      'Teams lose time searching long documents for answers. A plain LLM chat over documents is fast but can hallucinate, so answers need to be grounded in the source and traceable back to it.',
    solution:
      'An ingestion pipeline that chunks, embeds, and indexes documents into pgvector, and a query path that combines hybrid retrieval, re-ranking, and prompt engineering to produce citation-backed answers streamed to a chat UI.',
    architecture: {
      pipeline: { label: 'Ingestion', steps: ['Upload', 'Chunk', 'Embed', 'Index in pgvector'] },
      tiers: [
        [{ label: 'Chat UI', meta: 'Next.js · TypeScript · streaming' }],
        [{ label: 'API service', meta: 'FastAPI · JWT auth' }],
        [{ label: 'RAG orchestration', meta: 'LangChain · hybrid search · re-ranking', accent: true }],
        [
          { label: 'Vector store', meta: 'PostgreSQL + pgvector' },
          { label: 'LLM', meta: 'OpenAI API' },
        ],
      ],
    },
    implementation: [
      { title: 'Ingestion', body: 'Pipeline that chunks, embeds, and indexes 1M+ passages into a pgvector store.' },
      { title: 'Retrieval', body: 'Hybrid semantic + keyword search for high-relevance results, followed by re-ranking.' },
      { title: 'Generation', body: 'LangChain orchestration with prompt engineering that produces grounded, citation-backed answers.' },
      { title: 'Delivery', body: 'Streaming Next.js chat UI and a FastAPI backend with JWT auth, containerized with Docker and deployed on AWS.' },
    ],
    challenges: [
      {
        title: 'Retrieving the right passages',
        approach: 'Combined semantic vector search with keyword search over the pgvector index, then re-ranked candidates before generation.',
        result: 'Answer relevance raised to ~92%.',
      },
      {
        title: 'Reducing hallucinations',
        approach: 'Grounded every response in retrieved passages with prompt engineering and returned source citations with each answer.',
        result: 'Citation-backed answers users can verify.',
      },
      {
        title: 'Keeping the chat responsive',
        approach: 'Streamed answers to a Next.js UI from a containerized FastAPI backend on AWS.',
        result: 'Scalable, low-latency inference.',
      },
    ],
    // TODO(daksh): replace with the DocuMind repository URL — currently links to the GitHub profile.
    repo: null,
  },
];

// Earlier academic and experimental work. Summaries, stacks, and links were checked against each GitHub
// repository (its README, dependency files, and source) in October 2026; the old detail pages in projects/
// describe different projects than their titles, so they are not used.
// TODO(daksh): confirm the three marked "confirm" below, and add a sentence about Kido Learn and Ad Banner Rent.
export const moreProjects = [
  {
    name: 'Disease Prediction & Doctor Recommendation',
    summary: 'Predicts the likely disease from the symptoms a patient enters, recommends a doctor for it, and lets the patient book an appointment and chat with that doctor.',
    // requirements.txt: Django, scikit-learn, psycopg2. Its README links to screenshots in another developer's
    // repository (anuj-glitch/Disease-Prediction-using-Django-and-machine-learning); credit it if this builds on that project.
    stack: ['Python', 'Django', 'scikit-learn', 'PostgreSQL'],
    repo: 'https://github.com/dakshgoti14/Sales-Prediction-and-Doctor-recommendation',
  },
  {
    name: 'Image Classification',
    summary: 'Serverless image classification on AWS: an image uploaded to S3 triggers a Lambda function, a CIFAR-10 model hosted on SageMaker classifies it, and the results are logged to CloudWatch.',
    stack: ['Python', 'AWS SageMaker', 'Lambda', 'S3', 'CloudWatch'],
    repo: 'https://github.com/dakshgoti14/Automate-Image-Classification',
  },
  {
    name: 'Sales Prediction',
    summary: 'A Django app for recording products and daily sales that forecasts future sales with an LSTM model and charts the predictions against actual figures.',
    // Stack from the repository (Django, Keras LSTM, Plotly); it previously linked to someone else's repository.
    stack: ['Python', 'Django', 'Keras', 'Plotly'],
    repo: 'https://github.com/dakshgoti14/Sales-Prediction',
  },
  {
    name: 'Transparent Subsidy Distribution',
    summary: 'A dashboard for beneficiaries of a blockchain-based subsidy system: it connects a MetaMask wallet through Web3.js and shows subsidy and application status, transaction history, and profile details.',
    stack: ['React', 'Web3.js', 'Ethereum', 'Tailwind CSS'],
    repo: 'https://github.com/dakshgoti14/-Transparent-Subsidy-Distribution-Systems-',
  },
  {
    name: 'Car Rental Website',
    summary: 'Customers search the fleet, book cars, and track their bookings; an admin panel manages vehicles, brands, and booking requests.',
    stack: ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS'],
    repo: 'https://github.com/dakshgoti14/Car-Ren-Project',
  },
  {
    name: 'Scube — Smart Society Management',
    summary: 'An Android app for residential societies: residents register with phone verification, then see a bulletin board, upcoming events and meetings, society services, and their profile.',
    // confirm: the previous site listed MSSQL, but the repository has no database code.
    stack: ['Android', 'Java', 'Material Design'],
    repo: 'https://github.com/dakshgoti14/Scube-Smart-Society-Management-System-',
  },
  {
    name: 'Social Distance Detector',
    // confirm: the repository is empty, so this comes from the title and the previous site's stack.
    summary: 'Hackathon project that detects people in camera footage and flags when they stand closer than a safe distance.',
    stack: ['Python', 'OpenCV', 'YOLOv3', 'scikit-learn'],
    repo: null,
  },
  {
    name: 'Kido Learn',
    // confirm: no public repository; add what the app does.
    summary: 'A mobile app built with Flutter, backed by Firebase.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    repo: null,
  },
  {
    name: 'Ad Banner Rent',
    // confirm: no public repository; add what the app does.
    summary: 'A mobile app built with Flutter, backed by Firebase and AWS.',
    stack: ['Flutter', 'Dart', 'Firebase', 'AWS'],
    repo: null,
  },
];

// Public repositories shown under "Building in public". Summaries and stacks come from each
// repository's README; language and last-push dates come from content/github.json (npm run github).
export const openSource = [
  {
    repo: 'computer-use-automation',
    name: 'Computer-Use Automation',
    summary: 'An integration layer for AI agents on apps with no API: an LLM discovers a task once by driving a browser, records it as a typed capability, then replays it deterministically with zero LLM calls.',
    stat: 'LLM discovery once → deterministic replay, verified checkpoints',
    stack: ['Python', 'Playwright', 'Google Gemini', 'FastAPI', 'Docker'],
  },
  {
    repo: 'Backend-Task-Orchestration-System',
    name: 'Task Orchestration Platform',
    summary: 'A distributed job scheduler for fault-tolerant background work: priority queues, cron scheduling, job dependencies, retries with dead-letter queues, and horizontally scaled workers.',
    stat: 'Priority + cron + dependency resolution across worker nodes',
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'BullMQ', 'GraphQL'],
  },
];

// Each principle is paired with a real decision from a case study (see the linked page for details).
export const principles = [
  {
    title: 'Scalability',
    icon: 'trending',
    body: 'Design systems that keep performing as traffic, users, and data volumes grow.',
    example: 'OrderStream moves orders between services on fault-tolerant Kafka streams, processing 200K+ a day.',
    ref: 'orderstream',
  },
  {
    title: 'Reliability',
    icon: 'shield',
    body: 'Build with failure handling and operational readiness in mind.',
    example: 'ContextFlow retries every agent call with exponential backoff and persists each step, so a transient model error doesn’t fail the document.',
    ref: 'contextflow',
  },
  {
    title: 'Performance',
    icon: 'gauge',
    body: 'Measure first, then optimize the path that matters.',
    example: 'VectorForgeDB ships a benchmark harness; in its README run, HNSW answers in ~4ms P95 versus ~120ms for exact search.',
    ref: 'vectorforgedb',
  },
  {
    title: 'Product thinking',
    icon: 'target',
    body: 'Build around real user problems, not technology for its own sake.',
    example: 'ContextFlow flags low-confidence extractions for human review instead of silently trusting the model.',
    ref: 'contextflow',
  },
];

export const skills = [
  { group: 'Languages', icon: 'code', items: ['Python', 'Java', 'TypeScript', 'JavaScript', 'SQL'] },
  { group: 'Backend & APIs', icon: 'server', items: ['FastAPI', 'Spring Boot', 'Node.js', 'Flask', 'REST', 'GraphQL', 'gRPC', 'OpenAPI / Swagger'] },
  { group: 'Frontend', icon: 'monitor', items: ['React', 'Next.js', 'Redux', 'Tailwind CSS'] },
  { group: 'AI / ML', icon: 'sparkles', items: ['OpenAI API', 'Anthropic Claude', 'LangChain', 'RAG', 'Vector search', 'FAISS', 'Hugging Face Transformers', 'PyTorch', 'TensorFlow', 'scikit-learn'] },
  { group: 'Data', icon: 'database', items: ['PostgreSQL', 'pgvector', 'MySQL', 'MongoDB', 'DynamoDB', 'Redis', 'Elasticsearch', 'Apache Spark'] },
  { group: 'Cloud & Infrastructure', icon: 'cloud', items: ['AWS', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Jenkins', 'GitLab CI/CD', 'Nginx'] },
  { group: 'Distributed Systems', icon: 'network', items: ['Apache Kafka', 'RabbitMQ', 'Spark Streaming', 'WebSockets', 'Microservices', 'Event-driven architecture'] },
];

export const education = [
  {
    degree: 'M.S. Computer Science',
    school: 'California State University, Long Beach',
    start: 'Aug 2023',
    end: 'May 2025',
    coursework: ['Algorithm Design', 'Cloud Computing', 'Distributed Systems'],
  },
  {
    degree: 'B.Tech. Computer Science & Engineering',
    school: 'Charotar University of Science and Technology',
    start: 'Jul 2020',
    end: 'Jun 2023',
    coursework: ['Database Management Systems', 'Algorithms & Optimization for Big Data', 'Machine Learning'],
  },
];

export const certifications = [
  { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', kind: 'Certification', url: 'https://www.credly.com/badges/a9fe7716-9d12-45f8-8ead-c9d79fa8f3dc' },
  { name: 'Cloud Pak for Integration Essentials', issuer: 'IBM', kind: 'Badge', url: 'https://www.credly.com/badges/19eade5f-812a-4abf-b1ce-cee60d817721' },
  // TODO(daksh): issuer for this certificate is not stated on the previous site.
  { name: 'Artificial Intelligence', issuer: null, kind: 'Certificate', url: 'https://drive.google.com/file/d/11S3hx4hhSikuAXOkYm94BUxg5OiYKxbN/view?usp=drive_link' },
];

// Site pages, in menu order. `path` is relative to the site root ("" is the homepage); each inner page
// is a directory with an index.html, so URLs read /about/, /experience/, and so on.
export const pages = [
  { key: 'home', path: '', label: 'Home' },
  { key: 'about', path: 'about/', label: 'About' },
  { key: 'experience', path: 'experience/', label: 'Experience' },
  { key: 'projects', path: 'projects/', label: 'Projects' },
  { key: 'education', path: 'education/', label: 'Education' },
  { key: 'contact', path: 'contact/', label: 'Contact' },
];
