import SwaggerUIClient from './swagger-ui'

export const metadata = {
  title: 'API Documentation - Nomad Cafe',
  description: 'API documentation for Nomad Cafe application',
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <SwaggerUIClient />
    </div>
  )
}
