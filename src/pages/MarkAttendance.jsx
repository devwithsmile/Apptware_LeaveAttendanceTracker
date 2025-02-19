import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Calendar, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import "../styles/calendar.css";

function MarkAttendance() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectionMode, setSelectionMode] = useState('random'); // 'random' or 'range'
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState(false);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const handleSelectionModeChange = (mode) => {
    setSelectionMode(mode);
    if (mode === 'random') {
      setDateRange([null, null]);
    } else if (mode === 'range') {
      setSelectedDates([]);
    }
  };

  const handleDateChange = (date) => {
    if (selectionMode === 'random') {
      if (selectedDates.length >= 5 && !selectedDates.includes(date)) {
        toast.error('Maximum 5 dates can be selected');
        return;
      }

      setSelectedDates(prev => {
        if (prev.some(d => d.getTime() === date.getTime())) {
          return prev.filter(d => d.getTime() !== date.getTime());
        }
        return [...prev, date].sort((a, b) => a - b);
      });
    }
  };

  const handleRangeChange = (update) => {
    const [start, end] = update;

    if (!start) {
      setDateRange([null, null]);
      return;
    }

    if (!end) {
      setDateRange([start, null]);
      return;
    }

    // Find the end date that includes exactly 5 weekdays
    let weekdayCount = 0;
    let currentDate = new Date(start);
    let adjustedEndDate = null;

    while (weekdayCount < 5) {
      if (isWeekday(currentDate)) {
        weekdayCount++;
        if (weekdayCount === 5) {
          adjustedEndDate = new Date(currentDate);
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDateRange([start, adjustedEndDate]);
  };

  const clearSelections = () => {
    setSelectedDates([]);
    setDateRange([null, null]);
    toast.success('All selections cleared');
  };

  const handleSubmit = async () => {
    if (!isValidSelection()) {
      toast.error('Please make a valid date selection');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Dates submitted successfully!');
      clearSelections();
    } catch (error) {
      toast.error('Failed to submit dates');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidSelection = () => {
    if (selectionMode === 'random') {
      return selectedDates.length > 0 && selectedDates.length <= 5;
    }
    return dateRange[0] && dateRange[1];
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="p-8 mx-auto max-w-6xl rounded-2xl border shadow-lg backdrop-blur-sm bg-white/70 border-gray-100/50">
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex gap-3 items-center mb-2 text-2xl font-bold text-gray-800">
              <Calendar className="w-7 h-7 text-indigo-600" />
              Date Selector
            </h1>
            <p className="text-gray-500">Select dates to mark attendance</p>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectionModeChange('random')}
              className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${selectionMode === 'random'
                  ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              Random Dates
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectionModeChange('range')}
              className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${selectionMode === 'range'
                  ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              Date Range
            </motion.button>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="date-picker-container md:flex md:justify-center md:items-start">
            <div className="w-full max-w-[420px]">
              {selectionMode === 'random' ? (
                <DatePicker
                  selected={null}
                  onChange={handleDateChange}
                  inline
                  highlightDates={selectedDates}
                  filterDate={isWeekday}
                  minDate={new Date()}
                  dayClassName={date => date.getDay() === 0 || date.getDay() === 6 ? "text-red-500" : undefined}
                />
              ) : (
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleRangeChange}
                  filterDate={isWeekday}
                  inline
                  highlightDates={selectedDates}
                  minDate={new Date()}
                  dayClassName={date => date.getDay() === 0 || date.getDay() === 6 ? "text-red-500" : undefined}
                />
              )}
            </div>
          </div>

          <div className="selected-dates-container">
            <div className="p-6 h-full rounded-xl border shadow-sm backdrop-blur-sm border-gray-100/70 bg-white/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="flex gap-2 items-center text-base font-semibold text-gray-700">
                  <CalendarIcon className="w-5 h-5 text-indigo-600" />
                  Selected Dates
                </h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSelections}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="space-y-2">
                {selectionMode === 'random' ? (
                  selectedDates.map((date, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                    >
                      {formatDate(date)}
                    </motion.div>
                  ))
                ) : (
                  <>
                    {startDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                      >
                        Start: {formatDate(startDate)}
                      </motion.div>
                    )}
                    {endDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                      >
                        End: {formatDate(endDate)}
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!isValidSelection() || isLoading}
            className={`px-6 py-3 text-sm font-medium rounded-lg shadow-md ${isValidSelection() && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200/50'
                : 'bg-gray-100/70 backdrop-blur-sm cursor-not-allowed text-gray-400'
              } transition-all duration-200`}
          >
            {isLoading ? (
              <span className="flex gap-2 items-center">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              'Submit'
            )}
          </motion.button>
        </div>
      </div>
    </>
  );
}

export default MarkAttendance;