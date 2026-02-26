const User = require('../models/User');
const Task = require('../models/Task');
const { generateToken } = require('../middleware/auth');

const resolvers = {
    User: {
        id: (parent) => (parent._id || parent.id).toString(),
    },
    Task: {
        id: (parent) => (parent._id || parent.id).toString(),
        createdAt: (parent) => (parent.createdAt && parent.createdAt.toISOString) ? parent.createdAt.toISOString() : (parent.createdAt || new Date().toISOString()),
    },
    Query: {
        getTasks: async (_, __, { user }) => {
            if (!user) throw new Error('Not authenticated');
            if (user.role === 'admin') return await Task.find({}).populate('user');
            return await Task.find({ user: user.id }).populate('user');
        },
        getTask: async (_, { id }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            const task = await Task.findById(id).populate('user');
            if (!task) throw new Error('Task not found');
            const ownerId = (task.user._id || task.user.id || task.user).toString();
            if (user.role !== 'admin' && ownerId !== user.id.toString()) throw new Error('Not authorized');
            return task;
        },
        me: async (_, __, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return await User.findById(user.id).select('-password');
        },
    },
    Mutation: {
        register: async (_, { name, email, password }) => {
            const userExists = await User.findOne({ email });
            if (userExists) throw new Error('User already exists');
            const user = await User.create({ name, email, password });
            const userWithoutPassword = await User.findById(user._id).select('-password');
            return {
                token: generateToken(user._id),
                user: userWithoutPassword,
            };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (user && (await user.matchPassword(password))) {
                const userWithoutPassword = await User.findById(user._id).select('-password');
                return {
                    token: generateToken(user._id),
                    user: userWithoutPassword,
                };
            } else {
                throw new Error('Invalid email or password');
            }
        },
        createTask: async (_, { title, description, priority }, { user, io }) => {
            if (!user) throw new Error('Not authenticated');
            const task = await Task.create({
                user: user.id,
                title,
                description,
                priority,
            });
            const populatedTask = await task.populate('user');
            io.emit('task_created', {
                message: `New task created by ${user.name}: ${title}`,
                task: populatedTask,
            });
            return populatedTask;
        },
        updateTask: async (_, { id, ...updates }, { user, io }) => {
            if (!user) throw new Error('Not authenticated');
            let task = await Task.findById(id);
            if (!task) throw new Error('Task not found');
            if (user.role !== 'admin' && task.user.toString() !== user.id) throw new Error('Not authorized');

            task = await Task.findByIdAndUpdate(id, updates, { new: true }).populate('user');
            io.emit('task_created', {
                message: `Task "${task.title}" was updated by ${user.name}`,
                task,
            });
            return task;
        },
        deleteTask: async (_, { id }, { user, io }) => {
            if (!user) throw new Error('Not authenticated');
            const task = await Task.findById(id);
            if (!task) throw new Error('Task not found');
            if (user.role !== 'admin' && task.user.toString() !== user.id) throw new Error('Not authorized');

            const title = task.title;
            await task.deleteOne();
            io.emit('task_created', {
                message: `Task "${title}" was deleted by ${user.name}`,
                id: id,
            });
            return 'Task deleted successfully';
        },
    },
};

module.exports = resolvers;
