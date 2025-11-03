"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Edit, Trash2, UsersRound, MessageSquare, UserCheck, User, LogOut
} from "lucide-react";

// ✅ Reusable Modal Component
function Modal({ open, onClose, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl animate-scalePop">
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ✅ Toast Component
function Toast({ message, type }: any) {
  if (!message) return null;
  return (
    <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow text-white
      ${type === "success" ? "bg-green-500" : "bg-red-500"} animate-slideIn`}>
      {message}
    </div>
  );
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });

  // Pagination
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;
  const totalPages = Math.ceil(filteredUsers.length / PER_PAGE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    if (!token) {
      router.push("/login");
    } else {
      setUserName(name || "");
    }
  }, [router]);

  const showToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 2000);
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setFilteredUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  // Search
  useEffect(() => {
    const res = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredUsers(res);
    setPage(1);
  }, [search, users]);

  // ✅ Add / Update User
  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      showToast("All fields required!", "error");
      return;
    }
    console.log("Editing User ID:", editingUser);
  
    const url = editingUser ? `/api/users/${editingUser._id}` : "/api/users";
    const method = editingUser ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      showToast(editingUser ? "User Updated!" : "User Added!");
      setShowModal(false);
      setForm({ name: "", email: "" });
      setEditingUser(null);
      fetchUsers();
    }
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    console.log("id", id)
    if (!confirm("Delete user?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

    if (res.ok) {
      showToast("User Deleted!");
      fetchUsers();
    }
  };

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    } else {
      showToast("Logout failed!", "error");
    }
  };

  return (
    <div>
      <Toast message={toast.message} type={toast.type} />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">

        {/* ✅ Navbar */}
        <nav className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">User Dashboard</h1>
            {userName && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                <User size={16} />
                <span className="text-sm font-medium">Welcome, {userName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingUser(null);
                setForm({ name: "", email: "" });
                setShowModal(true);
              }}
              className="bg-white text-indigo-600 px-4 py-2 rounded-md shadow hover:bg-gray-200 flex items-center gap-1 transition-all duration-200"
            >
              <Plus size={18} /> Add User
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 flex items-center gap-1 transition-all duration-200"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </nav>

        <div className="p-6">

          {/* ✅ Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex items-center gap-4">
              <UsersRound className="w-10 h-10 text-indigo-600" />
              <div><p>Total Users</p><h2 className="text-2xl font-bold">{users.length}</h2></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex items-center gap-4">
              <UserCheck className="w-10 h-10 text-green-500" />
              <div><p>Active</p><h2 className="text-2xl font-bold">8</h2></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex items-center gap-4">
              <MessageSquare className="w-10 h-10 text-yellow-500" />
              <div><p>Messages</p><h2 className="text-2xl font-bold">120</h2></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow flex items-center gap-4">
              <MessageSquare className="w-10 h-10 text-blue-500" />
              <div><p>Events</p><h2 className="text-2xl font-bold">4</h2></div>
            </div>
          </div>

          {/* ✅ Search */}
          <div className="relative w-64 mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" />
          </div>

          {/* ✅ Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(item => (
                  <tr key={item._id} className="border-b dark:border-gray-700">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.email}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button onClick={() => {
                        setEditingUser(item);
                        setForm({ name: item.name, email: item.email });
                        setShowModal(true);
                      }}>
                        <Edit className="text-blue-600" />
                      </button>
                      <button onClick={() => handleDelete(item._id)}>
                        <Trash2 className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ Pagination */}
            <div className="flex justify-center gap-3 mt-4">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-40">Prev</button>

              <span>{page}/{totalPages}</span>

              <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-semibold mb-4">{editingUser ? "Edit User" : "Add User"}</h2>

        <input
          className="w-full p-2 mb-3 border rounded dark:bg-gray-800 dark:border-gray-700"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-3 hover:bg-indigo-700"
        >
          {editingUser ? "Save Changes" : "Add User"}
        </button>
      </Modal>
    </div>
  );
}

/* ✅ Animations */