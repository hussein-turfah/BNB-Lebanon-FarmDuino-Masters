const express = require("express");
const app = express();
const router = express.Router();
const ItemRoute = require('./itemRoute')
router.use(express.json());

router.use("/item", ItemRoute); 

module.exports = router;

