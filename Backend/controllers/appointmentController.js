import { appointments } from "../data/appointments.js";
import { slotLocks } from "../utils/lockManager.js";
import { ALL_SLOTS } from "../config/slots.js";

// Get all slots
export const getSlots = (req, res) => {
  try {

    const slots = ALL_SLOTS.map((slot) => {

      const isBooked = appointments.some(
        (appointment) => appointment.slotTime === slot
      );

      return {
        time: slot,
        available: !isBooked
      };
    });

    res.status(200).json({
      success: true,
      slots
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Book appointment
export const bookAppointment = (req, res) => {

  try {

    const { patientName, reason, slotTime } = req.body;

    // Check empty fields
    if (!patientName || !reason || !slotTime) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      });
    }

    // Check valid slot
    if (!ALL_SLOTS.includes(slotTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid slot selected"
      });
    }

    // Prevent simultaneous booking
    if (slotLocks.has(slotTime)) {
      return res.status(409).json({
        success: false,
        message: "Someone is booking this slot. Please try again."
      });
    }

    slotLocks.add(slotTime);

    // Check if slot already booked
    const alreadyBooked = appointments.find(
      (appointment) => appointment.slotTime === slotTime
    );

    if (alreadyBooked) {

      slotLocks.delete(slotTime);

      return res.status(409).json({
        success: false,
        message: "Slot already booked"
      });
    }

    const newAppointment = {
      id: Date.now(),
      patientName,
      reason,
      slotTime
    };

    appointments.push(newAppointment);

    slotLocks.delete(slotTime);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment
    });

  } catch (error) {

    slotLocks.delete(req.body.slotTime);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};