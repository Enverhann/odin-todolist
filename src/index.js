import Todo from './todo';
import Project from './project';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('project-list');
    const todoList = document.getElementById('todo-list');
    const createProjectButton = document.getElementById('create-project');
    const createTodoButton = document.getElementById('create-todo');
    const todoForm = document.getElementById('todo-form');
    const todoTitleInput = document.getElementById('todo-title');
    const todoDescriptionInput = document.getElementById('todo-description');
    const dueDateInput = document.getElementById('due-date');
    const prioritySelect = document.getElementById('priority');

    // Initialize projects and todos arrays
    const projects = [];
    const todos = [];

    function renderProjects() {
        projectList.innerHTML = '';
        projects.forEach((project, index) => {
            const projectItem = document.createElement('li');
    
            // Create a div to hold the project name
            const projectNameDiv = document.createElement('div');
            projectNameDiv.textContent = project.name;
    
            // Create delete and edit buttons
            const buttonDiv = document.createElement('div');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteProject(index));
    
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => editProject(index));
    
            // Append project name and buttons to the project item
            projectItem.appendChild(projectNameDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(editButton);
            projectItem.appendChild(buttonDiv);
    
            projectList.appendChild(projectItem);
        });
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const todoItem = document.createElement('li');
            
            // Create a container div for the todo title and description
            const todoContent = document.createElement('div');
            
            // Create a paragraph for the todo title
            const titleParagraph = document.createElement('p');
            titleParagraph.textContent = `
                Title: ${todo.title}
            `;

            
            // Create a paragraph for the todo description
            const descriptionParagraph = document.createElement('p');
            descriptionParagraph.textContent = `
                Description: ${todo.description}
            `;
            
            todoContent.appendChild(titleParagraph);
            todoContent.appendChild(descriptionParagraph);
            
            todoItem.appendChild(todoContent);
            
            // Create a container div for todo details (due date and priority)
            const todoDetails = document.createElement('div');
            todoDetails.innerHTML = `
                <p>Due Date: ${todo.dueDate}</p>
                <p>Priority: ${todo.priority}</p>
            `;
            
            // Create a container div for edit and delete buttons
            const buttonContainer = document.createElement('div');
            
            // Create delete and edit buttons
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteTodo(index));
            
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => editTodo(index));
            
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
            
            todoItem.appendChild(todoDetails);
            todoItem.appendChild(buttonContainer);
            
            todoList.appendChild(todoItem);
        });
    }

    // Event listener for create project button
    createProjectButton.addEventListener('click', () => {
        const projectName = prompt('Enter project name:');
        if (projectName) {
            const newProject = new Project(projectName);
            projects.push(newProject);
            renderProjects();
            saveData();
        }
    });

    // Event listener for create todo button
    createTodoButton.addEventListener('click', () => {
        todoForm.style.display = 'block'; // Show the todo form
    });

    // Event listener for submitting a new todo
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const todoTitle = todoTitleInput.value;
        const todoDescription = todoDescriptionInput.value;
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;

        if (todoTitle) {
            const newTodo = new Todo(todoTitle, todoDescription, dueDate, priority);
            todos.push(newTodo);
            renderTodos();
            saveData();

            // Clear the form fields and hide the form
            todoTitleInput.value = '';
            todoDescriptionInput.value = '';
            dueDateInput.value = '';
            prioritySelect.value = 'low';
            todoForm.style.display = 'none';
        }
    });

    function deleteProject(index) {
        // Remove the project at the given index from the projects array
        projects.splice(index, 1);
        renderProjects();
        saveData();
    }
    function editProject(index) {
        const newProjectName = prompt('Edit project name:', projects[index].name);
        if (newProjectName !== null) {
            projects[index].name = newProjectName;
            renderProjects();
            saveData();
        }
    }
    function deleteTodo(index) {
        // Remove the todo at the given index from the todos array
        todos.splice(index, 1);
        renderTodos();
        saveData();
    }
    
    function editTodo(index) {
        const editedTodo = todos[index];
        const todoForm = document.getElementById('todo-form');
        
        // Fill the form with the current todo's information
        document.getElementById('todo-title').value = editedTodo.title;
        document.getElementById('todo-description').value = editedTodo.description;
        document.getElementById('due-date').value = editedTodo.dueDate;
        document.getElementById('priority').value = editedTodo.priority;
    
        // Display the todo form
        todoForm.style.display = 'block';
    
        // Remove the current todo from the todos array
        todos.splice(index, 1);
        renderTodos();
        saveData();
    
        // Update the form's submit button to handle the edit
        const submitButton = document.getElementById('submit-todo');
        submitButton.textContent = 'Edit Todo';
        submitButton.removeEventListener('click', createTodo); // Remove the old click event
        submitButton.addEventListener('click', () => saveEditedTodoInfo(index)); // Add a new click event
    }
    
    // Function to save edited todo information
    function saveEditedTodoInfo(index) {
        const editedTodo = {
            title: document.getElementById('todo-title').value,
            description: document.getElementById('todo-description').value,
            dueDate: document.getElementById('due-date').value,
            priority: document.getElementById('priority').value,
        };
    
        // Reassign the edited todo to the same index in the todos array
        todos[index] = editedTodo;
        renderTodos();
        saveData();
    
        // Clear the form fields and hide the form
        document.getElementById('todo-title').value = '';
        document.getElementById('todo-description').value = '';
        document.getElementById('due-date').value = '';
        document.getElementById('priority').value = 'low';
        document.getElementById('submit-todo').textContent = 'Create Todo';
        document.getElementById('todo-form').style.display = 'none';
    }
   
    // Function to save data to local storage
    function saveData() {
        try {
            localStorage.setItem('projects', JSON.stringify(projects));
            localStorage.setItem('todos', JSON.stringify(todos));
        } catch (error) {
            console.error('Error saving data to local storage:', error);
        }
    }
    

    function loadData() {
        try {
            const storedProjects = JSON.parse(localStorage.getItem('projects'));
            const storedTodos = JSON.parse(localStorage.getItem('todos'));
    
            if (storedProjects) {
                projects.push(...storedProjects);
            }
    
            if (storedTodos) {
                todos.push(...storedTodos);
            }
        } catch (error) {
            console.error('Error loading data from local storage:', error);
        }
    }

    // Load data from local storage when the app starts
    loadData();
    renderProjects();
    renderTodos();
});
