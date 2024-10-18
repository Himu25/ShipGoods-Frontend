import React, { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from "react-redux";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";

const NearByCard = ({
  totalDis,
  totalTime,
  startCoordinates,
  endCoordinates,
  vehicleType,
  srcText,
  destnText,
}) => {
  const [price, setPrice] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, id } = useSelector((state) => state.auth);

  useEffect(() => {
    if (
      startCoordinates &&
      endCoordinates &&
      totalDis &&
      totalTime &&
      vehicleType
    ) {
      fetchPrice();
      fetchNearbyDrivers();
    }
  }, [startCoordinates, endCoordinates, totalDis, totalTime, vehicleType]);

  const fetchPrice = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-price`,
        {
          src: { lat: startCoordinates.lat, lng: startCoordinates.lng },
          dest: { lat: endCoordinates.lat, lng: endCoordinates.lng },
          vehicleType,
          distance: totalDis,
          estimatedTime: totalTime,
        }
      );
      const calculatedPrice = response.data?.data?.price;
      setPrice(calculatedPrice);
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  };

  const fetchNearbyDrivers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/nearby-drivers`,
        {
          startLocation: {
            latitude: startCoordinates.lat,
            longitude: startCoordinates.lng,
          },
          vehicleType,
        }
      );
      const driversData = response.data;
      setDrivers(driversData);
    } catch (error) {
      console.error("Error fetching nearby drivers:", error);
    } finally {
      setLoading(false);
    }
  };
  const socket = useSocket();
  const router = useRouter();
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit("registerUser", id);

    const handleBookingAccepted = ({ bookingId }) => {
      router.push(`/user/bookings/${bookingId}`);
    };

    const handleBookingRejected = (bookingDetails) => {
      console.log("Booking rejected:", bookingDetails);
    };

    socket.on("bookingAccepted", handleBookingAccepted);
    socket.on("bookingRejected", handleBookingRejected);

    return () => {
      socket.off("bookingAccepted", handleBookingAccepted);
      socket.off("bookingRejected", handleBookingRejected);
    };
  }, [socket, id, router]);

  const handleRequestToPick = async () => {
    try {
      const bookingData = {
        distance: totalDis,
        duration: totalTime * 60,
        src: {
          coordinates: [startCoordinates.lat, startCoordinates.lng],
        },
        destn: {
          coordinates: [endCoordinates.lat, endCoordinates.lng],
        },
        price,
        srcText,
        destnText,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/create`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const driverIds = drivers.map((driver) => driver._id);
      socket.emit("requestPickup", {
        driverIds,
        bookingData: response.data.booking,
      });

      alert("Pickup request sent to all drivers successfully!");
    } catch (error) {
      console.error("Error requesting pickup:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Price Information
      </h3>
      {price !== null ? (
        <p className="text-xl font-medium text-gray-700 mb-6">
          Estimated Price: <span className="text-blue-500">₹ {price}</span>
        </p>
      ) : (
        <p className="text-gray-600">Calculating price...</p>
      )}

      <div className="mt-4">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">
          Nearby Drivers
        </h4>
        {loading ? (
          <div className="mt-8 flex flex-row justify-center items-center">
            <ClipLoader
              className="mt-8"
              color="#3b82f6"
              loading={loading}
              size={40}
            />
          </div>
        ) : drivers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {drivers.map((driver) => (
              <div
                key={driver._id}
                className="flex justify-between items-center p-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <span className="text-xl font-semibold text-white">
                      {driver.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold text-gray-800">
                      {driver.name}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Vehicle: {driver.vehicleDetails?.type || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {driver.dist.calculated.toFixed(2)} km away
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No drivers found.</p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleRequestToPick}
          className="w-full bg-blue-500 text-white text-sm px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Request to Pick
        </button>
      </div>
    </div>
  );
};

export default NearByCard;
