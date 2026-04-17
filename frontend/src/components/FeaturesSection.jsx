import React from 'react';
import { BentoGrid, BentoCard } from './ui/BentoGrid';
import { motion } from 'framer-motion';

const features = [
  {
    name: "High-Availability Architecture",
    description: "Moving away from simple monoliths to an independent API and Worker eco-system. Multiple replicas ensure the platform stays online even if individual pods fail.",
    href: "/docs/high-availability",
    cta: "Architecture Docs",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/images/high-availability.png" 
          alt="High Availability" 
          className="absolute right-[-10%] top-[-10%] w-[70%] h-auto opacity-70 object-cover grayscale-[0.2] brightness-90 group-hover:scale-110 transition-transform duration-700 ease-out"
          style={{ maskImage: 'linear-gradient(to left, black 20%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to left, black 20%, transparent 80%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent" />
      </div>
    ),
  },
  {
    name: "Event-Driven Scalability",
    description: "Apache Kafka integration decouples API logic from heavy AI processing, allowing for high-concurrency request handling.",
    href: "/docs/event-driven",
    cta: "Kafka Service",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent" />
    ),
  },
  {
    name: "Containerized Orchestration",
    description: "Portable Docker images managed by Kubernetes. Automating the lifecycle of your application fleet with zero-downtime rolling updates.",
    href: "/docs/orchestration",
    cta: "K8s Manifests",
    className: "col-span-3 lg:col-span-1",
    background: (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-500/5 to-transparent" />
    ),
  },
  {
    name: "Intelligent Auto-Scaling",
    description: "Leveraging KEDA to dynamically scale scanning workers based on real-time Kafka consumer lag, optimizing cloud resource usage.",
    href: "/docs/auto-scaling",
    cta: "Scaling Logic",
    className: "col-span-3 lg:col-span-2",
    background: (
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/5 to-transparent" />
    ),
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 px-6 max-w-7xl mx-auto z-10">
      <div className="text-center mb-16 px-4">
        <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-white"
        >
          Production-Grade <span className="text-indigo-500">Infrastructure</span>.
        </motion.h2>
        <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           viewport={{ once: true }}
           className="text-zinc-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
        >
          Transitioning from single-file FastAPI apps to a containerized, 
          event-driven microservices architecture managed by Kubernetes.
        </motion.p>
      </div>

      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard 
            key={idx} 
            {...feature} 
            // Passing a dummy component since we removed the icon logic for a cleaner look
            Icon={() => null} 
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default FeaturesSection;
