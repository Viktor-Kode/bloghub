"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
    toDate: () => Date;
  };
  updatedAt?: {
    seconds: number;
    nanoseconds: number;
    toDate: () => Date;
  };
}

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Edit state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingContent, setEditingContent] = useState<string>("");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch user's posts
  useEffect(() => {
    if (!user?.email) return;

    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const posts = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Post))
        .filter((post) => post.author === user.email)
        .sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.seconds - a.createdAt.seconds;
        });

      setUserPosts(posts);
    });

    return () => unsubscribe();
  }, [user?.email]);

  // Publish a new post
  const handlePublish = async (): Promise<void> => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    setIsPublishing(true);
    try {
      await addDoc(collection(db, "posts"), {
        title: title.trim(),
        content: content.trim(),
        author: user?.email,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Delete a post
  const handleDel = async (id: string): Promise<void> => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Could not delete post. Try again.");
    }
  };

  // Start editing a post
  const startEdit = (post: Post): void => {
    setEditingPostId(post.id);
    setEditingTitle(post.title);
    setEditingContent(post.content);
  };

  // Cancel editing
  const cancelEdit = (): void => {
    setEditingPostId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  // Save edited post
  const handleUpdate = async (): Promise<void> => {
    if (!editingTitle.trim() || !editingContent.trim()) {
      alert("Both fields are required");
      return;
    }

    try {
      await updateDoc(doc(db, "posts", editingPostId!), {
        title: editingTitle.trim(),
        content: editingContent.trim(),
        updatedAt: serverTimestamp(),
      });

      cancelEdit();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Could not update post. Try again.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading your dashboard...</p>
      </div>
    </div>
  );
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {user?.photoURL && (
                <div className="relative">
                  <Image
                    src={user.photoURL}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={() => auth.signOut()}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Your Posts</p>
                <p className="text-3xl font-bold mt-2">{userPosts.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <Link href={"/posts"}>    <div className="flex items-center justify-between">
              
              <div>
                <p className="text-purple-100 text-sm font-medium">check out other posts </p>
                <p className="text-3xl font-bold mt-2">Public Feed</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
           
            </div>
        </Link>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Status</p>
                <p className="text-xl font-bold mt-2">Active</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🟢</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Create Post Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-lg">✏️</span>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  placeholder="What's your post about?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>

              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPublishing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </div>
                ) : (
                  "Publish Post 🚀"
                )}
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-lg">📚</span>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📝</span>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No posts yet</p>
                  <p className="text-gray-400 mt-1">Create your first post to get started</p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 group"
                  >
                    {editingPostId === post.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="Post title"
                        />
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                          placeholder="Post content"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {post.createdAt?.toDate ? (
                              post.createdAt.toDate().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            ) : (
                              'No date'
                            )}
                          </span>
                          <div className="flex space-x-2 ">
                            <button
                              onClick={() => startEdit(post)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDel(post.id)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}