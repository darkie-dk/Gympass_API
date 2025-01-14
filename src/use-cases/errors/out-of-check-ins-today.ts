export class OutOfCheckInsForToday extends Error {
  constructor() {
    super('You ran out of check-ins for today.')
  }
}
