const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// Listar todas as tarefas do usuário
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            tasks
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao buscar tarefas',
            error: error.message 
        });
    }
});

// Criar nova tarefa
router.post('/', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Texto da tarefa é obrigatório' 
            });
        }

        const task = await Task.create({
            userId: req.userId,
            text: text.trim(),
            completed: false
        });

        res.status(201).json({
            success: true,
            message: 'Tarefa criada com sucesso',
            task
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao criar tarefa',
            error: error.message 
        });
    }
});

// Atualizar tarefa (completar/descompletar)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed, text } = req.body;

        const task = await Task.findOne({ _id: id, userId: req.userId });

        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: 'Tarefa não encontrada' 
            });
        }

        if (completed !== undefined) {
            task.completed = completed;
        }
        
        if (text !== undefined) {
            task.text = text.trim();
        }

        await task.save();

        res.json({
            success: true,
            message: 'Tarefa atualizada com sucesso',
            task
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar tarefa',
            error: error.message 
        });
    }
});

// Deletar tarefa
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: 'Tarefa não encontrada' 
            });
        }

        res.json({
            success: true,
            message: 'Tarefa deletada com sucesso'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao deletar tarefa',
            error: error.message 
        });
    }
});

module.exports = router;
