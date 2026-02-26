const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
        priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    },
    { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
