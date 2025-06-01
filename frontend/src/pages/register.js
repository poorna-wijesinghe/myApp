import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/headerOne';
import { useForm } from "react-hook-form";
import axios from "axios";

const Register = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const navigate = useNavigate();
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        userId: data.userId,
        password: data.password,
      });

      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.message === "User ID already exists") {
        alert("This user ID already exists. Try another.");
      } else {
        console.error("Registration failed:", err);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-400 w-full relative">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-light mb-2 text-center">Welcome to <strong className="font-bold">myApp</strong></h1>
        <hr className="w-24 border-t-2 border-black mb-6" />

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white bg-opacity-60 p-6 rounded shadow-md w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">User ID*</label>
            <input {...register("userId", { required: true })} className="w-full px-3 py-2 border rounded" />
            {errors.userId && <p className="text-red-500 text-sm">User ID is required</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password*</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 3 })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">Password must be at least 3 characters</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Confirm Password*</label>
            <input
              type="password"
              {...register("confirmPassword", { required: true })}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">Confirm Password is required</p>}
            {passwordMismatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
          </div>

          <button type="submit" disabled={!isValid} className="w-full bg-black text-white py-2 rounded">
            REGISTER
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account? <Link to="/login" className="underline">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
