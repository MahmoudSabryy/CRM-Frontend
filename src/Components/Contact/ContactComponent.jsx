import { useContext, useState } from "react";
import { baseURL, myHeaders } from "../../Environment/environment";
import axios from "axios";
import toast from "react-hot-toast";
import { ContactContext } from "../../Context/ContactContext/contact.context";
import { confirmAlert } from "../../Utils/confirmAlert";
import AddContactForm from "../Forms/AddContactForm";
import EditContactForm from "../Forms/EditContactForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Auth Context/AuthContext";

export default function ContactComponent() {
  const { userData } = useContext(AuthContext);
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
      <div
        className="flex-1 min-h-screen p-4"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        {/* Filters */}
        <div
          className="flex justify-between items-center p-4 mb-4 rounded-xl"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex gap-4">
            <input
              onChange={(e) => setSearchByName(e.target.value)}
              placeholder="Search by name..."
              className="px-4 py-2 w-64 rounded-xl border focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            />
            <input
              onChange={(e) => setSearchByEmail(e.target.value)}
              placeholder="Search by email..."
              className="px-4 py-2 w-64 rounded-xl border focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="px-4 py-2 rounded-xl font-medium hover:opacity-90 transition"
              style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
            >
              + Add Contact
            </button>

            <button
              onClick={() => {
                if (!selectedContactId)
                  return toast.error("Select contact first");
                setIsEditDrawerOpen(true);
              }}
              className="px-4 py-2 rounded-xl hover:opacity-90 transition"
              style={{
                backgroundColor: "var(--color-card)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
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
                className="px-4 py-2 rounded-xl font-medium hover:opacity-90 transition"
                style={{ backgroundColor: "#dc2626", color: "#fff" }}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{ borderColor: "var(--color-border)" }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-[40px_2fr_2fr_1.5fr_1.5fr_1fr_1fr_1fr] px-6 py-4 text-xs font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: "var(--color-card)",
              color: "var(--color-muted)",
            }}
          >
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
              className="grid grid-cols-[40px_2fr_2fr_1.5fr_1.5fr_1fr_1fr_1fr] px-6 py-4 items-center border-b cursor-pointer hover:opacity-90 transition"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-card)",
              }}
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
                  <p style={{ color: "var(--color-text)" }}>{contact.name}</p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {contact.owner?.role}
                  </p>
                </div>
              </div>

              <div style={{ color: "var(--color-text)", cursor: "pointer" }}>
                {contact.email}
              </div>

              <div style={{ color: "var(--color-text)" }}>{contact.phone}</div>

              <div style={{ color: "var(--color-text)", fontWeight: "500" }}>
                {contact.company}
              </div>

              {/* Deals Badge */}
              <div>
                <span
                  onClick={() => {
                    setSelectedContact(contact);
                    setIsDealDrawerOpen(true);
                  }}
                  className="px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition"
                  style={{ backgroundColor: "#dcfce7", color: "#166534" }}
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
                  className="px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition"
                  style={{ backgroundColor: "#dbeafe", color: "#1e3a8a" }}
                >
                  {contact.activities?.length || 0} Activities
                </span>
              </div>

              {/* View Details Badge */}
              <div>
                <span
                  onClick={() => navigate(`/contact/${contact.id}`)}
                  className="px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition"
                  style={{ backgroundColor: "#dbeafe", color: "#1e3a8a" }}
                >
                  View Details
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Drawer */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={() => setIsAddDrawerOpen(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />
          <div
            className="absolute right-0 top-0 h-full w-[480px] p-8 overflow-auto rounded-l-xl shadow-2xl"
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: "var(--color-text)" }}
            >
              Add Contact
            </h2>
            <AddContactForm
              onSubmit={(data) => console.log(data)}
              setIsAddDrawerOpen={setIsAddDrawerOpen}
            />
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
          <div
            className="absolute right-0 top-0 h-full w-[480px] p-8 overflow-auto rounded-l-xl shadow-2xl"
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: "var(--color-text)" }}
            >
              Edit Contact
            </h2>
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
