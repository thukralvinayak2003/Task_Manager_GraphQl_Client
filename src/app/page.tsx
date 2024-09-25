"use client";

import { useCurrentUser } from "@/hooks/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "./ui/Modal";
import CreateTaskForm from "./ui/CreateTaskForm";
import UpdateTaskForm from "./ui/UpdateTaskForm"; // Import UpdateTaskForm
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete icon from MUI
import EditIcon from "@mui/icons-material/Edit"; // Import Edit icon from MUI
import { Task, TaskDisplay } from "./lib/types"; // Assuming this is where the Task type is defined
import { useGetTask, useUpdateTask } from "@/hooks/task";
import { useDeleteTask } from "../hooks/task"; // Import the useDeleteTask hook
import { graphqlClient } from "@/clients/api";
import { updateTask } from "@/graphql/mutation/task";

export default function Home() {
  const { user, isLoading } = useCurrentUser();
  const { tasks, refetch: refetchTasks } = useGetTask();
  const { deleteTask, isDeletePending } = useDeleteTask(); // Use the deleteTask mutation
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskDisplay | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdateMode(false);
    setCurrentTask(null);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async (taskId: string) => {
    console.log(`Delete task with id: ${taskId}`);
    try {
      deleteTask(taskId); // Trigger the delete mutation
    } catch (error) {
      console.error(`Failed to delete task ${taskId}`, error);
    }
  };

  const handleUpdate = (task: any) => {
    console.log(`Update task with id: ${task.id}`);
    setCurrentTask(task);
    setIsUpdateMode(true);
    openModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("googleToken");
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Task Manager</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Task Creation Button */}
        <div className="text-center mb-6">
          <button
            onClick={() => {
              setIsUpdateMode(false);
              openModal();
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Create Task
          </button>
        </div>

        {/* Task List */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Tasks
          </h2>
          <ul className="space-y-4">
            {tasks &&
              tasks.map((task) => (
                <li
                  key={task!.id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {task!.title}
                    </h3>
                    <p className="text-gray-600">
                      Description: {task!.description}
                    </p>
                    <p className="text-gray-600">Status: {task!.status}</p>
                  </div>
                  <div className="flex space-x-4">
                    {/* Update Button */}
                    <button
                      onClick={() => handleUpdate(task)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <EditIcon />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(task!.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isDeletePending} // Optionally disable the button while pending
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Modal for Task Creation/Update */}
        {isModalOpen && (
          <Modal onClose={closeModal}>
            {isUpdateMode && currentTask ? (
              <UpdateTaskForm
                initialTaskData={currentTask}
                onSuccess={closeModal}
              />
            ) : (
              <CreateTaskForm onSuccess={closeModal} />
            )}
          </Modal>
        )}
      </div>
    </div>
  );
}
