import React from "react";
import Link from "next/link"; // Import Link from Next.js

// Array of sample booking data
const bookingsData = [
  {
    bookingId: "BKG123456",
    pickupLocation: "New York",
    dropOffLocation: "Los Angeles",
    carSize: "Truck",
    totalPrice: "$1500",
  },
  {
    bookingId: "BKG123457",
    pickupLocation: "Chicago",
    dropOffLocation: "Miami",
    carSize: "SUV",
    totalPrice: "$1000",
  },
  {
    bookingId: "BKG123458",
    pickupLocation: "Dallas",
    dropOffLocation: "San Francisco",
    carSize: "Sedan",
    totalPrice: "$2000",
  },
  {
    bookingId: "BKG123459",
    pickupLocation: "Houston",
    dropOffLocation: "Seattle",
    carSize: "Van",
    totalPrice: "$3000",
  },
  {
    bookingId: "BKG123460",
    pickupLocation: "Boston",
    dropOffLocation: "Denver",
    carSize: "Flatbed Truck",
    totalPrice: "$5000",
  },
  {
    bookingId: "BKG123461",
    pickupLocation: "Atlanta",
    dropOffLocation: "Phoenix",
    carSize: "Pickup Truck",
    totalPrice: "$2500",
  },
];

export default function BookingsCard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bookingsData.map((booking, index) => (
          <Link key={index} href={`/bookings/${booking.bookingId}`}>
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Booking #{booking.bookingId}
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Pickup Location:</span>
                  <span className="text-right">{booking.pickupLocation}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Drop-off Location:</span>
                  <span className="text-right">{booking.dropOffLocation}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Car Type:</span>
                  <span className="text-right">{booking.carSize}</span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total Price:</span>
                  <span>{booking.totalPrice}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
