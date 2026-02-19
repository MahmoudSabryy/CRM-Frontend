import { useContext, useState } from "react";
import { baseURL, myHeaders } from "../../Environment/environment";
import axios from "axios";
import toast from "react-hot-toast";
import { ContactContext } from "../../Context/ContactContext/contact.context";
import { confirmAlert } from "../../Utils/confirmAlert";
import AddContactForm from "../Forms/AddContactForm";
import EditContactForm from "../Forms/EditContactForm";
import { useNavigate } from "react-router-dom";

export default function ContactComponent({ userData }) {
  const { contacts, getAllContacts } = useContext(ContactContext);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [searchByEmail, setSearchByEmail] = useState("");
  const [searchByName, setSearchByName] = useState("");
  const [, setIsActivityDrawerOpen] = useState(false);
  const [, setIsDealDrawerOpen] = useState(false);
  const [, setSelectedContact] = useState(null);

  const navigate = useNavigate();
  const handleCheckboxChange = (id) => {
    setSelectedContactId((prev) => (prev === id ? null : id));
  };

  const softDeleteContact = async (id) => {
    try {
      await axios.delete(`${baseURL}/contact/delete/${id}`, {
        headers: myHeaders,
      });
      getAllContacts();
      setSelectedContactId(null);
      toast.success("Contact deleted ✔");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    if (
      searchByName &&
      !contact.name.toLowerCase().includes(searchByName.toLowerCase())
    )
      return false;

    if (
      searchByEmail &&
      !contact.email.toLowerCase().includes(searchByEmail.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <>
      <div className="flex-1 bg-slate-50 min-h-screen">
        {/* Filters */}
        <div className="bg-white px-8 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex gap-4">
            <input
              onChange={(e) => setSearchByName(e.target.value)}
              placeholder="Search by name..."
              className="px-4 py-2 w-64 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <input
              onChange={(e) => setSearchByEmail(e.target.value)}
              placeholder="Search by email..."
              className="px-4 py-2 w-64 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
            >
              + Add Contact
            </button>

            <button
              onClick={() => {
                if (!selectedContactId)
                  return toast.error("Select contact first");
                setIsEditDrawerOpen(true);
              }}
              className="bg-slate-200 px-4 py-2 rounded-xl text-sm hover:bg-slate-300 transition"
            >
              Edit
            </button>

            {userData?.role === "admin" && (
              <button
                onClick={async () => {
                  if (!selectedContactId)
                    return toast.error("Select contact first");

                  const confirmed = await confirmAlert({
                    title: "Delete contact?",
                    text: "This action cannot be undone",
                    confirmText: "Delete",
                    cancelText: "Cancel",
                    icon: "warning",
                  });

                  if (confirmed) softDeleteContact(selectedContactId);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="px-8 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[40px_2fr_2fr_1.5fr_1.5fr_1fr_1fr_1fr] px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100">
              <div></div>
              <div>Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div>Company</div>
              <div>Deals</div>
              <div>Activities</div>
              <div>View Details</div>
            </div>

            {/* Rows */}
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="grid grid-cols-[40px_2fr_2fr_1.5fr_1.5fr_1fr_1fr_1fr] px-6 py-4 items-center border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={selectedContactId === contact.id}
                    onChange={() => handleCheckboxChange(contact.id)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                </div>

                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{contact.name}</p>
                    <p className="text-xs text-slate-400">
                      {contact.owner?.role}
                    </p>
                  </div>
                </div>

                <div className="text-slate-600 hover:text-indigo-600">
                  {contact.email}
                </div>

                <div className="text-slate-600">{contact.phone}</div>

                <div className="text-slate-700 font-medium">
                  {contact.company}
                </div>

                {/* Deals Badge */}
                <div>
                  <span
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsDealDrawerOpen(true);
                    }}
                    className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                  >
                    {contact.deals?.length || 0} Deals
                  </span>
                </div>

                {/* Activities Badge */}
                <div>
                  <span
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsActivityDrawerOpen(true);
                    }}
                    className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                  >
                    {contact.activities?.length || 0} Activities
                  </span>
                </div>

                {/* View Details Badge */}
                <div>
                  <span
                    onClick={() => navigate(`/contact/${contact.id}`)}
                    className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                  >
                    View Details
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Contact Drawer */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={() => setIsAddDrawerOpen(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 h-full w-[480px] bg-white shadow-2xl p-8 overflow-auto">
            <h2 className="text-xl font-semibold mb-6">Add Contact</h2>
            <AddContactForm onSubmit={() => setIsAddDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Edit Drawer */}
      {isEditDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={() => setIsEditDrawerOpen(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />
          <div className="absolute right-0 top-0 h-full w-[480px] bg-white shadow-2xl p-8 overflow-auto">
            <h2 className="text-xl font-semibold mb-6">Edit Contact</h2>
            <EditContactForm
              onsubmit={(data) => console.log(data)}
              setIsEditDrawerOpen={setIsEditDrawerOpen}
              selectedContactId={selectedContactId}
            />
          </div>
        </div>
      )}
    </>
  );
}
