import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Rocket, Terminal, Code2, Layers } from 'lucide-react';

const DocCard = ({ title, description, slug, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative"
  >
    <Link to={`/docs/${slug}`} className="block">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
      <div className="relative p-8 rounded-2xl bg-zinc-900/40 border border-white/[0.05] hover:border-indigo-500/30 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold mb-2 group-hover:text-indigo-400 transition-colors">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{description}</p>
            <div className="mt-4 flex items-center text-xs font-bold text-indigo-500/70 uppercase tracking-widest gap-2">
              Read Technical Guide
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </div>
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
      icon: Layers,
      delay: 0.1
    },
    {
      title: "Security & Authentication",
      description: "How we secure the platform with GitHub OAuth 2.0 and stateless JWT sessions.",
      slug: "github-oauth",
      icon: ShieldCheck,
      delay: 0.2
    },
    {
      title: "Deployment Journey",
      description: "Lessons learned while deploying a multi-service K8s cluster on Docker Desktop.",
      slug: "deployment-journey",
      icon: Rocket,
      delay: 0.3
    },
    {
      title: "AI Analysis Core",
      description: "Leveraging Gemini 2.0 Flash for structured code auditing and report generation.",
      slug: "gemini-ai",
      icon: Code2,
      delay: 0.4
    },
    {
      title: "Event-Driven Logic",
      description: "Scaling heavy workloads asynchronously using Apache Kafka topics and consumer groups.",
      slug: "event-driven",
      icon: Terminal,
      delay: 0.5
    },
    {
      title: "Orchestration & Scaling",
      description: "Managing pod lifecycles and KEDA-driven autoscaling in a production environment.",
      slug: "auto-scaling",
      icon: BookOpen,
      delay: 0.6
    }
  ];

  return (
    <section id="docs" className="relative py-32 px-6 bg-black z-10 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-6"
            >
              Technical <span className="text-indigo-500">Guides</span>.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-zinc-500 text-lg leading-relaxed"
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
              className="px-6 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
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
