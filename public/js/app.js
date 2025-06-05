// Gerenciador de Tarefas - Frontend JavaScript
class TaskManager {
    constructor() {
        this.apiUrl = '/api';
        this.tasks = [];
        this.editingTaskId = null;
        this.pendingAction = null; // Para armazenar a ação pendente
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadTasks();
    }

    setupEventListeners() {
        // Formulário de nova tarefa
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Modal de edição
        const modal = document.getElementById('editModal');
        const closeModal = document.querySelector('.close');

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        if (modal) {
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Modal de confirmação
        const confirmModal = document.getElementById('confirmModal');
        if (confirmModal) {
            window.addEventListener('click', (e) => {
                if (e.target === confirmModal) {
                    this.closeConfirmModal();
                }
            });
        }

        // Tecla ESC para fechar modais
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeConfirmModal();
            }
        });

        // Formulário de edição
        const editForm = document.getElementById('editTaskForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        }
    }

    async loadTasks() {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiUrl}/tarefas`);
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            this.tasks = await response.json();
            this.renderTasks();
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            this.showMessage('Erro ao carregar tarefas. Tente novamente.', 'error');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            titulo: formData.get('titulo').trim(),
            nota: formData.get('nota').trim(),
            prazo_conclusao: formData.get('prazo_conclusao') || null
        };

        if (!taskData.titulo) {
            this.showMessage('O título é obrigatório!', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/tarefas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao criar tarefa');
            }

            const newTask = await response.json();
            this.tasks.unshift(newTask);
            this.renderTasks();
            e.target.reset();
            this.showMessage('Tarefa criada com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            this.showMessage(error.message, 'error');
        }
    }

    async handleEditSubmit(e) {
        e.preventDefault();
        
        if (!this.editingTaskId) return;

        const formData = new FormData(e.target);
        const taskData = {
            titulo: formData.get('titulo').trim(),
            nota: formData.get('nota').trim(),
            prazo_conclusao: formData.get('prazo_conclusao') || null
        };

        if (!taskData.titulo) {
            this.showMessage('O título é obrigatório!', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/tarefas/${this.editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao atualizar tarefa');
            }

            const updatedTask = await response.json();
            const taskIndex = this.tasks.findIndex(task => task.id === this.editingTaskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = updatedTask;
            }
            
            this.renderTasks();
            this.closeModal();
            this.showMessage('Tarefa atualizada com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            this.showMessage(error.message, 'error');
        }
    }

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        const taskTitle = task ? task.titulo : 'esta tarefa';

        this.showConfirmModal(
            'Marcar como Concluída',
            `Tem certeza que deseja marcar "${taskTitle}" como concluída?`,
            () => this.executeCompleteTask(taskId),
            'Marcar como Concluída',
            'btn-success'
        );
    }

    async executeCompleteTask(taskId) {
        try {
            const response = await fetch(`${this.apiUrl}/tarefas/${taskId}/concluir`, {
                method: 'PATCH'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao concluir tarefa');
            }

            const result = await response.json();
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.renderTasks();
            this.showMessage(result.message || 'Tarefa marcada como concluída!', 'success');
        } catch (error) {
            console.error('Erro ao concluir tarefa:', error);
            this.showMessage(error.message, 'error');
        }
    }

    deleteTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        const taskTitle = task ? task.titulo : 'esta tarefa';

        this.showConfirmModal(
            'Excluir Tarefa',
            `Tem certeza que deseja excluir "${taskTitle}"? Esta ação não pode ser desfeita.`,
            () => this.executeDeleteTask(taskId),
            'Excluir',
            'btn-danger'
        );
    }

    async executeDeleteTask(taskId) {
        try {
            const response = await fetch(`${this.apiUrl}/tarefas/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao excluir tarefa');
            }

            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.renderTasks();
            this.showMessage('Tarefa excluída com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            this.showMessage(error.message, 'error');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.editingTaskId = taskId;
        
        // Preencher o formulário de edição
        document.getElementById('editTitulo').value = task.titulo;
        document.getElementById('editNota').value = task.nota || '';
        
        // Formatar data para input date
        if (task.prazo_conclusao) {
            const date = new Date(task.prazo_conclusao);
            const formattedDate = date.toISOString().split('T')[0];
            document.getElementById('editPrazoConclusao').value = formattedDate;
        } else {
            document.getElementById('editPrazoConclusao').value = '';
        }

        // Mostrar modal
        document.getElementById('editModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTaskId = null;
    }

    // Funções para modal de confirmação personalizado
    showConfirmModal(title, message, action, buttonText = 'Confirmar', buttonClass = 'btn-danger') {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;

        const confirmButton = document.getElementById('confirmButton');
        confirmButton.textContent = buttonText;
        confirmButton.className = `btn ${buttonClass}`;

        this.pendingAction = action;
        document.getElementById('confirmModal').style.display = 'block';
    }

    closeConfirmModal() {
        document.getElementById('confirmModal').style.display = 'none';
        this.pendingAction = null;
    }

    confirmAction() {
        if (this.pendingAction) {
            this.pendingAction();
            this.closeConfirmModal();
        }
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        if (!container) return;

        if (this.tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Nenhuma tarefa encontrada</h3>
                    <p>Crie sua primeira tarefa usando o formulário acima!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.tasks.map(task => this.renderTask(task)).join('');
    }

    renderTask(task) {
        const createdDate = new Date(task.data_criacao).toLocaleDateString('pt-BR');
        const createdTime = new Date(task.data_criacao).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        let deadlineHtml = '';
        if (task.prazo_conclusao) {
            const deadline = new Date(task.prazo_conclusao);
            const today = new Date();
            const isOverdue = deadline < today;
            const deadlineClass = isOverdue ? 'task-deadline' : 'task-deadline future';
            const deadlineText = deadline.toLocaleDateString('pt-BR');

            deadlineHtml = `<span class="${deadlineClass}">
                ${isOverdue ? 'Venceu em' : 'Prazo:'} ${deadlineText}
            </span>`;
        }

        return `
            <div class="task-item">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHtml(task.titulo)}</h3>
                    <div class="task-actions">
                        <button class="btn btn-success btn-small" onclick="taskManager.completeTask(${task.id})">
                            Concluído
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="taskManager.editTask(${task.id})">
                            Editar
                        </button>
                        <button class="btn btn-danger btn-small" onclick="taskManager.deleteTask(${task.id})">
                            Excluir
                        </button>
                    </div>
                </div>
                <div class="task-meta">
                    Criada em ${createdDate} às ${createdTime}
                </div>
                ${task.nota ? `<div class="task-description">${this.escapeHtml(task.nota)}</div>` : ''}
                ${deadlineHtml}
            </div>
        `;
    }

    showLoading() {
        const container = document.getElementById('tasksContainer');
        if (container) {
            container.innerHTML = '<div class="loading">Carregando tarefas...</div>';
        }
    }

    showMessage(message, type = 'info') {
        // Remove mensagens existentes
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Insere no início do container
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
            
            // Remove automaticamente após 5 segundos
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});
