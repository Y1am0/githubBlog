import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import simpleGit from 'simple-git'

const postsDirectory = path.join(process.cwd(), 'posts')
const git = simpleGit()

// Ensure the posts directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true })
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return NextResponse.json({ title: data.title, content })
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params
  const { title, content } = await request.json()
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const fileContent = matter.stringify(content, { title })

  fs.writeFileSync(fullPath, fileContent)

  try {
    await git.add(fullPath)
    await git.commit(`Update post: ${title}`)
    await git.push()
  } catch (error) {
    console.error('Error pushing to git:', error)
    // Continue even if git push fails
  }

  return NextResponse.json({ message: 'Post updated successfully' })
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  fs.unlinkSync(fullPath)

  try {
    await git.rm(fullPath)
    await git.commit(`Delete post: ${slug}`)
    await git.push()
  } catch (error) {
    console.error('Error pushing to git:', error)
    // Continue even if git push fails
  }

  return NextResponse.json({ message: 'Post deleted successfully' })
}