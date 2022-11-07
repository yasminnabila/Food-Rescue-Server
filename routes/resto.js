const express = require("express");
const router = express.Router();
const Resto = require("../controllers/resto");
const { authentication, authenticationResto } = require("../middleware/authentication");
const {authorizationResto} = require("../middleware/authorization");

router.post("/restaurants", authentication, Resto.createRestaurant);

router.use(authenticationResto);
router.get("/food/", Resto.showFood);
router.get("/food/:id", authorizationResto, Resto.detailFood);
router.post("/food/", Resto.addFood);
router.delete("/food/:id", authorizationResto, Resto.deleteFood);
router.put("/food/:id", authorizationResto, Resto.editFood);
router.patch("/food/food-status/:id", authorizationResto, Resto.statusFood);
router.patch("/food/food-active/:id", authorizationResto, Resto.activeFood);

router.get("/restaurants", Resto.myRestaurant)
router.put("/restaurants", authorizationResto, Resto.editRestaurant)
router.delete("/restaurants", authorizationResto, Resto.deleteRestaurant)

router.get("/order", Resto.allOrder)

module.exports = router;