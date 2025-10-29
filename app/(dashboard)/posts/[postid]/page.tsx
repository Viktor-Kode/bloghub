"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/firebase/config";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

interface Params {
  postid: string;
}

export default function PostPage() {
  const params = useParams() as Params;
  const router = useRouter();
  const postId = params.postid;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!postId) {
      setError("No post ID found in URL");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError("");

      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<Post, "id">;
          setPost({ id: docSnap.id, ...data });
        } else {
          setError(`Post with ID "${postId}" not found.`);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Database connection failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleBack = () => {
    setIsNavigating(true);
    router.push("/posts");
  };

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return "Unknown date";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp.toDate());
  };

  const readingTime = post ? Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200)) : 0;

  const getAuthorInitials = (author: string) =>
    author
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading post...</p>
          <p className="text-gray-400 text-sm mt-2">ID: {postId}</p>
        </motion.div>
      </div>
    );

  if (error && !post)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-gray-500 text-sm mb-4">
            Post ID: <code className="bg-gray-100 px-2 py-1 rounded">{postId}</code>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push("/posts")} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Browse All Posts
            </button>
            <button onClick={() => window.location.reload()} className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">BlogHub</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/posts" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                All Posts
              </Link>
              <button onClick={handleBack} disabled={isNavigating} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isNavigating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>←</span>}
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Article Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8 sm:p-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-sm">👤</span>
                  <span className="font-medium text-sm">{post?.author}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-sm">📅</span>
                  <span className="text-sm">{formatDate(post?.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-sm">⏱️</span>
                  <span className="text-sm">{readingTime} min read</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">{post?.title}</h1>
              {post?.updatedAt && (
                <div className="text-blue-200 text-sm border-t border-white/20 pt-4 mt-6">📝 Updated {formatDate(post.updatedAt)}</div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8 sm:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed text-lg">
                {post?.content.split("\n").map((paragraph, index) => (
                  <motion.p key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="mb-6 text-gray-800 leading-8">
                    {paragraph || <br />}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Navigation Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer group" onClick={handleBack}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <span className="text-blue-600 group-hover:text-white text-xl transition-colors">←</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Previous</p>
                <p className="font-semibold text-gray-900">Back to all posts</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
