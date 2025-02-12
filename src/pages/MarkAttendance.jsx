/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import moment from 'moment'

const MarkAttendance = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
  const [isRecurring, setIsRecurring] = useState(false)

  // Function to limit the year input
  const handleDateInputChange = (e) => {
    const { name, value } = e.target;
    // Use regex to allow only numbers and limit year to 4 digits
    const formattedValue = value.replace(/[^0-9-]/g, '').replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$2-$3');

    setValue(name, formattedValue, { shouldValidate: true }); // Update the form value and trigger validation
  };

  useEffect(() => {
    register('date');
    register('startDate');
    register('endDate');
  }, [register]);

  const onSubmit = async (data) => {
    try {
      console.log('Attendance data:', data)
      toast.success('Attendance marked successfully!')
      reset()
    } catch (error) {
      toast.error('Failed to mark attendance' + error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Mark Attendance</h1>

      <div className="p-6 bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Date Type
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="single"
                  checked={!isRecurring}
                  onChange={() => setIsRecurring(false)}
                  className="text-indigo-600 form-radio"
                />
                <span className="ml-2">Single Date</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="recurring"
                  checked={isRecurring}
                  onChange={() => setIsRecurring(true)}
                  className="text-indigo-600 form-radio"
                />
                <span className="ml-2">Date Range</span>
              </label>
            </div>
          </div>

          {!isRecurring ? (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                {...register('date', {
                  required: 'Date is required',
                  pattern: {
                    value: /^\d{4}-\d{2}-\d{2}$/,
                    message: 'Invalid date format. Use DD-MM-YYYY',
                  },
                })}
                onChange={handleDateInputChange}
                min={moment().format('DD-MM-YYYY')}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register('startDate', {
                    required: 'Start date is required',
                    pattern: {
                      value: /^\d{4}-\d{2}-\d{2}$/,
                      message: 'Invalid date format. Use DD-MM-YYYY',
                    },
                  })}
                  onChange={handleDateInputChange}
                  min={moment().format('DD-MM-YYYY')}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  {...register('endDate', {
                    required: 'End date is required',
                    pattern: {
                      value: /^\d{4}-\d{2}-\d{2}$/,
                      message: 'Invalid date format. Use DD-MM-YYYY',
                    },
                  })}
                  onChange={handleDateInputChange}
                  min={moment().format('DD-MM-YYYY')}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>
          )}


          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Comments
            </label>
            <textarea
              {...register('comments')}
              rows={3}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Mark Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MarkAttendance
