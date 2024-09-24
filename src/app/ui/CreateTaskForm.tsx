"use client";

import { useState } from "react";
import { graphqlClient } from "@/clients/api";
import { createTask } from "@/graphql/mutation/task";
import { useGetTask } from "@/hooks/task";

interface CreateTaskFormProps {
  onSuccess: () => void;
}

function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const { refetch: refetchTasks } = useGetTask();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO", // Default status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null); // Track errors

  const createThisTask = async (
    title: string,
    description: string,
    status: string
  ) => {
    try {
      const response = await graphqlClient.request(createTask, {
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
      setError(
        error?.response?.errors?.[0]?.message || "Unknown error occurred"
      );
      return null;
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { title, description, status } = formData;

    const response = await createThisTask(title, description, status);

    if (response) {
      console.log("Task created successfully:", response);
      setFormData({ title: "", description: "", status: "TODO" }); // Reset form data
      onSuccess(); // Call the callback to close the modal
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        {/* Task Title */}
        <label
          htmlFor="task_title"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Task Title
        </label>
        <input
          type="text"
          id="task_title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
          placeholder="Task Title"
          required
        />

        {/* Task Description */}
        <label
          htmlFor="task_description"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Task Description
        </label>
        <input
          type="text"
          id="task_description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
          placeholder="Task Description"
        />

        {/* Task Status */}
        <label
          htmlFor="status"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Task Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        {/* Submit Button */}
        <input
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6"
          disabled={isSubmitting} // Disable the button during submission
          value={isSubmitting ? "Submitting..." : "Create Task"}
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mt-3 text-sm">
            Error creating task: {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default CreateTaskForm;
