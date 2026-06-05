import { BookOpen, Globe2, Server } from 'lucide-react'

import ApiEndpointCard from '../components/docs/ApiEndpointCard'
import ApiPlayground from '../components/docs/ApiPlayground'
import CodeBlock from '../components/docs/CodeBlock'
import DocTable from '../components/docs/DocTable'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { WEB_API_BASE_URL } from '../config/api'

const baseUrl = WEB_API_BASE_URL

const galleryResponseExample = `{
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

const packageResponseExample = `{
  "message": "Tour packages fetched",
  "data": [
    {
      "_id": "665f4d0a4f2a1c6c5f6c9a20",
      "title": "1 Day Sundarban Explorer",
      "slug": "1-day-sundarban-tour",
      "duration": "1 Day",
      "price": 1999,
      "priceLabel": "₹1,999 / person",
      "groupSize": "Min 10 persons",
      "highlights": ["Sajnekhali Watchtower", "Boat Safari"],
      "imageUrl": "https://ik.imagekit.io/.../package.jpg",
      "thumbnailUrl": "https://ik.imagekit.io/.../package-thumb.jpg",
      "featured": true,
      "isActive": true
    }
  ]
}`

const fetchExample = `async function getPublishedPackages() {
  const response = await fetch('http://localhost:5500/api/web/packages')
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to fetch packages')
  }

  return result.data
}`

const galleryFetchExample = `async function getGalleryImages() {
  const response = await fetch('http://localhost:5500/api/web/gallery')
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
            href={`${baseUrl}/packages`}
            rel="noreferrer"
            target="_blank"
          >
            <Globe2 aria-hidden="true" className="h-4 w-4" />
            Open Web API
          </a>
        }
        eyebrow="Developer Docs"
        title="Web Content API"
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
            label="Content Access"
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
          The web API only returns published content where <code>isActive</code> is true.
          Admin create, edit, upload, and delete actions stay under <code>/api/admin</code>.
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

          <CodeBlock title="Response">{galleryResponseExample}</CodeBlock>
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
          title="Gallery Fetch Example"
        >
          <CodeBlock title="JavaScript">{galleryFetchExample}</CodeBlock>
        </ApiEndpointCard>

        <ApiEndpointCard
          description="Returns all published tour packages for the public website."
          path="/api/web/packages"
          title="List Published Tour Packages"
        >
          <DocTable
            columns={['Query', 'Type', 'Required', 'Description']}
            rows={[
              ['category', 'string', 'No', 'Filter published packages by category.'],
              ['featured', 'boolean', 'No', 'Filter by featured package status.'],
            ]}
          />

          <CodeBlock title="Request">
            {`GET ${baseUrl}/packages
GET ${baseUrl}/packages?category=tour
GET ${baseUrl}/packages?featured=true`}
          </CodeBlock>

          <CodeBlock title="Response">{packageResponseExample}</CodeBlock>
        </ApiEndpointCard>

        <ApiEndpointCard
          description="Returns one published tour package by slug."
          path="/api/web/packages/:slug"
          title="Get Published Tour Package"
        >
          <DocTable
            columns={['Param', 'Type', 'Required', 'Description']}
            rows={[['slug', 'string', 'Yes', 'Stable package slug.']]}
          />

          <CodeBlock title="Request">{`GET ${baseUrl}/packages/1-day-sundarban-tour`}</CodeBlock>

          <CodeBlock title="Not Found Response">
            {`{
  "message": "Tour package not found"
}`}
          </CodeBlock>
        </ApiEndpointCard>

        <ApiEndpointCard
          description="Example code for consuming the web package API from a React website."
          path="Frontend usage"
          title="Package Fetch Example"
        >
          <CodeBlock title="JavaScript">{fetchExample}</CodeBlock>
        </ApiEndpointCard>
      </section>
    </>
  )
}

export default DocsPage
