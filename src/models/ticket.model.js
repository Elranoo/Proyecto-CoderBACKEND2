import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: String,
  purchase_datetime: Date,
  amount: Number,
  purchaser: String
});

export const TicketModel = mongoose.model("Tickets", ticketSchema);