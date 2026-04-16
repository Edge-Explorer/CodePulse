import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiTerminal, FiCpu, FiServer, FiActivity } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const DOCS_DATA = {
  "high-availability": {
    title: "High-Availability Architecture",
    description: "Building resilient systems that never go offline.",
    content: "In production, downtime is the enemy. By moving away from a monolith to independent microservices, we ensured that if the Worker Service crashes during an AI scan, the API Gateway continues to serve users. We run 2 replicas of the API Gateway, meaning traffic is instantly rerouted to a healthy pod if one fails.",
    technical: [
      "ReplicaSet configuration for redundancy",
      "Liveness and Readiness probes for health checks",
      "Service-level load balancing inside the cluster"
    ]
  },
  "event-driven": {
    title: "Event-Driven Scalability",
    description: "Decoupling heavy AI workloads via Apache Kafka.",
    content: "The API Gateway shouldn't wait for a 30-second AI scan to finish before responding to a user. By publishing tasks to a Kafka cluster, we achieve high-concurrency. Thousands of users can submit repos simultaneously—the workers will simply pick them up from the queue as capacity allows.",
    technical: [
      "AIOKafka for asynchronous producing/consuming",
      "Kafka Consumer Groups for parallel task processing",
      "Message persistence for fault-tolerant scanning"
    ]
  },
  "orchestration": {
    title: "Containerized Orchestration",
    description: "Managing a fleet of services with Kubernetes.",
    content: "Docker ensures our environment is identical in local dev and production. Kubernetes takes those containers and manages their entire lifecycle—handling networking, secret management, and automatic restarts without manual intervention.",
    technical: [
      "K8s Deployment manifests for state management",
      "ClusterIP services for internal communication",
      "PVCs (Persistent Volume Claims) for data safety"
    ]
  },
  "auto-scaling": {
    title: "Intelligent Auto-Scaling",
    description: "Optimizing cloud resources with KEDA.",
    content: "We don't want to pay for 10 workers when there are zero tasks. KEDA (Kubernetes Event-driven Autoscaling) monitors the depth of our Kafka queues and only spins up more Worker pods when there is a backlog of repos to scan.",
    technical: [
      "ScaledObject configurations for Kafka lag metrics",
      "Scale-to-zero capability for cost efficiency",
      "Horizontal Pod Autoscaling (HPA) integration"
    ]
  }
};

const DocsDetail = () => {
  const { slug } = useParams();
  const data = DOCS_DATA[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return <div className="text-white p-20 text-center">Documentation not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar onConnect={() => window.location.href = '/'} />

      <main className="max-w-4xl mx-auto pt-40 pb-20 px-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group w-fit"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </Link>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-white">
            {data.title}
          </h1>
          <p className="text-xl text-indigo-400 font-medium mb-12 italic opacity-80">
            {data.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FiTerminal className="text-indigo-500" />
                  Implementation Logic
                </h2>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  {data.content}
                </p>
              </section>

              <section className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group">
                 {/* Subtle glowing background */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
                
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                    <FiActivity className="text-indigo-500" />
                    Technical Constraints Handles
                </h3>
                <ul className="space-y-4">
                  {data.technical.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-500 hover:text-zinc-300 transition-colors">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="space-y-8">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-4">
                 <h4 className="text-xs uppercase tracking-widest text-zinc-600 font-bold">Stack Context</h4>
                 <div className="flex flex-wrap gap-2">
                    {['FastAPI', 'Kafka', 'K8s', 'Gemini AI'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-zinc-400">
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                 <h4 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4 italic">Deployment Insight</h4>
                 <p className="text-xs text-zinc-500 leading-relaxed italic">
                    Successfully deployed in a local cluster using Docker Desktop, proving the transition from single-folder apps to orchestrated services.
                 </p>
              </div>
            </aside>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DocsDetail;
