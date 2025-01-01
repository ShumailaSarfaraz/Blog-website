import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Comments from './Comments';

interface PostPageProps {
  params: {
    slug: string;
  };
  postId:string
}

export default async function PostPage({ params,postId }: PostPageProps) {
  const { slug } = params;

  const getPostContent = async () => {
    const filePath = path.join(process.cwd(), 'src/posts', `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Extract front matter (title, subtitle, and date)
    const frontMatterMatch = fileContent.match(/^---\s*([\s\S]*?)\s*---/);
    const frontMatter = frontMatterMatch ? frontMatterMatch[1] : '';

    const titleMatch = frontMatter.match(/title:\s*"([^"]*)"/);
    const subtitleMatch = frontMatter.match(/subtitle:\s*"([^"]*)"/);
    const dateMatch = frontMatter.match(/date:\s*"([^"]*)"/);

    const title = titleMatch ? titleMatch[1] : 'Untitled';
    const subtitle = subtitleMatch ? subtitleMatch[1] : '';
    const date = dateMatch ? dateMatch[1] : '';

    // Parse the Markdown content
    const markdownContent = fileContent.replace(/^---\s*[\s\S]*?---\s*/, '');
    const htmlContent = await marked(markdownContent);

    return { title, subtitle, date, htmlContent };
  };

  const { title, subtitle, date, htmlContent } = await getPostContent();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to all posts
        </Link>

        <article className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <header className="mb-8 border-b border-gray-100 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-600 text-lg mb-2">{subtitle}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <time>{date}</time>
            </div>
          </header>

          <div
            className="prose prose-gray lg:prose-xl max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <hr className="my-12 border-gray-100" />

          <section className="bg-gray-50 rounded-lg p-6 mt-12">
            <Comments />
          </section>
        </article>
      </div>
    </div>
  );
}
