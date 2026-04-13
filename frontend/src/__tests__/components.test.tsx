import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatusBadge from '../components/StatusBadge';
import TaskCard from '../components/TaskCard';
import type { Task } from '../types';

// ─── StatusBadge ────────────────────────────────────────────────────────────

describe('StatusBadge', () => {
  it('renders "Pending" label for pending status', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders "In Progress" label for in_progress status', () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders "Completed" label for completed status', () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('applies amber color classes for pending status', () => {
    const { container } = render(<StatusBadge status="pending" />);
    expect(container.firstChild).toHaveClass('text-amber-700');
  });

  it('applies blue color classes for in_progress status', () => {
    const { container } = render(<StatusBadge status="in_progress" />);
    expect(container.firstChild).toHaveClass('text-blue-700');
  });

  it('applies emerald color classes for completed status', () => {
    const { container } = render(<StatusBadge status="completed" />);
    expect(container.firstChild).toHaveClass('text-emerald-700');
  });
});

// ─── TaskCard ───────────────────────────────────────────────────────────────

const mockTask: Task = {
  id: 1,
  title: 'Build the API',
  description: 'Set up Laravel routes and controllers.',
  status: 'pending',
  status_label: 'Pending',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe('TaskCard', () => {
  const defaultProps = {
    task: mockTask,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onStatusChange: vi.fn(),
  };

  it('renders task title', () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.getByText('Build the API')).toBeInTheDocument();
  });

  it('renders task description', () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.getByText('Set up Laravel routes and controllers.')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<TaskCard {...defaultProps} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('does not render description when null', () => {
    const task = { ...mockTask, description: null };
    render(<TaskCard {...defaultProps} task={task} />);
    expect(screen.queryByText('Set up Laravel routes and controllers.')).not.toBeInTheDocument();
  });

  it('calls onEdit when Edit button clicked', () => {
    const onEdit = vi.fn();
    render(<TaskCard {...defaultProps} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('shows confirm prompt on first delete click', () => {
    render(<TaskCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Confirm?')).toBeInTheDocument();
  });

  it('calls onDelete on second (confirmed) delete click', async () => {
    const onDelete = vi.fn().mockResolvedValue(true);
    render(<TaskCard {...defaultProps} onDelete={onDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(screen.getByText('Confirm?'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('calls onStatusChange with next status when quick-advance clicked', () => {
    const onStatusChange = vi.fn();
    render(<TaskCard {...defaultProps} onStatusChange={onStatusChange} />);
    fireEvent.click(screen.getByText('▶ Start'));
    expect(onStatusChange).toHaveBeenCalledWith(1, 'in_progress');
  });

  it('shows "✓ Complete" button for in_progress task', () => {
    const task = { ...mockTask, status: 'in_progress' as const };
    render(<TaskCard {...defaultProps} task={task} />);
    expect(screen.getByText('✓ Complete')).toBeInTheDocument();
  });

  it('shows "↺ Reopen" button for completed task', () => {
    const task = { ...mockTask, status: 'completed' as const };
    render(<TaskCard {...defaultProps} task={task} />);
    expect(screen.getByText('↺ Reopen')).toBeInTheDocument();
  });
});
