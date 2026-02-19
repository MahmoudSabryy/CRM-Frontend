import * as Yup from "yup";
import { baseURL, myHeaders } from "../../Environment/environment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LeadContext } from "../../Context/LeadContext/lead.context";
import { FiCheckCircle } from "react-icons/fi";

const EditLeadForm = ({ setIsDrawerOpen, selectedLead, onSubmit }) => {
  const { getAllLeads } = useContext(LeadContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(
      Yup.object({
        name: Yup.string(),
        email: Yup.string().email("Invalid email"),
        phone: Yup.string(),
        source: Yup.string(),
      }),
    ),
  });

  // تعبئة القيم الافتراضية
  useEffect(() => {
    if (selectedLead) {
      reset({
        name: selectedLead.name,
        email: selectedLead.email,
        phone: selectedLead.phone,
        source: selectedLead.source,
      });
    }
  }, [selectedLead, reset]);

  const handleFormSubmit = async (formData) => {
    try {
      const payload = {};
      if (formData.name) payload.name = formData.name;
      if (formData.email) payload.email = formData.email;
      if (formData.phone) payload.phone = formData.phone;
      if (formData.source) payload.source = formData.source;

      await axios.put(`${baseURL}/lead/update/${selectedLead.id}`, payload, {
        headers: myHeaders,
      });

      getAllLeads();
      setIsDrawerOpen(false);
      onSubmit?.(formData);
      toast.success("Lead updated Successfully ✔");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <input
        {...register("name")}
        placeholder="Enter lead name"
        className={`w-full p-3 rounded-lg border ${
          errors.name
            ? "border-red-500"
            : touchedFields.name
              ? "border-green-500"
              : "border-gray-300"
        }`}
      />

      {/* Email */}
      <input
        {...register("email")}
        placeholder="Enter lead email"
        className={`w-full p-3 rounded-lg border ${
          errors.email
            ? "border-red-500"
            : touchedFields.email
              ? "border-green-500"
              : "border-gray-300"
        }`}
      />

      {/* Phone */}
      <input
        {...register("phone")}
        placeholder="Enter lead phone"
        className={`w-full p-3 rounded-lg border ${
          errors.phone
            ? "border-red-500"
            : touchedFields.phone
              ? "border-green-500"
              : "border-gray-300"
        }`}
      />

      {/* Source */}
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
            className={`w-full rounded-lg border p-3 ${
              errors.source
                ? "border-red-500"
                : touchedFields.source
                  ? "border-green-500"
                  : "border-gray-300"
            }`}
          >
            <option value="">Select source</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter">Twitter</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>

          {/* علامة ✔ */}
          {touchedFields.source && !errors.source && selectedLead?.source && (
            <FiCheckCircle
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            />
          )}
        </div>
      </div>

      {/* Actions */}
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

export default EditLeadForm;
