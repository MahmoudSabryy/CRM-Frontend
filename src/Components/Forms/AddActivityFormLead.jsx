import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { baseURL, myHeaders, today } from "../../Environment/environment";
import axios from "axios";
const validationSchema = Yup.object({
  type: Yup.string().required("Activity type is required"),
  note: Yup.string().required("Activity note is required"),
  activityDate: Yup.date()
    .min(today, "Date field must be from today")
    .required("Activity Date is required"),
});

const AddActivityFormLead = ({
  setIsAddActivityOpen,
  setSelectedLeadId,
  selectedLeadId,
  onSubmit,
  getSingleLead,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const handleFormSubmit = async (formData) => {
    try {
      await axios.post(`${baseURL}/activity/lead/${selectedLeadId}`, formData, {
        headers: myHeaders,
      });
      setSelectedLeadId(null);
      setIsAddActivityOpen(false);
      reset();
      onSubmit(formData);
      getSingleLead(selectedLeadId);
      toast.success("Activity added successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="mb-4">
        <label
          htmlFor="type"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Activity Type
        </label>

        <div className="relative">
          <select
            id="type"
            {...register("type")}
            className={`w-full appearance-none rounded-md border px-3 py-2 text-sm
          ${errors.type ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">Select activity</option>
            <option value="call">📞 Call</option>
            <option value="email">✉️ Email</option>
            <option value="meeting">📅 Meeting</option>
            <option value="follow-up">🔁 Follow up</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            ▼
          </div>
        </div>
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="note"
          className="block text-sm font-medium text-gray-600"
        >
          Note
        </label>
        <textarea
          id="note"
          {...register("note")}
          className={`w-full p-3 border rounded-lg ${errors.note ? "border-red-500" : "border-gray-300"}`}
          placeholder="Enter activity description"
        />
        {errors.note && (
          <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="activityDate"
          className="block text-sm font-medium text-gray-600"
        >
          Date
        </label>
        <input
          type="date"
          id="activityDate"
          {...register("activityDate")}
          defaultValue={today}
          className={`w-full p-3 border rounded-lg ${errors.activityDate ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.activityDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.activityDate.message}
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setIsAddActivityOpen(false)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Save Activity
        </button>
      </div>
    </form>
  );
};
export default AddActivityFormLead;
