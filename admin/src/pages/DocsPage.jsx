import { BookOpen, Globe2, Server } from 'lucide-react'

import ApiEndpointCard from '../components/docs/ApiEndpointCard'
import ApiPlayground from '../components/docs/ApiPlayground'
import CodeBlock from '../components/docs/CodeBlock'
import DocTable from '../components/docs/DocTable'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { WEB_API_BASE_URL } from '../config/api'

const baseUrl = WEB_API_BASE_URL

const responseExample = `{
  "message": "Gallery images fetched",
  "data": [
    {
      "_id": "665f4d0a4f2a1c6c5f6c9a20",
      "title": "Sunset creek",
      "altText": "Sunset over Sundarban creek",
      "description": "Optional image description",
      "category": "nature",
      "url": "https://ik.imagekit.io/hfel5jdpoa/sundarban/gallery/image.jpg",
      "thumbnailUrl": "https://ik.imagekit.io/hfel5jdpoa/...",
      "sortOrder": 0,
      "isActive": true,
      "createdAt": "2026-06-02T12:00:00.000Z"
    }
  ]
}`

const fetchExample = `async function getGalleryImages() {
  const response = await fetch('http://localhost:5000/api/web/gallery')
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to fetch gallery')
  }

  return result.data
}`

function DocsPage() {
  return (
    <>
      <PageHeader
        action={
          <a
            className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            href={`${baseUrl}/gallery`}
            rel="noreferrer"
            target="_blank"
          >
            <Globe2 aria-hidden="true" className="h-4 w-4" />
            Open Web API
          </a>
        }
        eyebrow="Developer Docs"
        title="Web Gallery API"
      />

      <section className="space-y-6 px-5 py-6 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            change="Public"
            icon={Globe2}
            label="API Scope"
            tone="cyan"
            value="Web"
          />
          <StatCard
            change="Read only"
            icon={BookOpen}
            label="Gallery Access"
            tone="emerald"
            value="GET"
          />
          <StatCard
            change="Express"
            icon={Server}
            label="Base URL"
            tone="slate"
            value="/api/web"
          />
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          The web gallery API only returns images where <code>isActive</code> is true.
          Admin upload, edit, and delete actions stay under <code>/api/admin/gallery</code>.
        </div>

        <ApiPlayground baseUrl={baseUrl} />

        <ApiEndpointCard
          description="Returns all published gallery images for the public website."
          path="/api/web/gallery"
          title="List Published Gallery Images"
        >
          <DocTable
            columns={['Query', 'Type', 'Required', 'Description']}
            rows={[
              ['category', 'string', 'No', 'Filter published images by category.'],
            ]}
          />

          <CodeBlock title="Request">
            {`GET ${baseUrl}/gallery
GET ${baseUrl}/gallery?category=nature`}
          </CodeBlock>

          <CodeBlock title="Response">{responseExample}</CodeBlock>
        </ApiEndpointCard>

        <ApiEndpointCard
          description="Returns one published gallery image by MongoDB document ID."
          path="/api/web/gallery/:id"
          title="Get Published Gallery Image"
        >
          <DocTable
            columns={['Param', 'Type', 'Required', 'Description']}
            rows={[
              ['id', 'string', 'Yes', 'Gallery image document ID.'],
            ]}
          />

          <CodeBlock title="Request">{`GET ${baseUrl}/gallery/665f4d0a4f2a1c6c5f6c9a20`}</CodeBlock>

          <CodeBlock title="Not Found Response">
            {`{
  "message": "Gallery image not found"
}`}
          </CodeBlock>
        </ApiEndpointCard>

        <ApiEndpointCard
          description="Example code for consuming the web gallery API from a React website."
          path="Frontend usage"
          title="Frontend Fetch Example"
        >
          <CodeBlock title="JavaScript">{fetchExample}</CodeBlock>
        </ApiEndpointCard>
      </section>
    </>
  )
}

export default DocsPage
