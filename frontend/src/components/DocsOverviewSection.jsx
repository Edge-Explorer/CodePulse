import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ShinyText from './ui/ShinyText';

const DocCard = ({ title, description, slug, image, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative pointer-events-auto"
  >
    <Link to={`/docs/${slug}`} className="block">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
      <div className="relative p-8 rounded-3xl bg-zinc-900/30 border border-white/[0.05] hover:border-indigo-500/30 transition-all duration-300 overflow-hidden min-h-[180px] flex flex-col justify-center">
        
        {/* 3D Visual Background - No Icons */}
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700 ease-out brightness-50"
            style={{ maskImage: 'radial-gradient(circle at center, black 10%, transparent 90%)', WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 90%)' }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <h3 className="text-white font-bold tracking-tight group-hover:text-indigo-400 transition-colors">{title}</h3>
          </div>
          <p className="text-zinc-500 text-[13px] leading-relaxed line-clamp-2 max-w-[280px]">{description}</p>
          <div className="mt-6 flex items-center text-[10px] font-bold text-indigo-500/70 uppercase tracking-[0.2em] gap-2 group-hover:text-indigo-400 transition-colors">
            Technical Guide
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const DocsOverviewSection = () => {
  const categories = [
    {
      title: "System Architecture",
      description: "Deep dive into our microservices topology, Kafka decoupling, and state management.",
      slug: "high-availability",
      image: "/images/high-availability.png",
      delay: 0.1
    },
    {
      title: "Security & Authentication",
      description: "How we secure the platform with GitHub OAuth 2.0 and stateless JWT sessions.",
      slug: "github-oauth",
      image: "/images/github-auth.png",
      delay: 0.2
    },
    {
      title: "Deployment Journey",
      description: "Lessons learned while deploying a multi-service K8s cluster on Docker Desktop.",
      slug: "deployment-journey",
      image: "/images/deployment.png",
      delay: 0.3
    },
    {
      title: "AI Analysis Core",
      description: "Leveraging Gemini 2.0 Flash for structured code auditing and report generation.",
      slug: "gemini-ai",
      image: "/images/gemini-ai.png",
      delay: 0.4
    },
    {
      title: "Event-Driven Logic",
      description: "Scaling heavy workloads asynchronously using Apache Kafka topics and consumer groups.",
      slug: "event-driven",
      image: "/images/event-driven.png",
      delay: 0.5
    },
    {
      title: "Orchestration & Scaling",
      description: "Managing pod lifecycles and KEDA-driven autoscaling in a production environment.",
      slug: "auto-scaling",
      image: "/images/auto-scaling.png",
      delay: 0.6
    }
  ];

  return (
    <section id="docs" className="relative py-32 px-6 overflow-hidden z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6"
            >
              <ShinyText text="Technical" speed={3} color="#ffffff" shineColor="#818cf8" /> <span className="text-indigo-500">Guides.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-zinc-500 text-lg md:text-xl leading-relaxed"
            >
              Explore the engineering principles, architectural decisions, and 
              deployment strategies behind the CodePulse platform.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block pointer-events-auto"
          >
            <Link 
              to="/docs/high-availability"
              className="px-8 py-4 rounded-full bg-white text-black text-[13px] font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
            >
              Start Reading
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pointer-events-auto">
          {categories.map((cat, i) => (
            <DocCard key={cat.slug} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DocsOverviewSection;
