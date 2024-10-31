'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

async function getPost(slug: string) {
  const response = await fetch(`/api/post/${slug}`)
  if (response.ok) {
    return response.json()
  } else {
    throw new Error('Failed to fetch post')
  }
}

export default function EditPost({ params }: { params: { slug: string } }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()
  const { slug } = params

  useEffect(() => {
    getPost(slug)
      .then((post) => {
        setTitle(post.title)
        setContent(post.content)
      })
      .catch((error) => {
        alert(error.message)
      })
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/post/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
    if (response.ok) {
      router.push('/')
    } else {
      alert('Failed to update post')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-2">Content (Markdown):</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-64"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Update Post
        </button>
      </form>
    </div>
  )
}