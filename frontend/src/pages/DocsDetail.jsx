import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const DOCS_DATA = {
  "high-availability": {
    title: "High-Availability Architecture",
    subtitle: "Building resilient systems that never go offline.",
    image: "/images/high-availability.png",
    sections: [
      {
        heading: "The Problem",
        body: "A monolithic application is a single point of failure. If one feature crashes, the entire system goes down. Users experience downtime, data can be lost mid-transaction, and recovery requires restarting the whole application. This is unacceptable for any system handling real workloads."
      },
      {
        heading: "The Solution",
        body: "CodePulse splits responsibilities into independent microservices. The API Gateway handles authentication and request routing. The Worker Service handles heavy AI scanning. If the Worker crashes mid-scan, the API Gateway continues serving users without interruption. We run 2 replicas of the API Gateway — if one pod fails, Kubernetes instantly routes traffic to the second. Zero downtime."
      },
      {
        heading: "How It Works Internally",
        body: "Kubernetes manages pod health through Liveness and Readiness probes. A Liveness probe checks if the process is alive. A Readiness probe checks if it can accept traffic. If either fails, Kubernetes automatically restarts or removes the pod from the Service load balancer. The ReplicaSet controller ensures the desired number of pods is always running."
      }
    ],
    technical: [
      "ReplicaSet controller maintains desired pod count at all times",
      "Liveness probes detect crashed processes and trigger automatic restarts",
      "Readiness probes prevent routing traffic to pods still initializing",
      "Service-level load balancing distributes requests across healthy replicas",
      "Rolling updates enable zero-downtime deployments of new versions"
    ],
    stack: ["FastAPI", "Kubernetes", "Docker", "ReplicaSet"],
    insight: "Running 2 replicas of the API Gateway means if one pod crashes, users are instantly routed to the second one. No downtime. This is called High Availability."
  },
  "event-driven": {
    title: "Event-Driven Scalability",
    subtitle: "Decoupling heavy AI workloads via Apache Kafka.",
    image: "/images/event-driven.png",
    sections: [
      {
        heading: "The Problem",
        body: "A synchronous API that processes AI scans inline forces every user to wait 30+ seconds for a response. Under load, the server becomes a bottleneck — requests queue up, timeouts occur, and the entire system grinds to a halt. This architecture cannot scale."
      },
      {
        heading: "The Solution",
        body: "CodePulse uses Apache Kafka as a message broker between the API and Worker. When a user submits a repository, the API Gateway validates the request, persists the project to PostgreSQL, and publishes a scan task to a Kafka topic. The response is returned immediately. The Worker Service consumes the task asynchronously, clones the repo, and sends files to Gemini 2.0 Flash for analysis."
      },
      {
        heading: "How It Works Internally",
        body: "Kafka topics act as durable, ordered logs. Producers write messages; consumers read them at their own pace. If a worker crashes mid-scan, the message is not lost — Kafka retains it until the consumer acknowledges completion. Consumer Groups allow multiple workers to process tasks in parallel, each handling a different partition of the topic."
      }
    ],
    technical: [
      "AIOKafka provides async producer and consumer implementations",
      "Consumer Groups enable parallel processing across multiple workers",
      "Message persistence ensures no scan task is lost during failures",
      "Topic partitioning distributes load evenly across worker instances",
      "Decoupled architecture eliminates API-to-Worker response coupling"
    ],
    stack: ["Apache Kafka", "Zookeeper", "AIOKafka", "FastAPI"],
    insight: "The API Gateway does not perform the heavy AI analysis itself. It publishes a message to a Kafka topic, and the Worker Service picks it up asynchronously. This means thousands of users can submit requests without the API server becoming a bottleneck."
  },
  "orchestration": {
    title: "Containerized Orchestration",
    subtitle: "Managing a fleet of services with Kubernetes.",
    image: "/images/orchestration.png",
    sections: [
      {
        heading: "The Problem",
        body: "Running services directly on a host machine leads to environment-specific bugs, dependency conflicts, and manual process management. Scaling means SSH-ing into servers and starting processes by hand. There is no automatic recovery from crashes."
      },
      {
        heading: "The Solution",
        body: "Docker packages each service and its entire runtime environment into a portable container image. The same image runs identically on a developer laptop and in a cloud cluster. Kubernetes then manages the fleet of containers — restarting crashed ones, load-balancing traffic across replicas, and scaling based on demand."
      },
      {
        heading: "How It Works Internally",
        body: "Each service has a Dockerfile that defines its build steps. Kubernetes Deployment manifests declare the desired state — how many replicas, which image, what environment variables. The cluster continuously reconciles actual state with desired state. If a pod dies, the controller spins up a replacement. ClusterIP Services provide stable internal DNS names so services discover each other without hardcoded IPs."
      }
    ],
    technical: [
      "Multi-stage Dockerfiles for optimized production images",
      "Kubernetes Deployments for declarative state management",
      "ClusterIP Services for stable internal service discovery",
      "ConfigMaps and Secrets for environment configuration",
      "imagePullPolicy: Never for local development with Docker Desktop"
    ],
    stack: ["Docker", "Kubernetes", "kubectl", "Docker Desktop"],
    insight: "After rebuilding a Docker image, Kubernetes was still using the old cached version. Fix: tagged the new image as v2 and updated the deployment manifest to force a rollout."
  },
  "auto-scaling": {
    title: "Intelligent Auto-Scaling",
    subtitle: "Optimizing cloud resources with KEDA.",
    image: "/images/auto-scaling.png",
    sections: [
      {
        heading: "The Problem",
        body: "Running a fixed number of worker pods wastes resources. During low traffic, idle workers consume compute and cost money. During traffic spikes, a fixed pool cannot handle the backlog, leading to increased scan times and degraded user experience."
      },
      {
        heading: "The Solution",
        body: "KEDA (Kubernetes Event-driven Autoscaling) monitors the depth of our Kafka consumer queues in real-time. When consumer lag increases — meaning tasks are piling up faster than workers can process them — KEDA automatically scales up the Worker Deployment. When the queue drains, it scales back down to zero."
      },
      {
        heading: "How It Works Internally",
        body: "KEDA introduces a ScaledObject custom resource that defines which metric to watch and how to scale. For CodePulse, the trigger is Kafka consumer lag on the scan-tasks topic. KEDA periodically polls the lag metric and adjusts the replica count of the Worker Deployment accordingly. This integrates with the native Kubernetes Horizontal Pod Autoscaler under the hood."
      }
    ],
    technical: [
      "ScaledObject CRD defines scaling triggers and thresholds",
      "Kafka consumer lag metric drives scaling decisions",
      "Scale-to-zero eliminates cost during idle periods",
      "Horizontal Pod Autoscaler integration for smooth scaling",
      "Cooldown periods prevent rapid scale-up/scale-down oscillation"
    ],
    stack: ["KEDA", "Kubernetes", "Kafka", "HPA"],
    insight: "We don't want to pay for 10 workers when there are zero tasks. KEDA monitors queue depth and only spins up more Worker pods when there is a real backlog of repositories to scan."
  },
  "api-gateway": {
    title: "API Gateway",
    subtitle: "The entry point for all CodePulse traffic.",
    image: "/images/api-gateway.png",
    sections: [
      {
        heading: "Request Routing",
        body: "The API Gateway acts as the central traffic controller. Built with FastAPI and Traefik, it handles SSL termination, request validation, and intelligent routing to internal microservices."
      },
      {
        heading: "Security & Auth",
        body: "Every request is intercepted for GitHub OAuth validation. We use JWT tokens to maintain stateless session security across the cluster, ensuring that only authorized users can initiate repository scans."
      }
    ],
    technical: [
      "Traefik Ingress controller for dynamic routing",
      "GitHub OAuth 2.0 integration for secure access",
      "Pydantic models for strict request/response validation",
      "Stateless JWT authentication for scalable sessions",
      "Rate limiting to prevent API abuse and DoS attacks"
    ],
    stack: ["FastAPI", "Traefik", "OAuth 2.0", "JWT"],
    insight: "The Gateway is the first line of defense. By handling auth here, we ensure our internal workers never process unauthenticated requests."
  },
  "kafka-cluster": {
    title: "Kafka Cluster",
    subtitle: "High-performance distributed message broker.",
    image: "/images/kafka-cluster.png",
    sections: [
      {
        heading: "Decoupling Services",
        body: "Kafka is the backbone of CodePulse. It decouples the fast API Gateway from the slower AI analysis workers. This 'event-driven' approach allows the system to absorb massive traffic spikes without crashing."
      },
      {
        heading: "Data Persistence",
        body: "Unlike traditional queues, Kafka stores events on disk. If a worker fails, the scan task is never lost. Once a new worker comes online, it picks up exactly where the last one left off."
      }
    ],
    technical: [
      "Distributed partition management for high throughput",
      "Durable message persistence for fault tolerance",
      "Asynchronous producing/consuming with AIOKafka",
      "Zookeeper orchestration for cluster health",
      "Consumer Groups for parallel task distribution"
    ],
    stack: ["Apache Kafka", "Zookeeper", "AIOKafka", "Python"],
    insight: "Kafka allows us to 'buffer' thousands of repository scan requests, ensuring every single one is eventually processed even if our worker fleet is momentarily overloaded."
  },
  "worker-fleet": {
    title: "Worker Fleet",
    subtitle: "The engine room of repository analysis.",
    image: "/images/worker-fleet.png",
    sections: [
      {
        heading: "Parallel Processing",
        body: "Our worker fleet consists of containerized Python instances that listen for Kafka events. Each worker is isolated, cloning a repository into a temporary volume, analyzing the code, and streaming results back."
      },
      {
        heading: "Dynamic Scaling",
        body: "Using KEDA, the fleet size adjusts in real-time based on the length of the Kafka queue. If 100 repos are submitted, the fleet grows to 50 workers; if zero, it scales down to save costs."
      }
    ],
    technical: [
      "Dockerized analysis environments for isolation",
      "KEDA-driven horizontal pod autoscaling (HPA)",
      "Temporary volume management for git cloning",
      "Asynchronous file I/O for performance",
      "Prometheus metrics for worker health monitoring"
    ],
    stack: ["Python", "Docker", "Kubernetes", "KEDA"],
    insight: "Workers are ephemeral. They spin up, do the heavy lifting of code analysis, and shut down once the work is done. This is the peak of cloud-native efficiency."
  },
  "gemini-ai": {
    title: "Gemini AI Core",
    subtitle: "The intelligence behind the code analysis.",
    image: "/images/gemini-ai.png",
    sections: [
      {
        heading: "Deep Context Analysis",
        body: "We leverage Gemini 2.0 Flash to perform deep-dive analysis of entire codebases. Unlike simple regex scanners, Gemini understands the context, logic flow, and potential architectural flaws."
      },
      {
        heading: "Systematic Reporting",
        body: "The AI core doesn't just find bugs; it generates structured architectural reports, suggests refactoring paths, and identifies security vulnerabilities in real-time."
      }
    ],
    technical: [
      "Gemini 2.0 Flash for high-speed, long-context reasoning",
      "System prompting for consistent architectural auditing",
      "JSON-mode output for structured data integration",
      "Prompt caching to reduce latency and API costs",
      "Multi-file context injection for deep dependency tracking"
    ],
    stack: ["Gemini 2.0", "Google AI SDK", "Prompt Engineering"],
    insight: "By using Gemini 2.0 Flash, we can analyze 100k+ lines of code in seconds, providing a level of architectural insight that was previously only possible via human manual review."
  }
};

// Stagger animation for children
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const DocsDetail = () => {
  const { slug } = useParams();
  const data = DOCS_DATA[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!data) return <div className="text-white p-20 text-center">Documentation not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-hidden relative">
      <Navbar />

      {/* Subtle Ghost Visual from Bento Grid */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="fixed top-[-10%] right-[-10%] w-[100%] h-auto pointer-events-none z-0"
      >
        <img 
          src={data.image} 
          alt="" 
          className="w-full h-full object-contain brightness-75"
          style={{ maskImage: 'radial-gradient(circle at center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)' }}
        />
      </motion.div>

      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/[0.03] blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/[0.02] blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="relative max-w-5xl mx-auto pt-40 pb-32 px-6 md:px-12 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title Block */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-indigo-500 to-transparent" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-indigo-400 font-medium">Deep Dive</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-[-0.04em] leading-[0.9] mb-6 text-white">
              {data.title}
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-20">
            {data.sections.map((section, i) => (
              <motion.section key={i} variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12">
                  <div className="md:pt-1">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-zinc-600 font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-6">
                      {section.heading}
                    </h2>
                    <p className="text-zinc-400 text-base md:text-lg leading-[1.8]">
                      {section.body}
                    </p>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="my-24">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>

          {/* Technical Details + Sidebar */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12 md:gap-16">
            {/* Technical Points */}
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-indigo-500 to-transparent" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-indigo-400 font-medium">Technical Detail</span>
              </div>
              
              <div className="space-y-0">
                {data.technical.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="group flex items-start gap-5 py-5 border-b border-white/[0.04] hover:border-indigo-500/20 transition-colors duration-500"
                  >
                    <span className="text-[11px] text-zinc-700 font-mono mt-1 select-none group-hover:text-indigo-500 transition-colors duration-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-zinc-400 text-[15px] leading-relaxed group-hover:text-zinc-300 transition-colors duration-500">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Stack Tags */}
              <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/[0.04]">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold mb-5">Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {data.stack.map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-zinc-500 font-mono hover:border-indigo-500/30 hover:text-indigo-400 transition-all duration-300 cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Insight Card */}
              <div className="relative p-6 rounded-2xl border border-indigo-500/[0.08] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] to-transparent pointer-events-none" />
                <h4 className="relative text-[10px] uppercase tracking-[0.2em] text-indigo-500/80 font-bold mb-4">From the README</h4>
                <p className="relative text-[13px] text-zinc-500 leading-[1.7]">
                  {data.insight}
                </p>
              </div>
            </aside>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
};

export default DocsDetail;
