import { useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import { baseURL, myHeaders } from "../../Environment/environment";
import { ContactContext } from "../../Context/ContactContext/contact.context";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/, "Invalid phone number")
    .required("Phone is required"),
  company: Yup.string().required("Company is required"),
});

const AddContactForm = ({ onSubmit, setIsAddDrawerOpen }) => {
  const { getAllContacts } = useContext(ContactContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = async (formData) => {
    try {
      await axios.post(`${baseURL}/contact/create`, formData, {
        headers: myHeaders,
      });
      reset();
      onSubmit(formData);
      getAllContacts();
      setIsAddDrawerOpen(false);
      toast.success("Contact added successfully ✔");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding contact");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-600 dark:text-gray-200"
        >
          Name
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          placeholder="Enter contact name"
          className="w-full p-3 border rounded-lg 
                 border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600 dark:text-gray-200"
        >
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          placeholder="Enter contact email"
          className="w-full p-3 border rounded-lg 
                 border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-600 dark:text-gray-200"
        >
          Phone
        </label>
        <input
          {...register("phone")}
          type="tel"
          id="phone"
          placeholder="Enter contact phone"
          className="w-full p-3 border rounded-lg 
                 border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Company Field */}
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-gray-600 dark:text-gray-200"
        >
          Company
        </label>
        <input
          {...register("company")}
          type="text"
          id="company"
          placeholder="Enter company name"
          className="w-full p-3 border rounded-lg 
                 border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100
                 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {errors.company && (
          <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setIsAddDrawerOpen(false)}
          className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Save Contact
        </button>
      </div>
    </form>
  );
};

export default AddContactForm;
