/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaChevronLeft, FaChevronRight, FaRegCalendarCheck } from 'react-icons/fa'; // Import icons

moment.locale('en-GB'); // Adjust locale as needed

const localizer = momentLocalizer(moment);

const Home = () => {
  const [searchType, setSearchType] = useState('employeeID');
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]); // Use events instead of searchResults

  const handleSearch = () => {
    // Replace this with your actual search logic
    // Mock results for demonstration
    const mockEvents = [
      {
        id: 1,
        employeeID: 'EMP123',
        emailID: 'email1@gmail.com',
        title: 'John Doe - Office Day',
        start: moment().toDate(), // Today
        end: moment().add(1, 'days').toDate(), // Tomorrow
      },
      {
        id: 2,
        employeeID: 'EMP123',
        emailID: 'email2@gmail.com',
        title: 'John Doe - Office Day',
        start: moment().add(3, 'days').toDate(), // 3 days from now
        end: moment().add(4, 'days').toDate(),// 4 days from now
      },
      {
        id: 3,
        employeeID: 'EMP456',
        emailID: 'email3@gmail.com',
        title: 'Jane Smith - Office Day',
        start: moment().add(1, 'days').toDate(), // Tomorrow
        end: moment().add(2, 'days').toDate(), // Day after tomorrow
      },
    ];

    // Filter events based on search criteria
    let filteredEvents = [];
    if (searchType === 'employeeID') {
      filteredEvents = mockEvents.filter(event => event.employeeID.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
      // Assuming you have employee email associated with events
      filteredEvents = mockEvents.filter(event => event.emailID.toLowerCase().includes(searchTerm.toLowerCase())); // Modified for demonstration
    }
    setEvents(filteredEvents);
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');  // Corrected: Pass 'PREV'
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');  // Corrected: Pass 'NEXT'
    };

    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const label = () => {
      return (
        <span>{moment(toolbar.date).format('MMMM')}
          <span> {moment(toolbar.date).year()}</span>
        </span>
      );
    }


    return (
      <div className="flex items-center justify-between p-3 rounded-t-lg bg-gray-50"> {/* Modern toolbar styling */}
        <div className="flex items-center space-x-2"> {/* Group for navigation buttons */}
          <button
            type="button"
            onClick={goToBack}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <FaChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </button>
          <button
            onClick={goToNext}
            type="button"
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <span className="sr-only">Next</span>
            <FaChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <span className="text-lg font-semibold text-gray-800">{label()}</span> {/* Modern label styling */}

        <button
          onClick={goToToday}
          type="button"
          className="text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 hover:bg-gray-100 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <span className='flex justify-between gap-2 px-4 py-2'>
            <p>Today</p>

            <FaRegCalendarCheck className="w-4 h-4" aria-hidden="true" />
          </span>

        </button>
      </div>
    );
  };


  return (
    <div className="container p-6 mx-auto">

      {/* Search Section */}
      <div className="p-3 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Search Employees</h2>
        <div className="flex items-center mb-4 space-x-4">
          <select
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="employeeID">Search by Employee ID</option>
            <option value="employeeEmail">Search by Employee Email</option>
          </select>
          <input
            type="text"
            className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${searchType === 'employeeID' ? 'Employee ID' : 'Employee Email'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-md">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          style={{ height: 500 }}
          views={['month']}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>
    </div>
  );
};

export default Home;
