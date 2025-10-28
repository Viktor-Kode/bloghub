"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import { Globe, Notebook, Rocket,  } from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [topUser, setTopUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  // Close menu on link click
  const handleLinkClick = () => setMenuOpen(false);

  // Popular categories with better images
  const Categories = [
    { id: 1, name: "Technology"  , color: "from-blue-500 to-cyan-500", posts: "1.2K" },
    { id: 2, name: "Lifestyle",  color: "from-purple-500 to-pink-500", posts: "856" },
    { id: 3, name: "Business", color: "from-green-500 to-emerald-500", posts: "723" },
    { id: 4, name: "Health", color: "from-red-500 to-orange-500", posts: "642" },
    { id: 5, name: "Travel", color: "from-indigo-500 to-blue-500", posts: "534" },
    { id: 6, name: "Food",  color: "from-yellow-500 to-orange-500", posts: "489" },
  ];

  // Features section
  const Features = [
    { id: 1, title: "Write with Ease", description: "Beautiful editor with markdown support", icon: <Notebook/> },
    { id: 2, title: "Reach Audience", description: "Share your thoughts with thousands of readers", icon: <Globe/>},
    { id: 3, title: "Engage & Grow", description: "Build your community and get feedback", icon: <Rocket/> },
  ];

  // Stats data
  const Stats = [
    { number: "10K+", label: "Active Writers" },
    { number: "50K+", label: "Published Posts" },
    { number: "1M+", label: "Monthly Readers" },
    { number: "95%", label: "Satisfaction Rate" },
  ];

  // Fetch top users
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setTopUser(res.data.slice(0, 6));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
  
<nav className="relative z-50 flex justify-between items-center px-6 py-6 md:px-16">
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center space-x-3"
  >
    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
      <span className="text-white font-bold text-lg">B</span>
    </div>
    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
      BlogHub
    </span>
  </motion.div>

  {/* Desktop Nav */}
  <ul className="hidden md:flex items-center space-x-8 text-lg font-medium">
    <motion.li whileHover={{ y: -2 }} className="relative cursor-pointer hover:text-cyan-300 transition-colors">
      <Link href="/">Home</Link>
    </motion.li>
    <motion.li whileHover={{ y: -2 }} className="relative cursor-pointer hover:text-cyan-300 transition-colors">
      <Link href="/posts">Blog</Link>
    </motion.li>
    <motion.li whileHover={{ y: -2 }} className="relative cursor-pointer hover:text-cyan-300 transition-colors">
      <Link href="/about">About</Link>
    </motion.li>
    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href="/signUp"
        className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        Get Started
      </Link>
    </motion.li>
  </ul>

  {/* Mobile Toggle */}
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={() => setMenuOpen(!menuOpen)}
    className="md:hidden text-2xl z-50 p-2 rounded-lg bg-white/10 backdrop-blur-sm"
  >
    {menuOpen ? "✕" : "☰"}
  </motion.button>
</nav>

{/* Mobile Menu */}
<AnimatePresence>
  {menuOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-md flex items-center justify-center"
    >
      <div className="text-center space-y-8">
        <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-semibold">
          <Link href="/" onClick={handleLinkClick} className="hover:text-cyan-300 transition-colors">Home</Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-semibold">
          <Link href="/posts" onClick={handleLinkClick} className="hover:text-cyan-300 transition-colors">Blog</Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-semibold">
          <Link href="/about" onClick={handleLinkClick} className="hover:text-cyan-300 transition-colors">About</Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-semibold">
          <Link href="/login" onClick={handleLinkClick} className="hover:text-cyan-300 transition-colors">Login</Link>
        </motion.div>
      </div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 pt-10 md:pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm">Join 10,000+ writers already blogging</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent"
          >
            Where Great
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Stories Begin
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Share your voice, build your audience, and join a community of passionate writers and readers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signUp"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>Start Writing Free</span>
                <span>🚀</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/posts"
                className="border border-cyan-400/50 text-cyan-300 font-semibold px-8 py-4 rounded-xl text-lg hover:bg-cyan-400/10 transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>Explore Blogs</span>
                
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-2xl mx-auto"
          >
            {Stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose BlogHub?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to start, grow, and monetize your blog
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-400">Discover content across various topics</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-center cursor-pointer group hover:shadow-2xl transition-all duration-300`}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{category.name}</h3>
                <p className="text-white/70 text-sm">{category.posts} posts</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Writers Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured Writers
            </h2>
            <p className="text-xl text-gray-400">Meet our most prolific contributors</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topUser.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{user.name}</h3>
                      <p className="text-cyan-400 text-sm">@{user.username}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    Writing about technology, design, and user experience. Passionate about creating meaningful content.
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{user.email}</span>
                    <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">
                      Top Writer
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-3xl p-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Ready to Start Your Blogging Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who are already sharing their stories and building their audience.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>Create Your Free Account</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-xl font-bold text-white">BlogHub</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              {["Privacy", "Terms", "Support", "Contact"].map((item) => (
                <a key={item} href="#" className="hover:text-cyan-300 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2025 BlogHub. All rights reserved. Built with Love for writers by viktor. </p>
          </div>
        </div>
      </footer>
    </div>
  );
}