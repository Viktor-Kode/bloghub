import { blogs } from "../data";
import Image from "next/image";
import { format } from "date-fns";

export default function BlogId({ params }: { params: { blobId: string } }) {
  const blog = blogs.find((b) => b.id.toString() === params.blobId);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">Blog not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Blog Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4 text-center">
        {blog.title}
      </h1>

      {/* Author + Category + Date */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 text-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={blog.author.avatar}
              alt={blog.author.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <span className="font-medium">{blog.author.name}</span>
        </div>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
          {blog.category}
        </span>
        <span className="text-sm">{format(new Date(blog.publishedAt), "MMMM dd, yyyy")}</span>
      </div>

      {/* Blog Hero Image */}
      <div className="w-full h-72 md:h-96 relative mb-8 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Blog Content */}
      <div className="prose prose-indigo max-w-none mx-auto text-gray-700">
        <p>{blog.excerpt}</p>
        {/* Placeholder for body if you extend your dataset */}
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          fermentum massa at lacus laoreet, non pulvinar erat congue. Sed
          dapibus, justo a mattis vulputate, lorem elit varius lectus, vel
          posuere justo leo non justo.
        </p>
        <p>
          Cras nec eros et nunc fermentum euismod. Praesent et malesuada
          sapien. Mauris bibendum turpis non mauris hendrerit, sed lacinia
          libero dictum.
        </p>
      </div>

      {/* Tags */}
      <div className="mt-10 flex flex-wrap gap-3">
        {blog.tags.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
