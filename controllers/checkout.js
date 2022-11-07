const {OrderItem, Payment, Balance, sequelize} = require('../models');

class Controller{
  static async createCheckout(req, res, next){
    const t = await sequelize.transaction()
    try {
      let data;
      const {order, is_delivery, total} = req.body
      if(is_delivery == 'Delivery'){
        data = await Payment.create({
          deliveryFee: 10000,
          UserId: req.user.id,
          status: "paid",
          paymentCode: (new Date()).toString(),
          is_delivery
        }, {transaction: t})
      } else {
        data = await Payment.create({
          deliveryFee: 0,
          UserId: req.user.id,
          status: "paid",
          paymentCode: (new Date()).toString(),
          is_delivery
        }, {transaction: t})
      }
      const orderInput = order.map(x => {
        return { FoodId: x.FoodId, PaymentId: data.id, itemPrice: x.itemPrice, quantity: x.qty, comition: 0 };
      });
      await OrderItem.bulkCreate(orderInput, {transaction: t})
      const findUser = await Balance.findOne({where: {UserId: req.user.id}}, {transaction: t})
      if(findUser.balance < total) throw {"name": "Top up first"}
      await Balance.update({balance: +findUser.balance - +total}, {where: {UserId: req.user.id}}, {transaction: t})
      console.log("test")
      await t.commit()
      res.status(201).json({"message": "payment success"})
    } catch (error) {
      await t.rollback();
      next(error)
    }
  }
  static async allOrder(req, res, next){
    try {
      const data = await Payment.findAll({
        include: [{
          model: OrderItem,
        }],
        where: {UserId: req.user.id}
      })
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = Controller