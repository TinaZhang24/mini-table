const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

// TODO: routes!
// GET/restaurants should send an array of all restaurants.
router.get("/", async (req, res, next) => {
    try {
      const restaurants = await prisma.restaurant.findMany();
      res.json(restaurants);
    } catch (e) {
      next(e);
    }
  });

  //GET /restaurants/:id should send the restaurant specified by id.
  router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
      // We can throw an error instead of checking for a null restaurant
      const restaurant = await prisma.restaurant.findUniqueOrThrow({
        where: { id: +id },
        include: { reservations: true },
      });
      res.json(restaurant);
    } catch (e) {
      next(e);
    }
  });

  //POST /restaurants/:id/reservations should make a new reservation for the restaurant specified by id.
  router.post("/:id/reservations", async (req, res, next) => {
    const { id } = req.params;
    const { name, email, partySize } = req.body;
    try {
      // partySize and restaurantId have been converted to numbers
      const reservation = await prisma.reservation.create({
        data: { name, email, partySize: +partySize, restaurantId: +id },
      });
      res.status(201).json(reservation);
    } catch (e) {
      next(e);
    }
  });