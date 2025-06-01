import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/headerOne';
import PageSEO from '../components/pageSEO';
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const currentUrl = window.location.href;

  const onSubmit = async (data) => {
  try {
    const res = await axios.post("http://localhost:5000/api/users/login", {
      userId: data.userId,
      password: data.password,
    });

    // Save the real token and userId
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);

    // Keep me logged in 1 year
    if (data.keepLoggedIn) {
      document.cookie = `token=${res.data.token}; max-age=${60 * 60 * 24 * 365}`;
    }

    navigate("/my-profile");
  } catch (err) {
    console.error(err);
    setLoginError(true);
  }
};


  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-400 w-full relative">
      <PageSEO
        title="Login | myApp"
        description="Access your profile securely on myApp."
        keywords="login, user login, myApp"
        url={currentUrl}
      />
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
          <input type="password" {...register("password", { required: true })} className="w-full px-3 py-2 border rounded" />
          {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input type="checkbox" {...register("keepLoggedIn")} className="mr-2" /> Keep me logged in
          </label>
        </div>

        <button type="submit" disabled={!isValid} className="w-full bg-black text-white py-2 rounded">LOGIN</button>
        <p className="text-center mt-4 text-sm">No account? <Link to="/register" className="underline">Register here</Link>.</p>
      </form>
      {loginError && (
        <div className="relative top-2 bg-gray-800 text-white px-4 py-2 rounded text-sm">
          Your user ID and/or password does not match.
        </div>
      )}
      </div>

      
    </div>
  );
};

export default Login;