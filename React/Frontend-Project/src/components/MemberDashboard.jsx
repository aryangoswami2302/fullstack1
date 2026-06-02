// MemberDashboard.jsx – Firebase backed member management
import { useEffect, useState } from "react";
import { fetchMembers, createMember } from "../services/firebaseService";

function MemberDashboard() {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", plan: "" });

  // Load members on mount
  useEffect(() => {
    const load = async () => {
      const data = await fetchMembers();
      setMembers(data);
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.plan) return;
    // Add to Firestore
    const added = await createMember(newMember);
    // Update local state
    setMembers((prev) => [...prev, added]);
    setNewMember({ name: "", plan: "" });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gym Members</h2>
      {/* Add Member Form */}
      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          type="text"
          name="name"
          placeholder="Member Name"
          value={newMember.name}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="text"
          name="plan"
          placeholder="Plan"
          value={newMember.plan}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 rounded"
        >
          Add Member
        </button>
      </form>

      {/* Members List */}
      {members.map((m) => (
        <p key={m.id} className="border-b py-1">
          {m.name} - {m.plan}
        </p>
      ))}
    </div>
  );
}
