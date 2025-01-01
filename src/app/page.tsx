import React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Post } from '@/types/blog';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const getPostsData = (): Post[] => {
    const postsDirectory = path.join(process.cwd(), 'src/posts');
    const fileNames = fs.readdirSync(postsDirectory);
    
    const posts = fileNames.map(fileName => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Match content between triple dashes
      const frontmatterMatch = fileContent.match(/^---\s*\n(.*?)\n---/s);
      const frontmatter = frontmatterMatch?.[1] || '';
      
      return {
        id: fileName.replace(/\.md$/, ''),
        title: frontmatter.match(/title:\s*"([^"]*)"/)?.[1] || '',
        subtitle: frontmatter.match(/subtitle:\s*"([^"]*)"/)?.[1] || '',
      };
    });
    
    return posts;
  };

  const posts = getPostsData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto p-8">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shumaila&apos;s Blog
          </h1>
        </header>

        <div className="grid gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id}
              href={`/posts/${post.id}`}
              className="group"
            >
              <article className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{post.subtitle}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};