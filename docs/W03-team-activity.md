# W03 Team Activity Plan

This document tracks the Week 03 team coordination activity only. It does not assign or implement the Week 03 programming assignment.

## Status

Draft for team confirmation. One person is currently active in this repository; the full team roster and team size are not yet confirmed. Do not treat any feature owner or infrastructure owner below as assigned until the team confirms it.

## Shared setup

| Task | Owner | Status |
|---|---|---|
| Create the team's Render project and deploy this repository | TBD | Not started |
| Connect the Render service to the team's GitHub repository | TBD | Not started |
| Give each teammate permission to view the Render project and deployment logs | TBD | Not started |
| Create the team's MongoDB Atlas cluster | TBD | Not started |
| Configure Atlas access for Render and teammates' local environments; the activity instructions specify `0.0.0.0/0` | TBD | Not started |
| Configure the deployed app and local `.env` files to use the same database | TBD | Not started |
| Share the MongoDB connection string privately by Teams DM; never commit or post it in the repository | TBD | Not started |
| Post the setup plan in the Microsoft Teams channel | TBD | Not started |

## Feature ownership

Assign one owner to each required feature set before assigning optional sets. Update the table after the team confirms its roster.

| Feature set | Required team size | Owner | Coordination |
|---|---:|---|---|
| 1 — Trips | All teams | TBD | Establish the trip API and move the trip EJS controllers/routes. |
| 2 — Schedules | All teams | TBD | Coordinate its trip-details controller and page changes with Set 1. |
| 3 — Bookings | All teams | TBD | Required before Set 4 can refactor the booking-page controller. |
| 4 — Ticket Classes | 4 or more | TBD / Not applicable until team size is confirmed | Builds on the booking-page controller moved by Set 3. |
| 5 — Stations | 5 | TBD / Not applicable until team size is confirmed | Coordinate trip-details page and API-route changes with Sets 1 and 2. |

The team should agree on implementation order for shared files and communicate it in Teams. Sets 2 and 5 both touch the trip-details page, and multiple sets add API routes; Set 3 must move the booking-page controller before Set 4 can refactor it.

## Week 04 PR reviews

Proposed agreement for the team to confirm in Teams:

- Announce each review-ready PR in the team channel with its link, issue, and a short summary.
- Each person completes at least two reviews at the beginning of Week 04.
- Ensure every PR receives a review; authors respond to review feedback before later integration work.
- PR descriptions link the issue, summarize the change, include verified test notes, and link the walkthrough video.

## Team confirmation checklist

- [ ] Confirm the full roster and team size.
- [ ] Assign owners for Sets 1, 2, and 3; assign Set 4 at four people and Set 5 at five people.
- [ ] Assign owners and target dates for Render and Atlas setup.
- [ ] Confirm the PR announcement and review agreement.
- [ ] Post the setup plan, feature owners/dependencies, and review plan in Microsoft Teams.
- [ ] Complete the Render and MongoDB setup tasks and verify team access.
