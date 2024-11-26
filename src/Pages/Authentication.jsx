import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const Authentication = () => {

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Call your login API here
      console.log(values);
      // If login is successful, redirect to the dashboard
    },
  });

  return (
    <div className="flex items-center justify-center h-[85vh]">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-sm bg-table-container-bg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium ">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-2 p-3 border border-gray-300 bg-primary-bg dark:border-transparent rounded-md w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-2 p-3 border border-gray-300 bg-primary-bg dark:border-transparent rounded-md w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-primary-btn text-white rounded-md hover:opacity-60 focus:outline-none"
            >
              Log In
            </button>
          </div>

          <div className="flex items-center justify-between text-sm mt-4">
            <Link to="#" className="text-primary-bg-primary-btn hover:opacity-60 ">
              Forgot password?
            </Link>
            <Link to="/create-user" className="text-primary-bg-primary-btn hover:opacity-60 ">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Authentication;
