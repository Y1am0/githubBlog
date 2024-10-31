'use client'

import { useRouter } from 'next/navigation'

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    const response = await fetch(`/api/post/${slug}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      router.refresh()
    } else {
      alert('Failed to delete post')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:underline"
    >
      Delete
    </button>
  )
}