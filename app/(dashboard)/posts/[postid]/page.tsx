"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: any; // Firestore timestamp
};

export default function PostPage() {
  const { id: postId } = useParams(); // Get dynamic ID
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    
    if (!postId) return;

    const fetchPost = async () => {
      setLoading(true);
      setError("");

      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Loading post...
      </p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-500 text-lg">{error}</p>
    );

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 sm:px-6 py-10">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          By {post.author} •{" "}
          {post.createdAt?.toDate
            ? post.createdAt.toDate().toLocaleDateString()
            : "—"}
        </p>
        <div className="text-gray-700 whitespace-pre-wrap">{post.content}</div>
        <button
          onClick={() => router.back()}
          className="mt-8 bg-blue-600 text-white px-5 py-2 rounded-xl shadow-md hover:opacity-90 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
