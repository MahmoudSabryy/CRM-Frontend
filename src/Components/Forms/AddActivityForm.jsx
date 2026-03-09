import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { ContactContext } from "../../Context/ContactContext/contact.context";
import { LeadContext } from "../../Context/LeadContext/lead.context";
import { useContext } from "react";
import toast from "react-hot-toast";
import { baseURL, myHeaders, today } from "../../Environment/environment";
import axios from "axios";

const validationSchema = Yup.object({
  type: Yup.string().required("Activity type is required"),
  note: Yup.string().required("Activity note is required"),
  activityDate: Yup.date()
    .min(today, "Date field must be from today")
    .required("Activity Date is required"),

  activityFor: Yup.string().required("Please choose Contact or Lead"),

  contactId: Yup.string().when("activityFor", {
    is: "contact",
    then: (schema) => schema.required("Contact is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  leadId: Yup.string().when("activityFor", {
    is: "lead",
    then: (schema) => schema.required("Lead is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});

const AddActivityDrawer = ({
  isAddActivityDrawer,
  setIsAddActivityDrawer,
  onSubmit,
}) => {
  const { contacts, getAllContacts } = useContext(ContactContext);
  const { leads, getAllLeads } = useContext(LeadContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const activityFor = watch("activityFor");

  const handleFormSubmit = async (formData) => {
    try {
      let url = "";

      if (formData.activityFor === "contact") {
        url = `${baseURL}/activity/contact/${formData.contactId}`;
      } else {
        url = `${baseURL}/activity/lead/${formData.leadId}`;
      }

      const payload = {};
      payload.type = formData.type;
      payload.note = formData.note;
      payload.activityDate = formData.activityDate;

      await axios.post(url, payload, {
        headers: myHeaders,
      });

      getAllContacts();
      getAllLeads();

      reset();
      onSubmit(formData);

      toast.success("Activity added successfully");
      setIsAddActivityDrawer(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform ${
        isAddActivityDrawer ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add Activity
          </h2>
          <button
            onClick={() => setIsAddActivityDrawer(false)}
            className="text-gray-500 dark:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 flex flex-col"
        >
          {/* Activity Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Activity Type
            </label>
            <select
              {...register("type")}
              className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
            >
              <option value="">Select activity</option>
              <option value="call">📞 Call</option>
              <option value="email">✉️ Email</option>
              <option value="meeting">📅 Meeting</option>
              <option value="follow-up">🔁 Follow up</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          {/* Activity For */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Activity For
            </label>
            <div className="flex gap-4 text-gray-900 dark:text-gray-100">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="contact"
                  {...register("activityFor")}
                />
                Contact
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="lead" {...register("activityFor")} />
                Lead
              </label>
            </div>
            {errors.activityFor && (
              <p className="text-red-500 text-sm">
                {errors.activityFor.message}
              </p>
            )}
          </div>

          {/* Contact Dropdown */}
          {activityFor === "contact" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Select Contact
              </label>
              <select
                {...register("contactId")}
                className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
              >
                <option value="">Choose contact</option>
                {contacts?.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} ({contact.phone})
                  </option>
                ))}
              </select>
              {errors.contactId && (
                <p className="text-red-500 text-sm">
                  {errors.contactId.message}
                </p>
              )}
            </div>
          )}

          {/* Lead Dropdown */}
          {activityFor === "lead" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                Select Lead
              </label>
              <select
                {...register("leadId")}
                className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
              >
                <option value="">Choose lead</option>
                {leads?.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} ({lead.phone})
                  </option>
                ))}
              </select>
              {errors.leadId && (
                <p className="text-red-500 text-sm">{errors.leadId.message}</p>
              )}
            </div>
          )}

          {/* Note */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Note
            </label>
            <textarea
              {...register("note")}
              className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
            />
            {errors.note && (
              <p className="text-red-500 text-sm">{errors.note.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Date
            </label>
            <input
              type="date"
              {...register("activityDate")}
              defaultValue={today}
              className="w-full border p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
            />
            {errors.activityDate && (
              <p className="text-red-500 text-sm">
                {errors.activityDate.message}
              </p>
            )}
          </div>

          <div className="flex justify-between mt-auto">
            <button
              type="button"
              onClick={() => setIsAddActivityDrawer(false)}
              className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityDrawer;
