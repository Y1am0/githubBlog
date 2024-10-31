import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'

export default function Home() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  
  // Create the posts directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      return {
        slug: fileName.replace(/\.md$/, ''),
        title: data.title || 'Untitled',
      }
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      <Link href="/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block">
        Add New Post
      </Link>
      {posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug} className="border p-4 rounded">
              <Link href={`/post/${post.slug}`} className="text-xl font-semibold hover:underline">
                {post.title}
              </Link>
              <div className="mt-2 space-x-2">
                <Link href={`/edit/${post.slug}`} className="text-blue-500 hover:underline">
                  Edit
                </Link>
                <DeleteButton slug={post.slug} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts yet. Create your first post!</p>
      )}
    </div>
  )
}