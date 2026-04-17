import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Node = ({ title, description, delay = 0, image, href }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative group pointer-events-auto"
  >
    <Link to={href} className="block cursor-pointer">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
      <div className="relative p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.05] backdrop-blur-sm flex flex-col items-center text-center w-full md:w-52 h-40 overflow-hidden justify-center group">
        
        {/* Subtle 3D Visual Background */}
        <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700 ease-out brightness-75"
            style={{ maskImage: 'radial-gradient(circle at center, black 10%, transparent 90%)', WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 90%)' }}
          />
        </div>

        <div className="relative z-10">
          <div className="w-1 h-1 bg-indigo-500 rounded-full mx-auto mb-4 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <h3 className="text-white text-[13px] font-bold mb-1 tracking-tight group-hover:text-indigo-400 transition-colors duration-300">{title}</h3>
          <p className="text-zinc-500 text-[9px] leading-relaxed uppercase tracking-wider">{description}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

const ConnectionLine = ({ className, delay = 0 }) => (
  <div className={`relative ${className}`}>
    <svg className="w-full h-full overflow-visible">
      <motion.path
        d="M 0 0 L 100 0"
        stroke="url(#line-gradient)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="8 8"
        initial={{ strokeDashoffset: 100 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay }}
      />
      <defs>
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="relative py-32 px-6 overflow-hidden z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-white"
          >
            System <span className="text-indigo-500">Topology</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            A decoupled, asynchronous architecture designed for massive scale 
            and real-time analysis of enterprise repositories.
          </motion.p>
        </div>

        {/* The Pipeline Visualization */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 lg:px-12">
          
          <Node 
            title="API Gateway" 
            description="Entry Point"
            delay={0.1}
            image="/images/api-gateway.png"
            href="/docs/api-gateway"
          />

          <div className="hidden md:block flex-1 h-px max-w-[150px] mx-4">
             <ConnectionLine className="w-full h-px" delay={0} />
          </div>

          <Node 
            title="Kafka Cluster" 
            description="Message Bus"
            delay={0.2}
            image="/images/kafka-cluster.png"
            href="/docs/kafka-cluster"
          />

          <div className="hidden md:block flex-1 h-px max-w-[150px] mx-4">
             <ConnectionLine className="w-full h-px" delay={0.5} />
          </div>

          <Node 
            title="Worker Fleet" 
            description="Scaling Engine"
            delay={0.3}
            image="/images/worker-fleet.png"
            href="/docs/worker-fleet"
          />

          <div className="hidden md:block flex-1 h-px max-w-[150px] mx-4">
             <ConnectionLine className="w-full h-px" delay={1} />
          </div>

          <Node 
            title="Gemini AI" 
            description="Analysis Core"
            delay={0.4}
            image="/images/gemini-ai.png"
            href="/docs/gemini-ai"
          />

        </div>

        {/* Bottom Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {[
            {
              label: "Event-Driven",
              desc: "Utilizing Apache Kafka to decouple ingestion from analysis. This ensures your API remains responsive even during heavy traffic spikes."
            },
            {
              label: "State Management",
              desc: "PostgreSQL stores repository metadata while Redis caches scan results to provide near-instant feedback for recurring requests."
            },
            {
              label: "K8s Native",
              desc: "Designed to run in any cloud environment. Kubernetes handles self-healing, rollouts, and horizontal scaling of the analysis engine."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-zinc-900/30 border border-white/[0.03] hover:border-indigo-500/20 transition-all duration-500 pointer-events-auto"
            >
              <h4 className="text-white text-xs font-bold mb-4 uppercase tracking-[0.2em] text-indigo-400">
                {item.label}
              </h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
