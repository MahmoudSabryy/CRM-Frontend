import * as Yup from "yup";
import { baseURL, myHeaders } from "../../Environment/environment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import axios from "axios";
import { FiCheckCircle } from "react-icons/fi";
import { useContext } from "react";
import { LeadContext } from "../../Context/LeadContext/lead.context";

const LeadSource = {
  Facebook: "facebook",
  Instagram: "instagram",
  Tiktok: "tiktok",
  Twitter: "twitter",
  Website: "website",
  Referral: "referral",
  Other: "other",
};

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 chars")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  source: Yup.string()
    .oneOf(Object.values(LeadSource), "Invalid source")
    .required("Source is required"),
});

const AddLeadForm = ({ setIsDrawerOpen, onSubmit }) => {
  const { getAllLeads } = useContext(LeadContext);
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
      await axios.post(`${baseURL}/lead/create`, formData, {
        headers: myHeaders,
      });
      getAllLeads();
      reset();
      setIsDrawerOpen(false);
      onSubmit?.(formData);
      toast.success("Lead created Successfully ✔");
    } catch (error) {
      toast.error(error.response?.data?.message || "Create failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <input
        {...register("name")}
        placeholder="Enter lead name"
        className={`w-full p-3 rounded-lg border ${errors.name ? "border-red-500" : touchedFields.name ? "border-green-500" : "border-gray-300"}`}
      />
      <input
        {...register("email")}
        placeholder="Enter lead email"
        className={`w-full p-3 rounded-lg border ${errors.email ? "border-red-500" : touchedFields.email ? "border-green-500" : "border-gray-300"}`}
      />
      <input
        {...register("phone")}
        placeholder="Enter lead phone"
        className={`w-full p-3 rounded-lg border ${errors.phone ? "border-red-500" : touchedFields.phone ? "border-green-500" : "border-gray-300"}`}
      />

      <div>
        <label
          htmlFor="source"
          className="block text-sm font-medium text-gray-600"
        >
          Source
        </label>
        <div className="relative">
          <select
            {...register("source")}
            id="source"
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select source</option>
            {Object.values(LeadSource).map((src) => (
              <option key={src} value={src}>
                {src.charAt(0).toUpperCase() + src.slice(1)}
              </option>
            ))}
          </select>
          {touchedFields.source && !errors.source && (
            <FiCheckCircle
              size={18}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500"
            />
          )}
          {errors.source && (
            <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(false)}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Save Lead
        </button>
      </div>
    </form>
  );
};

export default AddLeadForm;
