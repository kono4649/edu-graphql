import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OperationSelector } from '@/features/playground/components/operation-selector'

describe('OperationSelector', () => {
  it('renders all operation types', () => {
    render(<OperationSelector selected="query" onChange={() => {}} />)
    expect(screen.getByText('Query')).toBeTruthy()
    expect(screen.getByText('Mutation')).toBeTruthy()
    expect(screen.getByText('Subscription')).toBeTruthy()
  })

  it('calls onChange with correct value when clicked', async () => {
    const onChange = vi.fn()
    render(<OperationSelector selected="query" onChange={onChange} />)
    await userEvent.click(screen.getByText('Mutation'))
    expect(onChange).toHaveBeenCalledWith('mutation')
  })

  it('applies active style to selected operation', () => {
    render(<OperationSelector selected="mutation" onChange={() => {}} />)
    const mutationBtn = screen.getByText('Mutation')
    expect(mutationBtn.className).toContain('bg-indigo-600')
  })
})
