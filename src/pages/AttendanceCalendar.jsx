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
    <div className="flex flex-col h-full gap-6 p-6 md:flex-row bg-gray-50">
      {/* Calendar Panel */}
      <div className="w-full md:w-2/3">
        <div className="p-6 bg-white shadow-md rounded-xl">
          <Calendar
            className={"rounded-xl overflow-hidden"}
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
                  <div className="absolute transform -translate-x-1/2 bottom-1 left-1/2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                  </div>
                );
              }

              // Show total attendance count for all users
              const count = mockAttendance.filter((att) => att.date === formattedDate).length;
              return count > 0 ? (
                <div className="absolute transform -translate-x-1/2 bottom-1 left-1/2">
                  <div className="text-xs font-medium text-gray-500">{count}</div>
                </div>
              ) : null;
            }}
          />
        </div>
      </div>

      {/* Search Panel */}
      <div className="w-full space-y-4 md:w-1/3">
        <div className={`bg-white rounded-xl shadow-md p-6 transition-all ${isSearchFocused ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''}`}>
          <div className="relative" ref={suggestionsRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by ID or Name (min. 2 characters)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full p-3 pr-10 text-sm transition-colors border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              {isLoading ? (
                <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
                  <div className="w-5 h-5 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                </div>
              ) : searchQuery ? (
                <button
                  onClick={handleClearSearch}
                  className="absolute p-2 text-gray-400 transition-colors transform -translate-y-1/2 right-2 top-1/2 hover:text-indigo-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="overflow-y-auto max-h-60">
                  {suggestions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="flex items-center w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full">
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
            className="p-6 space-y-4 bg-white shadow-md rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
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
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 text-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity bg-black bg-opacity-60 backdrop-blur-sm"
                onClick={() => setSelectedDate(null)}
              />

              <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-50 inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-2xl rounded-2xl ring-1 ring-black ring-opacity-5"
              >
                <div className="flex items-center justify-between mb-6">
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
                    <div key={user.id} className="flex items-center p-3 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
                      <div className="flex-shrink-0 mr-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
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
