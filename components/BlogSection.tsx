import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Translation } from '../types';
import { Newspaper, Calendar, Clock, ArrowRight, X, Share2, Check, Tag, BookOpen } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: 'AI & Architecture' | 'Engineering & 3D' | 'Education' | 'Roadmap 2026';
  date: string;
  readTime: string;
  summary: string;
  image: string;
  content: string[];
}

const ARTICLES: Article[] = [
  {
    id: 'architecture-2026',
    title: 'The Architecture of Noam Gold AI: Building High-Speed WebGL Portals',
    category: 'AI & Architecture',
    date: 'November 2026',
    readTime: '5 min read',
    summary: 'How we unified high-performance browser games, gamified education, and tech hubs into an ultra-responsive, WebGL-accelerated digital ecosystem.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    content: [
      'In 2026, web applications are no longer static collections of DOM elements. Modern users demand instantaneous responsiveness, fluid 60fps micro-interactions, and immersive visual storytelling. The Noam Gold AI ecosystem was engineered specifically to solve this convergence.',
      'Our architectural stack unifies three distinct platforms—Noam Gold Games, Learn and Fun, and the Tech Hub—under an intelligent single-pane experience. By leveraging hardware-accelerated WebGL pipelines, custom canvas texture generators, and responsive spring kinematics, we maintain sub-50ms interaction latency across both desktop and mobile devices.',
      'Furthermore, the multi-language engine provides complete RTL and LTR localization spanning Hebrew, English, Mandarin, Hindi, Russian, German, Spanish, and French with zero layout shifts or font flicker. Every component is designed to feel native, accessible, and tactile.',
      'As we continue to iterate, our core guiding principle remains unchanged: technology should feel playful, seamless, and visually exhilarating.'
    ]
  },
  {
    id: 'webgl-shader-physics',
    title: 'Deep Dive into WebGL Shaders & Real-Time Cloth Dynamics',
    category: 'Engineering & 3D',
    date: 'October 2026',
    readTime: '7 min read',
    summary: 'Exploring GPU-accelerated mass-spring systems, tearable mesh physics, and procedural lighting in pure browser JavaScript.',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    content: [
      'Interactive cloth physics have historically been considered too computationally expensive for casual web visits. However, with modern WebGL pipelines and Verlet integration algorithms, we can achieve astonishingly realistic tearable fabrics in real time.',
      'In our Cloth Lab simulation, thousands of interconnected particles are evaluated each frame. We enforce distance constraints through iterative relaxation passes. When shear force exceeds the material threshold, specific constraint links break, resulting in dynamic organic tears.',
      'To pair with the physics, our custom Three.js Phong & Physical shader rigs simulate micro-roughness, ambient occlusion, and sun/moon terminator lines. No external 3D files are downloaded; all textures, crater maps, and starfield geometries are procedurally computed in memory.',
      'The result is zero load times, zero broken 404 asset links, and a silky smooth experience that runs on everything from high-end GPUs to low-power mobile browsers.'
    ]
  },
  {
    id: 'gamified-edtech',
    title: 'Learn & Fun: Reimagining Digital Literacy through Tactical Play',
    category: 'Education',
    date: 'September 2026',
    readTime: '4 min read',
    summary: 'Why passive video tutorials fail modern engineering students, and how interactive feedback loops build intuitive mental models.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
    content: [
      'Traditional online education often suffers from high abandonment rates. Reading documentation or watching a 40-minute video can quickly induce cognitive fatigue without active reinforcement.',
      'The "Learn and Fun" platform reimagines the educational loop by transforming abstract software concepts into tactile puzzles. When a student learns about algorithmic time complexity, memory allocation, or UI responsiveness, they do not just read formulas—they adjust interactive parameters, observe real-time graphs, and compete in micro-challenges.',
      'By pairing game mechanics with rigorous engineering curriculum, retention rates increase by over 60%. We believe the future of technical education lies at the intersection of serious play and instant empirical verification.'
    ]
  },
  {
    id: 'roadmap-2026',
    title: 'Noam Gold AI Roadmap 2026: Spatial Computing & Next-Gen Gaming',
    category: 'Roadmap 2026',
    date: 'August 2026',
    readTime: '6 min read',
    summary: 'A look ahead at upcoming releases: WebGPU compute shaders, neural voice companions, and an expanded retro-arcade games lineup.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    content: [
      'The year 2026 represents a massive leap forward for the Noam Gold AI platform. Over the coming quarters, we are rolling out three major updates across the ecosystem.',
      'First, our Games Hub is expanding with new retro-arcade strategy games featuring physics-driven destruction, competitive leaderboards, and instant zero-install browser play.',
      'Second, we are experimenting with WebGPU compute shaders for browser-native machine learning models and fluid particle simulations, bypassing CPU bottlenecks entirely.',
      'Finally, our Tech Hub will introduce live interactive architecture playgrounds where engineers can benchmark algorithms, test API schemas, and collaborate in real-time.',
      'Thank you to our global community for joining us on this voyage. The digital universe is just getting started.'
    ]
  }
];

interface BlogSectionProps {
  t: Translation;
}

const BlogSection: React.FC<BlogSectionProps> = ({ t }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'AI & Architecture', 'Engineering & 3D', 'Education', 'Roadmap 2026'];

  const filteredArticles = selectedCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === selectedCategory);

  const handleShare = (article: Article) => {
    const url = `${window.location.origin}/#blog-${article.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section id="blog" className="w-full py-16 md:py-24 relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-primary/30 text-xs font-bold tracking-widest uppercase text-primary">
              <Newspaper size={14} className="text-primary" />
              <span>{t.blog} &bull; {t.articlesAndUpdates}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              {t.articlesAndUpdates}
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              {t.articlesSubtitle}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                    : 'glass text-muted-foreground hover:text-foreground hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => setActiveArticle(article)}
              className="group glass rounded-3xl overflow-hidden border border-white/10 hover:border-primary/40 transition-all duration-300 flex flex-col cursor-pointer shadow-lg hover:shadow-2xl"
            >
              {/* Image banner */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-dark text-[11px] font-bold tracking-wider uppercase text-primary border border-white/10">
                    <Tag size={12} />
                    {article.category}
                  </span>
                </div>

                {/* Date & read time */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {article.readTime}
                  </span>
                </div>
              </div>

              {/* Content preview */}
              <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                    {t.readArticles}
                    <ArrowRight size={16} />
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    By Noam Gold
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl max-h-[90vh] glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col bg-background/95"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-20">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    {activeArticle.readTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeArticle)}
                    className="p-2 rounded-full glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    title="Share Article"
                  >
                    {copiedId === activeArticle.id ? <Check size={18} className="text-green-400" /> : <Share2 size={18} />}
                  </button>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="p-2 rounded-full glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close reader"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
                <h1 id="article-modal-title" className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
                  {activeArticle.title}
                </h1>

                <div className="flex items-center gap-4 py-3 border-y border-white/10 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary">
                      NG
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Noam Gold</p>
                      <p className="text-[10px] uppercase tracking-wider">AI Specialist & Founder</p>
                    </div>
                  </div>
                  <span className="mx-auto" />
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {activeArticle.date}
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden h-64 w-full">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 text-base sm:text-lg leading-relaxed text-foreground/90 font-normal">
                  {activeArticle.content.map((paragraph, i) => (
                    <p key={i} className="text-justify sm:text-start">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <BookOpen size={14} className="text-primary" />
                    <span>Published on Noam Gold AI Portal</span>
                  </div>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Done Reading
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogSection;
