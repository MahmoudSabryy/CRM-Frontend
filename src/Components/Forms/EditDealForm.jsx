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
      if (!selectedDealId) {
        return toast.error("please select deal first");
      }

      await axios.post(`${baseURL}/deal/update/${selectedDealId}`, formData, {
        headers: myHeaders,
      });

      getAllContacts();
      setIsEditDealModalOpen(false);
      reset();
      onSubmit(formData);
      toast.success(`Deal updated Successfully ✔`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Deal Title */}
      <div className="relative">
        <input
          {...register("title")}
          className={`w-full rounded-lg border p-3 pr-10 ${
            errors.title
              ? "border-red-500"
              : touchedFields.title
                ? "border-green-500"
                : "border-gray-300"
          }`}
          placeholder="Enter deal title"
        />
      </div>

      {/* status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-600"
        >
          status
        </label>
        <div className="relative">
          <select
            {...register("status", { required: "status is required" })}
            id="status"
            className="w-full appearance-none rounded-lg border border-gray-300 p-3 focus:border-purple-500 focus:outline-none"
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

          {/* ✔️ علامة الصح */}
          {touchedFields.status && !errors.status && (
            <FiCheckCircle
              size={18}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500"
            />
          )}
          {errors?.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Deal Value */}
      <div className="relative">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-600"
        >
          Deal Value
        </label>

        <input
          {...register("amount", {
            required: "Value is required",
            min: {
              value: 1,
              message: "Value must be greater than 0",
            },
            valueAsNumber: true,
          })}
          type="number"
          id="amount"
          className={`w-full rounded-lg border p-3 pr-10 focus:outline-none ${
            errors.amount
              ? "border-red-500"
              : touchedFields.amount
                ? "border-green-500"
                : "border-gray-300 focus:border-purple-500"
          }`}
          placeholder="Enter deal value"
        />

        {/* ✔️ علامة الصح */}
        {touchedFields.amount && !errors.amount && (
          <FiCheckCircle
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
          />
        )}

        {/* ❌ Error */}
        {errors?.amount && (
          <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      {/* Deal probability */}
      <div className="relative">
        <label
          htmlFor="probability"
          className="block text-sm font-medium text-gray-600"
        >
          Deal Probability %
        </label>

        <input
          {...register("probability", {
            required: "probability value is required",
            min: {
              value: 1,
              message: "Value must be greater than 0",
            },
            max: {
              value: 100,
              message: "Value must be at most 100",
            },
            valueAsNumber: true,
          })}
          type="number"
          id="probability"
          className={`w-full rounded-lg border p-3 pr-10 focus:outline-none ${
            errors.probability
              ? "border-red-500"
              : touchedFields.probability
                ? "border-green-500"
                : "border-gray-300 focus:border-purple-500"
          }`}
          placeholder="Enter deal value"
        />

        {/* ✔️ علامة الصح */}
        {touchedFields.probability && !errors.probability && (
          <FiCheckCircle
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
          />
        )}

        {/* ❌ Error */}
        {errors?.probability && (
          <p className="mt-1 text-sm text-red-500">
            {errors.probability.message}
          </p>
        )}
      </div>

      {/* Deal Date */}
      <div>
        <label
          htmlFor="expectedCloseDate"
          className="block text-sm font-medium text-gray-600"
        >
          Deal Date
        </label>
        <input
          {...register("expectedCloseDate", {
            required: "Date is required",
            min: {
              value: today,
              message: "Date Can't be less before today",
            },
          })}
          defaultValue={today}
          type="date"
          id="expectedCloseDate"
          className={`w-full rounded-lg border p-3 pr-10 focus:outline-none ${
            errors.amount
              ? "border-red-500"
              : touchedFields.amount
                ? "border-green-500"
                : "border-gray-300 focus:border-purple-500"
          }`}
        />

        {/* ✔️ علامة الصح */}
        {touchedFields.expectedCloseDate && !errors.expectedCloseDate && (
          <FiCheckCircle
            size={18}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500"
          />
        )}
        {errors?.expectedCloseDate && (
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
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
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
