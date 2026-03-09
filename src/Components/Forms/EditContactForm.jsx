import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL, myHeaders } from "../../Environment/environment";
import { useContext } from "react";
import { ContactContext } from "../../Context/ContactContext/contact.context";
import { FiCheckCircle } from "react-icons/fi";

const validationSchema = Yup.object({
  name: Yup.string(),
  email: Yup.string().email("Invalid email format"),
  phone: Yup.string(),
  company: Yup.string(),
});

const EditContactForm = ({
  selectedContactId,
  setIsEditDrawerOpen,
  onsubmit,
}) => {
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
      if (!selectedContactId)
        return toast.error("Please select a contact first");

      const payload = {};
      if (formData.name) payload.name = formData.name;
      if (formData.email) payload.email = formData.email;
      if (formData.phone) payload.phone = formData.phone;
      if (formData.company) payload.company = formData.company;

      await axios.put(
        `${baseURL}/contact/update/${selectedContactId}`,
        payload,
        { headers: myHeaders },
      );
      getAllContacts();
      reset();
      onsubmit(formData);
      setIsEditDrawerOpen(false);
      toast.success("Contact updated successfully ✔");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const inputClasses = (field) =>
    `w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${
      errors[field]
        ? "border-red-500"
        : touchedFields[field]
          ? "border-green-500"
          : "border-gray-300 dark:border-gray-600 focus:border-purple-500"
    }`;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="relative">
        <input
          {...register("name")}
          type="text"
          placeholder="Enter contact name"
          className={inputClasses("name")}
        />
        {touchedFields.name && !errors.name && (
          <FiCheckCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
        )}
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="relative">
        <input
          {...register("email")}
          type="email"
          placeholder="Enter contact email"
          className={inputClasses("email")}
        />
        {touchedFields.email && !errors.email && (
          <FiCheckCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
        )}
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="relative">
        <input
          {...register("phone")}
          type="tel"
          placeholder="Enter contact phone"
          className={inputClasses("phone")}
        />
        {touchedFields.phone && !errors.phone && (
          <FiCheckCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
        )}
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Company */}
      <div className="relative">
        <input
          {...register("company")}
          type="text"
          placeholder="Enter company name"
          className={inputClasses("company")}
        />
        {touchedFields.company && !errors.company && (
          <FiCheckCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
            size={18}
          />
        )}
        {errors.company && (
          <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            reset();
            setIsEditDrawerOpen(false);
          }}
          className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditContactForm;
