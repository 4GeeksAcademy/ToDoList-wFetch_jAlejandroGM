import React, { useState, useEffect } from "react";
import { getTodos, createTodo, deleteTodo, deleteAllTodos } from "./utilities";

const Home = () => {

	const [inputValue, setInputValue] = useState("")
	const [todos, setTodos] = useState([])
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadTodos = async () => {
			const todosList = await getTodos();
			if (!todosList) {
				setError("Error loading todos");
				return;
			}
			setTodos(todosList);
		};
		loadTodos();
	}, []);

	const handleAddTodo = async () => {
		if (inputValue.trim() !== "") {
			const previousTodos = todos;
			const newTodo = { label: inputValue, done: false };
			setTodos(prevTodos => [...prevTodos, newTodo]);
			setInputValue("");
			const updatedTodos = await createTodo(inputValue);
			if (!updatedTodos) {
				setTodos(previousTodos);
				setError("Error creating todo");
				return;
			}
			setError(null);
			setTodos(updatedTodos);
		}
	};

	const handleDeleteTodo = async (id) => {
		const previousTodos = todos;
		setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
		const updatedTodos = await deleteTodo(id);
		if (!updatedTodos) {
			setTodos(previousTodos);
			setError("Error deleting todo");
			return;
		}
		setError(null);
		setTodos(updatedTodos);
	};

	const handleDeleteAll = async () => {
		const previousTodos = todos;
		setTodos([]);
		const updatedTodos = await deleteAllTodos();
		if (!updatedTodos) {
			setTodos(previousTodos);
			setError("Error deleting all todos");
			return;
		}
		setError(null);
		setTodos(updatedTodos);
	};

	return (
		<div className="container">
			<h1>todos</h1>
			{error && <div className="error">{error}</div>}
			<ul>
				<input
					type="text"
					placeholder={todos.length === 0 ? "Add something to the list" : "What else do you need to do?"}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleAddTodo();
						}
					}}
				/>
				{todos.map((task, index) => (
					<li key={index}>
						{task.label}
						<i
							className="fa-solid fa-xmark"
							onClick={() => handleDeleteTodo(task.id)}
						/>
					</li>
				))}
			</ul>
			<div className="footer">
				<div className="task-count">{todos.length} {todos.length !== 1 ? "items left" : "item left"}</div>
				{todos.length > 0 && (
					<button onClick={handleDeleteAll}>Clear all</button>
				)}
			</div>
		</div>
	);
};

export default Home;