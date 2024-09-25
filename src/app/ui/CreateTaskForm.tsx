"use client";

import { useState } from "react";
import { useCreateTask } from "@/hooks/task";

interface CreateTaskFormProps {
  onSuccess: () => void;
}

function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const { createTask, isLoading, error } = useCreateTask(); // Use createTask from the hook
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO", // Default status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const { title, description, status } = formData;

    // Use the createTask function from the hook
    createTask({
      title,
      description,
      status,
    });

    setFormData({ title: "", description: "", status: "TODO" }); // Reset form data
    onSuccess(); // Call the callback to close the modal

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
          disabled={isSubmitting || isLoading} // Disable the button during submission or loading
          value={isSubmitting || isLoading ? "Submitting..." : "Create Task"}
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-500 mt-3 text-sm">
            Error creating task: {error.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default CreateTaskForm;
