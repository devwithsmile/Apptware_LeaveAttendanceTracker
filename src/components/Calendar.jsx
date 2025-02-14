/* eslint-disable react/prop-types */
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { mockAttendance } from "../lib/mockData";

export const Calendar = ({ getAttendanceCount, onDateClick, selectedEmployeeId }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, prevDate.getDate()));
    };
    
    const handleNextMonth = () => {
        setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, prevDate.getDate()));
    };
    
    const renderDaysOfWeek = () => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="grid grid-cols-7 mb-2 text-sm font-medium text-center">
                {daysOfWeek.map((day, index) => (
                    <div key={index}>{day}</div>
                ))}
            </div>
        );
    };

    const renderDates = () => {
        const startOfCurrentMonth = startOfMonth(currentDate);
        const endOfCurrentMonth = endOfMonth(currentDate);
        const daysInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

        return (
            <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((date, index) => {
                    const isSelected = selectedEmployeeId && getAttendanceCount(date) > 0;
                    const attendanceCount = getAttendanceCount(date);

                    // Check if the date is part of the selected employee's attendance
                    const isEmployeeAttendance = selectedEmployeeId && mockAttendance.some(
                        (a) => a.userId === selectedEmployeeId && a.date === format(date, "yyyy-MM-dd")
                    );

                    return (
                        <div
                            key={index}
                            className={`p-2 text-center cursor-pointer rounded-md ${isEmployeeAttendance ? "bg-blue-500 text-white" : ""}`}
                            onClick={() => onDateClick(date)}
                        >
                            <div className="text-sm">{format(date, "d")}</div>
                            {attendanceCount > 0 && <div className="text-xs text-gray-500">{attendanceCount}</div>}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <button className="p-2" onClick={handlePrevMonth}>
                    {"<"}
                </button>
                <h2 className="text-xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
                <button className="p-2" onClick={handleNextMonth}>
                    {">"}
                </button>
            </div>
            {renderDaysOfWeek()}
            {renderDates()}
        </div>
    );
};