import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GET_TASKS = gql`
  query GetTasks {
    getTasks {
      id
      title
      description
      status
      priority
      user {
        name
      }
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String, $priority: String) {
    createTask(title: $title, description: $description, priority: $priority) {
      id
      title
      status
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $status: String) {
    updateTask(id: $id, status: $status) {
      id
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const { loading, error, data, refetch } = useQuery(GET_TASKS);
    const [createTask] = useMutation(CREATE_TASK);
    const [updateTask] = useMutation(UPDATE_TASK);
    const [deleteTask] = useMutation(DELETE_TASK);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('task_created', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            refetch();
        });

        return () => socket.disconnect();
    }, [refetch]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle) return;
        try {
            await createTask({ variables: { title: newTaskTitle } });
            setNewTaskTitle('');
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'todo' ? 'in-progress' : currentStatus === 'in-progress' ? 'done' : 'todo';
        try {
            await updateTask({ variables: { id, status: nextStatus } });
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await deleteTask({ variables: { id } });
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Loading your workspace...</p>
        </div>
    );

    if (error) return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', gap: '1rem' }}>
            <p style={{ fontSize: '1.25rem', color: 'var(--danger)' }}>{error.message}</p>
            <button onClick={() => refetch()} className="btn-primary">Try again</button>
        </div>
    );

    const tasks = data?.getTasks ?? [];

    return (
        <div className="container">
            <header className="header-flex fade-in">
                <div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: '800', letterSpacing: '-0.025em' }}>
                        Hello, {user?.name?.split(' ')[0] ?? 'User'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>You have {tasks.length} active tasks today.</p>
                </div>
                <button onClick={logout} className="glass" style={{ padding: '0.5rem 1rem', color: 'var(--text)', fontSize: '0.875rem' }}>
                    Sign Out
                </button>
            </header>

            <div className="dashboard-grid">
                <main>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass card"
                        style={{ marginBottom: '2rem', padding: '1.5rem' }}
                    >
                        <form onSubmit={handleCreateTask} className="task-form-flex" style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                style={{ fontSize: '1rem', padding: '0.85rem 1rem' }}
                            />
                            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                                <Plus size={20} /> Add Task
                            </button>
                        </form>
                    </motion.div>

                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                        <AnimatePresence mode="popLayout">
                            {tasks.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}
                                >
                                    <p>No tasks found. Start by adding one above!</p>
                                </motion.div>
                            ) : tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="glass card task-card"
                                    style={{ borderLeft: `4px solid ${task.status === 'done' ? 'var(--success)' : 'var(--primary)'}` }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ marginBottom: '0.5rem', textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.6 : 1 }}>
                                            {task.title}
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            <span className="glass" style={{ padding: '0.25rem 0.6rem', color: 'var(--primary)' }}>
                                                {task.priority || 'Medium'}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateStatus(task.id, task.status)}
                                                className="glass"
                                                style={{ padding: '0.25rem 0.6rem', color: task.status === 'done' ? 'var(--success)' : 'var(--text)', background: 'transparent' }}
                                            >
                                                {task.status.replace('-', ' ')}
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            style={{ color: 'var(--danger)', background: 'transparent', padding: '0.5rem', borderRadius: '50%' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </main>

                <aside>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass"
                        style={{ height: 'fit-content', position: 'sticky', top: '2rem', padding: '1.5rem', borderRadius: '1rem' }}
                    >
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={20} /> Activity Feed
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <AnimatePresence initial={false}>
                                {notifications.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Waiting for updates...</p>
                                ) : (
                                    notifications.map((notif, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{
                                                fontSize: '0.875rem',
                                                borderLeft: '3px solid var(--primary)',
                                                padding: '0.5rem 0.75rem',
                                                background: 'rgba(99, 102, 241, 0.05)',
                                                borderRadius: '0 0.5rem 0.5rem 0'
                                            }}
                                        >
                                            {notif.message}
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </aside>
            </div>
        </div>
    );
};
