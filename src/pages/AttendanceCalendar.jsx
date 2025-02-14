import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { mockUsers, mockAttendance } from "../lib/mockData";

export default function AttendanceCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUser, setFilteredUser] = useState(null);
  const [modalData, setModalData] = useState([]);

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const attendees = mockAttendance
      .filter((att) => att.date === formattedDate)
      .map((att) => mockUsers.find((user) => user.id === att.userId));
    setModalData(attendees);
    setSelectedDate(formattedDate);
  };

  const handleSearch = () => {
    const user = mockUsers.find(
      (u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.id.toString() === searchQuery
    );
    setFilteredUser(user);
  };

  return (
    <div className="flex">
      {/* Left Search Panel */}
      <div className="w-1/4 p-4 bg-gray-100">
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSearch} className="w-full p-2 mt-2 text-white bg-blue-500 rounded">
          Search
        </button>
        {filteredUser && (
          <div className="p-2 mt-4 bg-white border rounded">
            <p><strong>Name:</strong> {filteredUser.name}</p>
            <p><strong>Role:</strong> {filteredUser.role}</p>
          </div>
        )}
      </div>
      
      {/* Calendar Panel */}
      <div className="w-3/4 p-4">
        <Calendar
          onClickDay={handleDateClick}
          tileContent={({ date }) => {
            const formattedDate = date.toISOString().split("T")[0];
            const count = mockAttendance.filter((att) => att.date === formattedDate).length;
            return count > 0 ? <div className="mt-1 text-center bg-blue-200 rounded">{count}</div> : null;
          }}
        />
      </div>
      
      {/* Modal */}
      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded w-96">
            <h2 className="text-lg font-bold">Attendance for {selectedDate}</h2>
            <ul>
              {modalData.map((user) => (
                <li key={user.id} className="p-2 border-b">{user.name} - {user.role}</li>
              ))}
            </ul>
            <button onClick={() => setSelectedDate(null)} className="w-full p-2 mt-4 text-white bg-red-500 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
