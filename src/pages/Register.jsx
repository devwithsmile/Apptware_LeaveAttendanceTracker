/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (step === 2) {
      setHasAnimated(true);
    }
  }, [step]);

  const onSubmit = async (data) => {
    try {
      // Combine data from both steps
      const fullData = { ...data };
      console.log('Registering user with data:', fullData);
      await registerUser(fullData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="space-y-8 w-full max-w-md">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            {step === 1 ? 'Create your account' : 'Additional Information'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            key={step}
            initial={{ opacity: 1, x: step === 1 ? 0 : 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
          >
            {step === 1 ? (
              <>
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <label htmlFor="name" className="sr-only">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      {...register('name', { required: 'Full name is required' })}
                      className="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-none rounded-t-md border border-gray-300 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                      id="email"
                      type="email"
                      {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })}
                      className="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-none border border-gray-300 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      id="password"
                      type="password"
                      {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' }, pattern: { value: /^(?=.*[A-Z])(?=.*[0-9])/i, message: 'Password must contain at least 1 uppercase letter and 1 number' } })}
                      className="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-none border border-gray-300 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword', { required: 'Please confirm your password', validate: value => value === watch('password') || 'Passwords do not match' })}
                      className="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-none rounded-b-md border border-gray-300 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Confirm password"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex relative justify-center px-4 py-2 w-full text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <label htmlFor="phone" className="sr-only">Phone Number</label>
                    <input
                      id="phone"
                      type="text"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-none rounded-t-md border border-gray-300 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Phone Number"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="designation" className="sr-only">Designation</label>
                    <input
                      id="designation"
                      type="text"
                      {...register('designation', { required: 'Designation is required' })}
                      className="block relative px-3 py-2 w-full placeholder-gray-500 text-gray-900 rounded-none rounded-b-md border border-gray-300 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Designation"
                    />
                    {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation.message}</p>}
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="flex relative justify-center px-4 py-2 w-full text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Register