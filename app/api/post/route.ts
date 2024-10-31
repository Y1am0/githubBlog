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

export async function POST(request: Request) {
  const { title, content } = await request.json()
  const slug = title.toLowerCase().replace(/ /g, '-')
  const fileName = `${slug}.md`
  const filePath = path.join(postsDirectory, fileName)

  const fileContent = matter.stringify(content, { title })

  fs.writeFileSync(filePath, fileContent)

  try {
    await git.add(filePath)
    await git.commit(`Add new post: ${title}`)
    await git.push()
  } catch (error) {
    console.error('Error pushing to git:', error)
    // Continue even if git push fails
  }

  return NextResponse.json({ message: 'Post created successfully' })
}