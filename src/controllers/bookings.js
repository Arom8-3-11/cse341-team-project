//src/controllers/bookings.js
import {
  createBooking,
  getAllBookings as findAllBookings,
  getBookingById as findBookingById,
} from "../models/bookings.js";
import { getScheduleById } from "../models/schedules.js";
import { getTripById as findTripById } from "../models/trips.js";
import { generateConfirmationCode } from "../includes/helpers.js";
import { getDb } from "../db/connect.js";

/* ------------------------- API controllers ------------------------- */

export async function getAllBookings(req, res) {
  try {
    const bookings = await findAllBookings();

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return res.status(500).json({
      error: "Failed to fetch bookings",
    });
  }
}

/* ------------------------- EJS controllers ------------------------- */

export async function bookingPage(req, res, next) {
  try {
    const { scheduleId } = req.params;

    const schedule = await getScheduleById(Number(scheduleId));

    if (!schedule) {
      const err = new Error("Schedule Not Found");
      err.status = 404;
      return next(err);
    }

    const trip = await findTripById(schedule.tripId);

    // TODO (Feature Set 4): use the ticket-class model functions here.
    const ticketClasses = await getDb()
      .collection("ticketClasses")
      .find({})
      .toArray();

    const ticketOptions = ticketClasses.map((ticketClass) => ({
      class: ticketClass.class,
      name: ticketClass.name,
      price: trip.distance * ticketClass.pricePerKm,
      amenities: ticketClass.amenities,
      description: ticketClass.description,
    }));

    return res.render("trips/book", {
      title: "Book Trip",
      schedule,
      ticketOptions,
    });
  } catch (error) {
    return next(error);
  }
}

export async function processBookingRequest(req, res, next) {
  try {
    const booking = await createBooking({
      id: generateConfirmationCode(),
      ...req.body,
    });

    return res.redirect(`/trips/confirmation/${booking.id}`);
  } catch (error) {
    return next(error);
  }
}

export async function bookingConfirmationPage(req, res, next) {
  try {
    const { bookingId } = req.params;

    const booking = await findBookingById(bookingId);

    if (!booking) {
      const err = new Error("Booking Not Found");
      err.status = 404;
      return next(err);
    }

    return res.render("trips/confirm", {
      title: "Trip Confirmation",
      booking,
    });
  } catch (error) {
    return next(error);
  }
}

// The bookings list is hydrated on the client from /api/bookings,
// so this controller only needs to render the page shell.
export function bookingsAdminPage(req, res) {
  return res.render("bookings", { title: "Bookings Admin" });
}
