import { useState } from "react";
import { format } from "date-fns";
import { Search, X } from "lucide-react";
import { mockUsers, mockAttendance } from "@/lib/mockData";
import { Calendar } from "@/components/Calendar";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Get attendance count for a specific date
  const getAttendanceCount = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");

    if (selectedEmployee) {
      return mockAttendance.filter(
        (a) => a.date === formattedDate && a.userId === selectedEmployee.id
      ).length || undefined;
    }

    return mockAttendance.filter((a) => a.date === formattedDate).length || undefined;
  };

  const getUsersForDate = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return mockUsers.filter((user) =>
      mockAttendance.some((a) => a.date === formattedDate && a.userId === user.id)
    );
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    const employee = mockUsers.find(
      (user) => user.id.toString() === query || user.name.toLowerCase().includes(query)
    );
    if (!employee) {
      alert("No employee found");
      return;
    }
    setSelectedEmployee(employee);
    setSelectedDate(null);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedEmployee(null);
    setSelectedDate(null);
  };

  return (
    <div className="container flex flex-col gap-6 p-6 mx-auto md:flex-row">
      {/* Left Section - Calendar (65%) */}
      <div className="w-full md:w-2/3 min-h-[600px] border rounded-lg p-4">
        <Calendar
          getAttendanceCount={getAttendanceCount}
          onDateClick={(date) => {
            setSelectedDate(date);
            setIsModalOpen(true);
          }}
          selectedEmployee={selectedEmployee}
          selectedEmployeeId={selectedEmployee?.id}
        />
      </div>
  
      {/* Right Section - Search (35%) */}
      <div className="w-full md:w-1/3 min-h-[600px] border rounded-lg p-4 flex flex-col justify-between">
        <div>
          <h2 className="mb-3 font-bold">Search Employee</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by ID or name..."
              className="w-full p-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="p-2 text-white bg-blue-500 rounded" onClick={handleSearch}>
              <Search size={16} />
            </button>
          </div>
        </div>
  
        {selectedEmployee && (
          <div className="flex items-center gap-3 p-3 mt-4 border rounded">
            <img className="w-10 h-10 rounded-full" src={selectedEmployee.avatar} alt={selectedEmployee.name} />
            <div>
              <p className="font-medium">{selectedEmployee.name}</p>
              <p className="text-sm text-gray-500">{selectedEmployee.role}</p>
            </div>
            <button className="text-gray-500" onClick={handleReset}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
