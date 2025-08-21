const {
  createDiscount,
  deleteDiscount,
  updateDiscount,
  getAllDiscount,
} = require("../../models/discount.model");

const httpCreateDicount = async (req, res) => {
  try {
    return res.status(201).json(await createDiscount(req.body));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .status({ message: "Error in Creating Discount", error: error.message });
  }
};
const httpDeleteDiscount = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDiscount = await deleteDiscount(id);
    return res.status(200).json({
      message: "Discount deleted successfully",
      deletedDiscount,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error deleting discount",
      error: err.message,
    });
  }
};
const httpUpdateDiscount = async (req, res) => {
  try {
    const updatedDiscount = await updateDiscount({
      id: req.params.id,
      ...req.body,
    });
    if (!updatedDiscount) {
      return res.status(404).send({ message: "Discount not found" });
    }
    return res.status(200).json(updatedDiscount);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error in updating Discount", error: err.message });
  }
};
const httpGetAllDiscounts = async (req, res) => {
  try {
    return res.status(201).send(await getAllDiscount());
  } catch (error) {
    return res
      .status(500)
      .send({ message: "error in reading discounts", error: error.message });
  }
};

module.exports = {
  httpCreateDicount,
  httpDeleteDiscount,
  httpUpdateDiscount,
  httpGetAllDiscounts,
};
