import * as Yup from "yup";
import { baseURL, myHeaders, today } from "../../Environment/environment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { ContactContext } from "../../Context/ContactContext/contact.context";
import axios from "axios";
import { FiCheckCircle } from "react-icons/fi";
import { useContext } from "react";

const validationSchema = Yup.object({
  title: Yup.string().min(3, "Title must be at least 3 chars"),
  status: Yup.string(),
  amount: Yup.number()
    .typeError("Value must be a number")
    .min(1, "Value must be at least 1"),
  probability: Yup.number()
    .typeError("Probability must be a number")
    .min(1, "Probability must be at least 1")
    .max(100, "Probability must be at most 100"),
  expectedCloseDate: Yup.date().min(
    new Date(today),
    "Date can't be before today",
  ),
});

const EditDealForm = ({ selectedDealId, setIsEditDealModalOpen, onSubmit }) => {
  const { getAllContacts } = useContext(ContactContext);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = async (formData) => {
    try {
      if (!selectedDealId) return toast.error("Please select deal first");

      await axios.post(`${baseURL}/deal/update/${selectedDealId}`, formData, {
        headers: myHeaders,
      });

      getAllContacts();
      setIsEditDealModalOpen(false);
      reset();
      onSubmit(formData);
      toast.success("Deal updated successfully ✔");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const inputClasses = (field) =>
    `w-full rounded-lg border p-3 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${
      errors[field]
        ? "border-red-500"
        : touchedFields[field]
          ? "border-green-500"
          : "border-gray-300 dark:border-gray-600 focus:border-purple-500"
    }`;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Deal Title */}
      <div className="relative">
        <input
          {...register("title")}
          placeholder="Enter deal title"
          className={inputClasses("title")}
        />
        {touchedFields.title && !errors.title && (
          <FiCheckCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
        )}
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
          Status
        </label>
        <div className="relative">
          <select
            {...register("status")}
            className={`w-full appearance-none rounded-lg border p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-purple-500`}
          >
            <option value="">Select Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="on_Hold">On-Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            ▼
          </div>
          {touchedFields.status && !errors.status && (
            <FiCheckCircle
              className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500"
              size={18}
            />
          )}
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Deal Value */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
          Deal Value
        </label>
        <input
          {...register("amount", {
            valueAsNumber: true,
            required: true,
            min: 1,
          })}
          type="number"
          placeholder="Enter deal value"
          className={inputClasses("amount")}
        />
        {touchedFields.amount && !errors.amount && (
          <FiCheckCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
        )}
        {errors.amount && (
          <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      {/* Deal Probability */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
          Deal Probability %
        </label>
        <input
          {...register("probability", {
            valueAsNumber: true,
            required: true,
            min: 1,
            max: 100,
          })}
          type="number"
          placeholder="Enter deal probability"
          className={inputClasses("probability")}
        />
        {touchedFields.probability && !errors.probability && (
          <FiCheckCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
        )}
        {errors.probability && (
          <p className="mt-1 text-sm text-red-500">
            {errors.probability.message}
          </p>
        )}
      </div>

      {/* Deal Date */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
          Deal Date
        </label>
        <input
          {...register("expectedCloseDate", { required: true, min: today })}
          type="date"
          defaultValue={today}
          className={inputClasses("expectedCloseDate")}
        />
        {touchedFields.expectedCloseDate && !errors.expectedCloseDate && (
          <FiCheckCircle
            className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
        )}
        {errors.expectedCloseDate && (
          <p className="mt-1 text-sm text-red-500">
            {errors.expectedCloseDate.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => setIsEditDealModalOpen(false)}
          className="rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Save Deal
        </button>
      </div>
    </form>
  );
};

export default EditDealForm;
