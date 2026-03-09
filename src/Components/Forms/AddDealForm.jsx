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
  title: Yup.string()
    .min(3, "Title must be at least 3 chars")
    .required("Title is required"),

  stage: Yup.string().required("Stage is required"),

  status: Yup.string().required("Status is required"),

  amount: Yup.number()
    .typeError("Value must be a number")
    .min(1, "Value must be at least 1")
    .required("Value is required"),

  probability: Yup.number()
    .typeError("Probability must be a number")
    .min(1, "Probability must be at least 1")
    .max(100, "Probability must be at most 100")
    .required("Probability is required"),

  expectedCloseDate: Yup.date()
    .min(today, "Date can't be before today")
    .required("Date is required"),
});

const AddDealForm = ({ setIsDrawerOpen, onSubmit }) => {
  const { contacts } = useContext(ContactContext);
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
      if (!formData.contactId) {
        return toast.error("please select contact first");
      }

      const payload = {
        title: formData.title,
        stage: formData.stage,
        status: formData.status,
        amount: formData.amount,
        probability: formData.probability,
        expectedCloseDate: formData.expectedCloseDate,
      };
      await axios.post(
        `${baseURL}/deal/create/${formData.contactId}`,
        payload,
        {
          headers: myHeaders,
        },
      );

      setIsDrawerOpen(false);
      reset();
      onSubmit(formData);
      toast.success(`Deal created Successfully ✔`);
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
          placeholder="Enter deal title"
          className={`w-full rounded-lg border p-3 pr-10 
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        ${errors.title ? "border-red-500" : touchedFields.title ? "border-green-500" : "border-gray-300 dark:border-gray-600"}
      `}
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

      {/* Contact */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
          Contact
        </label>
        <div className="relative">
          <select
            {...register("contactId", { required: "Contact is required" })}
            className="w-full appearance-none rounded-lg border p-3 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          border-gray-300 dark:border-gray-600 focus:outline-none focus:border-purple-500"
          >
            <option value="">Select contact</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name} - {contact.email} - {contact.phone}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            ▼
          </div>
          {touchedFields.contactId && !errors.contactId && (
            <FiCheckCircle
              className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500"
              size={18}
            />
          )}
          {errors.contactId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.contactId.message}
            </p>
          )}
        </div>
      </div>

      {/* Stage */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
          Stage
        </label>
        <div className="relative">
          <select
            {...register("stage", { required: "Stage is required" })}
            className="w-full appearance-none rounded-lg border p-3 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          border-gray-300 dark:border-gray-600 focus:outline-none focus:border-purple-500"
          >
            <option value="">Select stage</option>
            <option value="prospecting">Prospecting</option>
            <option value="qualification">Qualification</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            ▼
          </div>
          {touchedFields.stage && !errors.stage && (
            <FiCheckCircle
              className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500"
              size={18}
            />
          )}
          {errors.stage && (
            <p className="mt-1 text-sm text-red-500">{errors.stage.message}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-200">
          Status
        </label>
        <div className="relative">
          <select
            {...register("status", { required: "Status is required" })}
            className="w-full appearance-none rounded-lg border p-3 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          border-gray-300 dark:border-gray-600 focus:outline-none focus:border-purple-500"
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
            required: "Value is required",
            min: 1,
          })}
          type="number"
          placeholder="Enter deal value"
          className={`w-full rounded-lg border p-3 pr-10 
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        ${errors.amount ? "border-red-500" : touchedFields.amount ? "border-green-500" : "border-gray-300 dark:border-gray-600 focus:border-purple-500"}
      `}
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

      {/* Probability */}
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
          placeholder="Enter probability"
          className={`w-full rounded-lg border p-3 pr-10
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        ${errors.probability ? "border-red-500" : touchedFields.probability ? "border-green-500" : "border-gray-300 dark:border-gray-600 focus:border-purple-500"}
      `}
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
          className={`w-full rounded-lg border p-3 pr-10
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
        ${errors.expectedCloseDate ? "border-red-500" : touchedFields.expectedCloseDate ? "border-green-500" : "border-gray-300 dark:border-gray-600 focus:border-purple-500"}
      `}
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
          onClick={() => setIsDrawerOpen(false)}
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
export default AddDealForm;
