import React, { useContext } from "react";
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

const AddContactForm = ({ onSubmit }) => {
  const { getAllContacts } = useContext(ContactContext);
  // إعداد useForm مع التحقق من الصحة باستخدام Yup
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
      // إرسال البيانات إلى الخادم عبر API
      await axios.post(`${baseURL}/contact/create`, formData, {
        headers: myHeaders,
      });
      reset(); // إعادة تعيين النموذج بعد الإرسال
      onSubmit(formData); // استدعاء الدالة onSubmit التي تم تمريرها من المكون الأب
      getAllContacts(); // تحديث قائمة جهات الاتصال بعد الإضافة
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
          className="block text-sm font-medium text-gray-600"
        >
          Name
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Enter contact name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600"
        >
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Enter contact email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-600"
        >
          Phone
        </label>
        <input
          {...register("phone")}
          type="tel"
          id="phone"
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Enter contact phone"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone.message}</p>
        )}
      </div>

      {/* Company Field */}
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-gray-600"
        >
          Company
        </label>
        <input
          {...register("company")}
          type="text"
          id="company"
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Enter company name"
        />
        {errors.company && (
          <p className="text-red-500 text-xs">{errors.company.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => reset()}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
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
