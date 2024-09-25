"use client";

import { useState, useEffect } from "react";
import { TaskDisplay } from "../lib/types"; // Import the Task type
import { useUpdateTask } from "@/hooks/task";

interface UpdateTaskFormProps {
  initialTaskData: TaskDisplay;
  onSuccess: () => void;
}

function UpdateTaskForm({ initialTaskData, onSuccess }: UpdateTaskFormProps) {
  const { updateTask } = useUpdateTask();
  const [formData, setFormData] = useState<TaskDisplay>(initialTaskData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This effect will populate the form with the initial task data when it is received
  useEffect(() => {
    setFormData(initialTaskData);
  }, [initialTaskData]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Call the onUpdate function passed via props to handle task update

    updateTask({
      id: initialTaskData.id,
      payload: {
        title: formData.title,
        description: formData.description,
        status: formData.status,
      },
    });

    onSuccess();
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
          required
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
        />
      </form>
    </div>
  );
}

export default UpdateTaskForm;
function onSuccess() {
  throw new Error("Function not implemented.");
}
