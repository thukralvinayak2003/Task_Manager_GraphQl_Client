"use client";

import { useCurrentUser } from "@/hooks/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "./ui/Modal"; // Assuming Modal is in components
import CreateTaskForm from "./ui/CreateTaskForm";
import UpdateTaskForm from "./ui/UpdateTaskForm"; // Import UpdateTaskForm
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete icon from MUI
import EditIcon from "@mui/icons-material/Edit"; // Import Edit icon from MUI
import { Task, TaskDisplay } from "./lib/types"; // Assuming this is where the Task type is defined
import { useGetTask } from "@/hooks/task";
import { graphqlClient } from "@/clients/api";
import { deleteTask, updateTask } from "@/graphql/mutation/task";

export default function Home() {
  const { user, isLoading } = useCurrentUser();
  const { tasks, refetch: refetchTasks } = useGetTask();

  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false); // Track if updating
  const [currentTask, setCurrentTask] = useState<TaskDisplay | null>(null); // Store the task being updated

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsUpdateMode(false); // Reset update mode
    setCurrentTask(null); // Clear current task
  };

  const updateMyTask = async (
    id: string,
    title: string,
    description: string,
    status: string
  ) => {
    try {
      const response = await graphqlClient.request(updateTask, {
        updateTaskId: id,
        payload: {
          title,
          description,
          status,
        },
      });
      await refetchTasks();
      return response;
    } catch (error: any) {
      console.error("GraphQL Error Details:", error?.response?.errors);

      return null;
    }
    closeModal(); // Close the modal after updating
  };

  const deleteThisTask = async (id: string) => {
    try {
      const response = await graphqlClient.request(deleteTask, {
        deleteTaskId: id,
      });
      console.log(`Deleted task ${id}`, response);
    } catch (error) {
      console.error(`Failed to delete task ${id}`, error);
    }

    await refetchTasks();
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = (taskId: string) => {
    console.log(`Delete task with id: ${taskId}`);
    deleteThisTask(taskId); // Delete task logic
  };

  const handleUpdate = (task: any) => {
    console.log(`Update task with id: ${task.id}`);
    setCurrentTask(task); // Set the current task to be updated
    setIsUpdateMode(true); // Switch to update mode
    openModal(); // Open modal for update form
  };

  const handleLogout = () => {
    localStorage.removeItem("googleToken"); // Remove the googleToken
    router.push("/signin"); // Redirect to signin
  };

  console.log(tasks);
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
              setIsUpdateMode(false); // Ensure it's in create mode
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
                initialTaskData={currentTask} // Pass the current task to be updated
                onUpdate={updateMyTask} // Pass the update function
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
