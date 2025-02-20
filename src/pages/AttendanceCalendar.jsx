import { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from 'framer-motion';
import { mockAttendance, mockUsers } from "../lib/mockData";
import { useSearch } from "../hooks/useSearch";

export default function AttendanceCalendar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [mockAttendanceData, setMockAttendanceData] = useState(null);
  const suggestionsRef = useRef(null);

  const {
    searchQuery,
    suggestions,
    selectedUser: filteredUser,
    isLoading,
    handleSearchChange,
    handleSelectUser,
    handleClearSearch
  } = useSearch();

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const attendees = mockAttendance
      .filter((att) => att.date === formattedDate)
      .map((att) => mockUsers.find((user) => user.id === att.userId));
    setModalData(attendees);
    setSelectedDate(formattedDate);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        handleClearSearch();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClearSearch]);

  // Update attendance data when user is selected
  useEffect(() => {
    if (filteredUser) {
      const attendanceDates = mockAttendance
        .filter((att) => att.userId === filteredUser.id)
        .map((att) => att.date.trim());
      setMockAttendanceData(attendanceDates);
    } else {
      setMockAttendanceData(null);
    }
  }, [filteredUser]);

  return (
    <div className="flex flex-col gap-6 p-6 h-full bg-gray-50 md:flex-row">
      {/* Calendar Panel */}
      <div className="w-full md:w-2/3">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <Calendar
            className={"overflow-hidden rounded-xl"}
            onClickDay={handleDateClick}
            tileClassName={({ date }) => {
              const formattedDate = date.toISOString().split("T")[0];
              const isToday = new Date().toISOString().split("T")[0] === formattedDate;
              const baseClasses = "relative hover:bg-indigo-50 transition-colors";
              return isToday ? `${baseClasses} bg-indigo-50` : baseClasses;
            }}
            tileContent={({ date }) => {
              const formattedDate = date.toISOString().split("T")[0];

              // Check if this date exists in the filtered user's attendance records
              if (mockAttendanceData && mockAttendanceData.includes(formattedDate)) {
                return (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                  </div>
                );
              }

              // Show total attendance count for all users
              const count = mockAttendance.filter((att) => att.date === formattedDate).length;
              return count > 0 ? (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="text-xs font-medium text-gray-500">{count}</div>
                </div>
              ) : null;
            }}
          />
        </div>
      </div>

      {/* Search Panel */}
      <div className="space-y-4 w-full md:w-1/3">
        <div className={`bg-white rounded-xl shadow-md p-6 transition-all ${isSearchFocused ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}`}>
          <div className="relative" ref={suggestionsRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID or Name (min. 2 characters)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="p-3 pr-10 w-full text-sm rounded-lg border border-gray-200 transition-colors focus:outline-none focus:border-indigo-500"
              />
              {isLoading ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                </div>
              ) : searchQuery ? (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 p-2 text-gray-400 transition-colors transform -translate-y-1/2 hover:text-indigo-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </div>

            {/* Search Suggestions */}
            {suggestions && suggestions.length > 0 && (
              <div className="overflow-hidden absolute z-50 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg">
                <div className="overflow-y-auto max-h-60">
                  {suggestions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="flex items-center px-4 py-3 w-full text-left transition-colors hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex justify-center items-center w-8 h-8 bg-indigo-100 rounded-full">
                          <span className="text-sm font-medium text-indigo-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id} • {user.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          
          </div>
        </div>

        {filteredUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-4 bg-white rounded-xl shadow-md"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex justify-center items-center w-12 h-12 bg-indigo-100 rounded-full">
                  <span className="text-lg font-medium text-indigo-600">
                    {filteredUser.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{filteredUser.name}</h3>
                <p className="text-sm text-gray-500">{filteredUser.role}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-y-auto fixed inset-0 z-50"
          >
            <div className="px-4 min-h-screen text-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
                onClick={() => setSelectedDate(null)}
              />

              <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block overflow-hidden relative z-50 p-6 my-8 w-full max-w-md text-left align-middle bg-white rounded-2xl ring-1 ring-black ring-opacity-5 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Attendance for {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  {modalData.map((user) => (
                    <div key={user.id} className="flex items-center p-3 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">
                      <div className="flex-shrink-0 mr-4">
                        <div className="flex justify-center items-center w-10 h-10 bg-indigo-100 rounded-full">
                          <span className="text-sm font-medium text-indigo-600">{user.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
