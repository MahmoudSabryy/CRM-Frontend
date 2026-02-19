import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL, myHeaders } from "../../Environment/environment";
import { useContext } from "react";
import { ContactContext } from "../../Context/ContactContext/contact.context";

const validationSchema = Yup.object({
  name: Yup.string(),
  email: Yup.string().email("Invalid email format"),
  phone: Yup.string(),
  company: Yup.string(),
}).required();

const EditContactForm = ({
  selectedContactId,
  setIsEditDrawerOpen,
  onsubmit,
}) => {
  const { getAllContacts } = useContext(ContactContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const EditContactSubmit = async (formData) => {
    try {
      if (!selectedContactId) {
        return toast.error("Please select a contact first");
      }
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
      toast.success(`Contact updated successfully ✔`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(EditContactSubmit)}>
      <div className="mb-4">
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

      <div className="mb-4">
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

      <div className="mb-4">
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

      <div className="mb-4">
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

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => {
            reset();
            setIsEditDrawerOpen(false);
          }}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
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
