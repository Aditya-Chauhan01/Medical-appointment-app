import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [slots, setSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [patientName, setPatientName] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);

  const clinicInfo = {
    name: "City Medical Clinic",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800",
    address: "123 Main Street, Dehradun",
    phone: "1234567892",
    hours: "09:00 AM - 05:00 PM",
    about:
      "City Medical Clinic provides routine health checkups, general consultations, and preventive healthcare services. Our goal is to provide quality medical care in a comfortable and patient-friendly environment.",
  };

  // Generate next 7 days with fixed 1-hour slots
  const generateSlots = () => {
    let today = new Date();

    let allSlots = [];

    const fixedSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
    ];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const daySlots = fixedSlots.map((time) => ({
        time,
        datetime: currentDate,
      }));

      allSlots.push(daySlots);
    }

    setSlots(allSlots);
  };

  const bookAppointment = async () => {
    try {
      if (!patientName || !reason || !selectedSlot) {
        return alert(
          "Please enter patient name, reason and select a slot."
        );
      }

      setLoading(true);

      const { data } = await axios.post(
        "https://medical-appointment-backend-u05w.onrender.com/api/appointments/book",
        {
          patientName,
          reason,
          slotTime: selectedSlot,
        }
      );

      if (data.success) {
        alert(data.message);

        setPatientName("");
        setReason("");
        setSelectedSlot("");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSlots();
  }, []);

  return (
    <div className="px-4 sm:px-10 py-8">

      {/* Clinic Details */}

      <div className="flex flex-col sm:flex-row gap-4">

        <div>
          <img
            className="w-full sm:max-w-72 rounded-lg"
            src={clinicInfo.image}
            alt="clinic"
          />
        </div>

        <div className="flex-1 border border-gray-300 rounded-lg p-8 bg-white">

          <h1 className="text-3xl font-semibold text-gray-800">
            {clinicInfo.name}
          </h1>

          <div className="mt-3 text-gray-600">
            <p>📍 {clinicInfo.address}</p>
            <p className="mt-2">
              📞 {clinicInfo.phone}
            </p>
            <p className="mt-2">
              🕒 {clinicInfo.hours}
            </p>
          </div>

          <div className="mt-5">
            <p className="font-medium text-gray-800">
              About Clinic
            </p>

            <p className="text-gray-500 mt-2">
              {clinicInfo.about}
            </p>
          </div>

        </div>

      </div>

      {/* Booking Slots */}

      <div className="sm:ml-72 sm:pl-4 mt-10">

        <p className="font-medium text-gray-700 text-lg">
          Booking Slots
        </p>

        {/* Days */}

        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">

          {slots.map((item, index) => (
            <div
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index
                  ? "bg-blue-500 text-white"
                  : "border border-gray-200"
              }`}
            >
              <p>
                {daysOfWeek[
                  item[0].datetime.getDay()
                ]}
              </p>

              <p>
                {item[0].datetime.getDate()}
              </p>
            </div>
          ))}

        </div>

        {/* Time Slots */}

        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">

          {slots.length > 0 &&
            slots[slotIndex]?.map((item, index) => (
              <p
                key={index}
                onClick={() =>
                  setSelectedSlot(item.time)
                }
                className={`text-sm px-5 py-2 rounded-full cursor-pointer border ${
                  selectedSlot === item.time
                    ? "bg-blue-500 text-white border-blue-500"
                    : "text-gray-500 border-gray-300"
                }`}
              >
                {item.time}
              </p>
            ))}

        </div>

        {/* Appointment Form */}

        <div className="max-w-xl mt-8">

          <input
            type="text"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) =>
              setPatientName(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 outline-none"
          />

          <textarea
            rows="4"
            placeholder="Reason for Appointment"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-3 outline-none"
          />

        </div>

        <button
          onClick={bookAppointment}
          disabled={loading}
          className="bg-blue-500 text-white px-14 py-3 rounded-full my-6 cursor-pointer"
        >
          {loading
            ? "Booking..."
            : "Book Appointment"}
        </button>

      </div>

    </div>
  );
};

export default Home;

