import { useState, useEffect } from "react";
import { readDocuments } from "../db/db";
import { ITask } from "../models/interface";
import TaskItem from "../components/TaskItem";
import Button from "../components/Button";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search";
import Select from "../components/Select";

const Task = () => {
	const [tasks, setTasks] = useState<ITask[]>([]);

	const navigate = useNavigate();

	const getTasks = async () => {
		const { documents } = await readDocuments();
		console.log("ALL TASKS", documents);

		return documents as ITask[];
	};

	const handleSelectChange = (
		e: React.ChangeEventHandler<HTMLSelectElement>
	) => {
		e.preventDefault();

		const pendingTasks = tasks.filter((task) => !task.done);

		switch (e.target.value) {
			case "priority - (low - high)":
				setTasks([
					...tasks.filter((task) => task.done),
					...pendingTasks.sort(
						(a, b) =>
							mapPriorityToValue(a.priority) - mapPriorityToValue(b.priority)
					),
				]);
				break;
			case "priority - (high - low)":
				setTasks([
					...tasks.filter((task) => task.done),
					...pendingTasks.sort(
						(a, b) =>
							mapPriorityToValue(b.priority) - mapPriorityToValue(a.priority)
					),
				]);
				break;
			case "due date - (earliest - latest)":
				setTasks([
					...tasks.filter((task) => task.done),
					...pendingTasks.sort(
						(a, b) =>
							new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
					),
				]);
				break;
			case "due date - (latest - earliest)":
				setTasks([
					...tasks.filter((task) => task.done),
					...pendingTasks.sort(
						(a, b) =>
							new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
					),
				]);
				break;
			default:
				break;
		}
	};

	const mapPriorityToValue = (priority: string | undefined): number => {
		const priorityValues: { [key: string]: number } = {
			low: 0,
			medium: 1,
			high: 2,
		};

		return priorityValues[priority || ""] || 0;
	};

	const selectArray = [
		"priority - (low - high)",
		"priority - (high - low)",
		"due date - (earliest - latest)",
		"due date - (latest - earliest)",
	];

	useEffect(() => {
		getTasks()
			.then((res) => {
				setTasks(res.reverse());
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<main className="container mx-auto">
			<section className="max-w-7xl mx-auto m-12 p-0 md:p-16">
				<h1 className="text-3xl md:text-6xl font-bold text-center py-3">
					Your Tasks
				</h1>
				<div className="m-8 flex justify-between items-center">
					<Search tasks={tasks} />
					<Button
						bgColor="bg-pink-700 text-white font-medium py-2 hover:bg-pink-800"
						text="Add Task"
						icon={PlusIcon}
						iconClasses="hidden md:flex "
						handleClick={(e) => {
							e.preventDefault();
							navigate("/");
						}}
					/>
				</div>
				<div className="flex flex-col md:flex-row justify-between">
					<div className="flex-1">
						<h3 className="text-2xl font-bold m-8">Pending Tasks</h3>
						<div className="m-8 flex gap-2 items-center">
							<p>Sort tasks by: </p>
							<div className="w-4/6">
								<Select
									defaultSelectValue={selectArray[0]}
									handleSelectChange={handleSelectChange}
									selectOptions={selectArray}
								/>
							</div>
						</div>
						{tasks.map((task: ITask) => {
							if (!task.done) {
								return <TaskItem key={task.$id} task={task} />;
							}
						})}
					</div>
					<div className="flex-1">
						<h3 className="text-2xl font-bold m-8">Completed Tasks</h3>
						{tasks.map((task: ITask) => {
							if (task.done === true) {
								return <TaskItem key={task.$id} task={task} />;
							}
						})}
					</div>
				</div>
			</section>
		</main>
	);
};

export default Task;