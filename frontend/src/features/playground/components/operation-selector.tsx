type OperationType = 'query' | 'mutation' | 'subscription'

interface OperationSelectorProps {
  selected: OperationType
  onChange: (op: OperationType) => void
}

const OPERATIONS: { value: OperationType; label: string }[] = [
  { value: 'query', label: 'Query' },
  { value: 'mutation', label: 'Mutation' },
  { value: 'subscription', label: 'Subscription' },
]

export function OperationSelector({ selected, onChange }: OperationSelectorProps) {
  return (
    <div className="flex gap-2">
      {OPERATIONS.map((op) => (
        <button
          key={op.value}
          onClick={() => onChange(op.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selected === op.value
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {op.label}
        </button>
      ))}
    </div>
  )
}
