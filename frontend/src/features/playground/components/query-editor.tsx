import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'

interface QueryEditorProps {
  value: string
  onChange: (value: string) => void
}

export function QueryEditor({ value, onChange }: QueryEditorProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-sm font-medium text-gray-700 mb-2">クエリエディタ</h3>
      <div className="flex-1 border border-gray-300 rounded-md overflow-hidden">
        <CodeMirror
          value={value}
          height="100%"
          extensions={[javascript()]}
          onChange={onChange}
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            autocompletion: true,
          }}
        />
      </div>
    </div>
  )
}
