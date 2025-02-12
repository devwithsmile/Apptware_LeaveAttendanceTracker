import React, { useState } from 'react'
import moment from 'moment'
import { FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi'
import axios from 'axios'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment())
  const [selectedDate, setSelectedDate] = useState(null)

  const daysInMonth = currentDate.daysInMonth()
  const firstDayOfMonth = moment(currentDate).startOf('month').day()

  const previousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month'))
  }

  const nextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'month'))
  }

  // Mock data for employee count
  const getEmployeeCount = (day) => {
    //TODO: Replace this with actual data
    const response = axios.get('https://jsonplaceholder.typicode.com/users');

    Promise.resolve(response).then((data) => {
      console.log(data.data.length)
    });
     
    return Math.floor(Math.random() * 10);
  }


  const renderCalendarDays = () => {
    const days = []
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Render days of week
    daysOfWeek.forEach(day => {
      days.push(
        <div key={day} className="p-2 text-sm font-semibold text-gray-600">
          {day}
        </div>
      )
    })

    // Empty cells for days before start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(currentDate).date(day)
      const isToday = date.isSame(moment(), 'day')
      const isSelected = selectedDate && date.isSame(selectedDate, 'day')
      const employeeCount = getEmployeeCount(day)

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`p-2 border cursor-pointer transition-colors relative
            ${isToday ? 'bg-blue-50' : ''}
            ${isSelected ? 'bg-blue-100' : ''}
            hover:bg-blue-50`}
        >
          <span className={`${isToday ? 'font-bold text-blue-600' : ''}`}>{day}</span>
          <div className="flex items-center justify-center mt-1 text-xs text-gray-500">
            <FiUser className="mr-1" size={12} />
            {employeeCount}
          </div>
        </div>
      )
    }

    return days
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Calendar</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft size={20} />
          </button>
          <span className="text-lg font-medium">
            {currentDate.format('MMMM YYYY')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-px">
          {renderCalendarDays()}
        </div>
      </div>

      {selectedDate && (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">
            Attendance for {selectedDate.format('MMMM D, YYYY')}
          </h2>
          <div className="space-y-4">
            {/* <div className="flex justify-between text-sm text-gray-500">
              <span>Total Present: 15</span>
              <span>Total Absent: 5</span>
              <span>On Leave: 2</span>
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar