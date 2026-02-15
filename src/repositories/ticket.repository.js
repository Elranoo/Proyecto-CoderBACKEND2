export default class TicketRepository {
  constructor(dao) { this.dao = dao; }
  createTicket = ticket => this.dao.create(ticket);
}