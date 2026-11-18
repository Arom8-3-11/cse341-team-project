//src/models/schedules.js.
import schedule from "./schemas/schedules.js";
import trip from "./schemas/trips.js";

/**
 * Returns the schedules for a trip, optionally restricted to a month.
 *
 * Schedules do not carry month information themselves; a trip only runs
 * during its operatingMonths. So when a month is provided, the schedules
 * are returned only if the trip operates during that month, otherwise an
 * empty array is returned.
 *
 * @param {string} tripId - The trip ID.
 * @param {number} [month] - Optional month number (1-12).
 */
export async function getSchedulesByTripId(tripId, month) {
  if (month !== undefined) {
    const matchingTrip = await trip
      .findOne({ id: tripId, operatingMonths: month })
      .lean();

    if (!matchingTrip) {
      return [];
    }
  }

  return schedule.find({ tripId }).lean();
}
