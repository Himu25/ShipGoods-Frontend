"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import NearByCard from "./NearByCard";

const LeafletMap = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [suggestionsPickup, setSuggestionsPickup] = useState([]);
  const [suggestionsDropoff, setSuggestionsDropoff] = useState([]);
  const [routeControl, setRouteControl] = useState(null);
  const [routeDetails, setRouteDetails] = useState({
    distance: 0,
    duration: 0,
  });
  const [carType, setCarType] = useState("car");
  const [pickupText, setPickupText] = useState("");
  const [dropoffText, setDropoffText] = useState("");

  const handleCarTypeChange = (e) => {
    setCarType(e.target.value);
  };

  const mapRef = useRef(null);

  const customMarkerIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/color/48/marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation = { lat: latitude, lng: longitude };
        setPickupLocation(currentLocation);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 13);
        }
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
  }, []);

  useEffect(() => {
    if (mapRef.current && pickupLocation && dropoffLocation) {
      const map = mapRef.current;
      if (routeControl) {
        map.removeControl(routeControl);
      }

      const newRouteControl = L.Routing.control({
        waypoints: [
          L.latLng(pickupLocation.lat, pickupLocation.lng),
          L.latLng(dropoffLocation.lat, dropoffLocation.lng),
        ],
        routeWhileDragging: true,
        createMarker: () => null,
      }).addTo(map);

      newRouteControl.on("routesfound", (e) => {
        const route = e.routes[0];
        const distanceInKm = (route.summary.totalDistance / 1000).toFixed(2);
        const timeInMinutes = (route.summary.totalTime / 60).toFixed(2);

        setRouteDetails({ distance: distanceInKm, duration: timeInMinutes });

        const bounds = L.latLngBounds(route.coordinates);
        map.fitBounds(bounds);
      });

      setRouteControl(newRouteControl);
    }
  }, [pickupLocation, dropoffLocation]);

  const handleSearch = async (query, isPickup = true) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
    );
    const data = await response.json();

    if (isPickup) {
      setSuggestionsPickup(data);
    } else {
      setSuggestionsDropoff(data);
    }
  };

  const handleSelectLocation = (location, isPickup = true) => {
    const latLng = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    };
    if (isPickup) {
      setPickupLocation(latLng);
      setPickupText(location.display_name);
      setSuggestionsPickup([]);
    } else {
      setDropoffLocation(latLng);
      setDropoffText(location.display_name);
      setSuggestionsDropoff([]);
    }
    mapRef.current?.setView([latLng.lat, latLng.lng], 13);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <div
        className="md:w-1/3 w-full p-6 bg-white shadow-lg relative z-20 overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Select Locations
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Pick-up Location"
            className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            onChange={(e) => handleSearch(e.target.value, true)}
          />
          {suggestionsPickup.length > 0 && (
            <ul className="absolute z-30 bg-white border border-gray-300 rounded-lg mt-1 w-[90%] max-h-48 overflow-y-auto shadow-lg">
              {suggestionsPickup.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="p-2 cursor-pointer hover:bg-blue-100 text-gray-600"
                  onClick={() => handleSelectLocation(suggestion, true)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Drop-off Location"
            className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            onChange={(e) => handleSearch(e.target.value, false)}
          />
          {suggestionsDropoff.length > 0 && (
            <ul className="absolute z-30 bg-white border border-gray-300 rounded-lg mt-1 w-[90%] max-h-48 overflow-y-auto shadow-lg">
              {suggestionsDropoff.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="p-2 cursor-pointer hover:bg-blue-100 text-gray-600"
                  onClick={() => handleSelectLocation(suggestion, false)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-semibold">
            Select Car Type:
          </label>
          <select
            className="p-3 border border-gray-300 rounded-lg w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            value={carType}
            onChange={handleCarTypeChange}
          >
            <option value="car">Car</option>
            <option value="truck">Truck</option>
            <option value="bus">Bus</option>
            <option value="motorcycle">Motorcycle</option>
          </select>
        </div>
        {pickupLocation && dropoffLocation && (
          <NearByCard
            totalDis={routeDetails.distance}
            totalTime={routeDetails.duration}
            startCoordinates={pickupLocation}
            endCoordinates={dropoffLocation}
            srcText={pickupText}
            destnText={dropoffText}
            vehicleType={carType}
          />
        )}
      </div>
      <div className="md:w-2/3 w-full h-full relative">
        <MapContainer
          center={
            pickupLocation
              ? [pickupLocation.lat, pickupLocation.lng]
              : [51.505, -0.09]
          }
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          ref={(mapInstance) => {
            mapRef.current = mapInstance ? mapInstance : null;
          }}
          className="rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {pickupLocation && (
            <Marker
              position={[pickupLocation.lat, pickupLocation.lng]}
              icon={customMarkerIcon}
            />
          )}
          {dropoffLocation && (
            <Marker
              position={[dropoffLocation.lat, dropoffLocation.lng]}
              icon={customMarkerIcon}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default LeafletMap;
