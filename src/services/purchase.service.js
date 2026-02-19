import TicketRepository from "../repositories/ticket.repository.js";
import TicketDAO from "../dao/ticket.dao.js";

export default class PurchaseService {
  constructor() {
    this.ticketRepository = new TicketRepository(new TicketDAO());
  }

  async purchase(cartProducts, userEmail) {

    let totalAmount = 0;

    for (const item of cartProducts) {

      const product = item.product;

      if (!product) continue;

      if (product.stock >= item.quantity) {

        product.stock -= item.quantity;
        await product.save();

        totalAmount += product.price * item.quantity;
      }
    }

    const ticket = await this.ticketRepository.createTicket({
      code: Math.random().toString(36).substring(2, 10),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userEmail
    });

    return ticket;
  }
}