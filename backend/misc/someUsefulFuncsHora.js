module.exports = function correctTimezone(date) {
  date.setTime(date.getTime() - 6 * 60 * 60 * 1000); // Subtrai 6 horas em milissegundos
  return date;
};
