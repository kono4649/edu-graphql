interface ResultDisplayProps {
  result: string
  isSubscribed: boolean
}

export function ResultDisplay({ result, isSubscribed }: ResultDisplayProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">実行結果</h3>
        {isSubscribed && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Subscription 接続中
          </span>
        )}
      </div>
      <pre className="flex-1 bg-gray-900 text-green-400 text-sm p-4 rounded-md overflow-auto font-mono whitespace-pre-wrap">
        {result || '結果がここに表示されます'}
      </pre>
    </div>
  )
}
