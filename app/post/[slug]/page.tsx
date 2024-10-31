import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Link from 'next/link'

export default async function Post({ params }: { params: { slug: string } }) {
  const { slug } = params
  const fullPath = path.join(process.cwd(), 'posts', `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <div className="mt-4">
        <Link href="/" className="text-blue-500 hover:underline mr-4">
          Back to Home
        </Link>
        <Link href={`/edit/${slug}`} className="text-blue-500 hover:underline">
          Edit Post
        </Link>
      </div>
    </div>
  )
}