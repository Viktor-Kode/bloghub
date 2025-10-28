"use client"
import { div } from "framer-motion/client";
import { blogs } from "./data";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
export default function BlogPage() {
    const [userSearch, setUserSearch] = useState("")
    const [categorie, setCategorie ] = useState('')
  return (
    <>
      <section className="w-full dark:bg-gray-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 text-white text-center py-12 px-4 md:px-20 rounded-b-3xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Latest Blog</h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            Get the latest blog posts uploaded every week about your favourite topics and stay up to date.
          </p>
        </div>

        {/* Search Input */}
        <div className="mt-10 flex justify-center px-4">
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full max-w-md md:max-w-lg p-3 rounded-2xl border text-white border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none shadow-sm transition-all"
            value={userSearch}
            onChange={(e)=> setUserSearch(e.target.value)}
          />
          
        </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3 px-4">
  {["Personal Finance", "Health", "Technology", "Education"].map((cat) => (
    <button
      key={cat}
      className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-500 font-medium hover:bg-indigo-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
      onClick={()=>setCategorie(`${cat}`)}
    >
      {cat}
    </button>
  ))}
</div>
 <div className="max-w-7xl mx-auto px-4 py-10">
  <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-indigo-700">
    Latest Blogs
  </h1>

  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {blogs.filter((b) =>
    b.category.toLocaleLowerCase().includes(categorie.toLocaleLowerCase()) &&
  b.category.toLowerCase().includes(userSearch.trim().toLowerCase())
).map((b) => (
    <Link key={b.id} href={`/Blog/${b.id}`}>
        <div className="w-full h-48 relative">
          <Image
            src={b.coverImage}
            alt={b.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Blog Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-xl md:text-2xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2 line-clamp-2">
            {b.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3 dark:text-white">{b.excerpt}</p>

          {/* Author & Category */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              
              <span className="text-gray-700 font-medium dark:text-white">{b.author.name}</span>
            </div>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
              {b.category}
            </span>
          </div>
        </div>
      
        </Link>
    ))}
  </div>

</div>

      </section>
    </>
  );
}
