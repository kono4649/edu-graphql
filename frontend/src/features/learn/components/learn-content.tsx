interface CodeBlockProps {
  code: string
  language?: string
}

function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded-md overflow-auto font-mono whitespace-pre">
      {code}
    </pre>
  )
}

interface Section {
  title: string
  body: string
  code?: string
}

interface LearnContentProps {
  heading: string
  description: string
  sections: Section[]
}

export function LearnContent({ heading, description, sections }: LearnContentProps) {
  return (
    <div className="prose max-w-none">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{heading}</h1>
      <p className="text-gray-600 mb-6">{description}</p>
      {sections.map((section, i) => (
        <div key={i} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h2>
          <p className="text-gray-700 mb-3">{section.body}</p>
          {section.code && <CodeBlock code={section.code} />}
        </div>
      ))}
    </div>
  )
}
