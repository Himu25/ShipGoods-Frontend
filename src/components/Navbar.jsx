"use client";
import { loadUserFromCookies, logout } from "@/store/authSlice";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { AiOutlineLogout, AiOutlineLogin } from "react-icons/ai";
import { RiUserAddFill } from "react-icons/ri";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isLoggedIn, role, name } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromCookies());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const renderMenuItems = () => {
    switch (role) {
      case "user":
        return (
          <>
            <Link href="/bookings">
              <span className="px-3 py-2 text-gray-700 transition duration-300 transform hover:bg-gray-200 rounded-md">
                Bookings
              </span>
            </Link>
            <Link href="/track">
              <span className="px-3 py-2 text-gray-700 transition duration-300 transform hover:bg-gray-200 rounded-md">
                Track Vehicle
              </span>
            </Link>
          </>
        );
      case "driver":
        return (
          <>
            <Link href="/available-jobs">
              <span className="px-3 py-2 text-gray-700 transition duration-300 transform hover:bg-gray-200 rounded-md">
                Available Jobs
              </span>
            </Link>
            <Link href="/job-status">
              <span className="px-3 py-2 text-gray-700 transition duration-300 transform hover:bg-gray-200 rounded-md">
                Job Status
              </span>
            </Link>
          </>
        );
      case "admin":
        return (
          <>
            <Link href="/admin/fleet">
              <span className="px-3 py-2 text-gray-700 transition duration-300 transform hover:bg-gray-200 rounded-md">
                Fleet
              </span>
            </Link>
            <Link href="/admin/analytics">
              <span className="px-3 py-2 text-gray-700 transition duration-300 transform hover:bg-gray-200 rounded-md">
                Analytics
              </span>
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="relative bg-gray-50 shadow-md">
      <div className="container px-6 py-4 mx-auto md:flex md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-2xl -mt-1 font-bold text-blue-600 md:mr-6">
            MyApp
          </span>
          {renderMenuItems()}
        </div>

        <div className="relative flex items-center space-x-6 mt-4 md:mt-0">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaSearch />
            </span>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
              placeholder="Search"
            />
          </div>

          {isLoggedIn ? (
            <>
              <span className="text-gray-700 font-medium">
                {name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
              >
                <AiOutlineLogout className="mr-2" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                  <AiOutlineLogin className="mr-2" />
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 shadow-md">
                  <RiUserAddFill className="mr-2" />
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
