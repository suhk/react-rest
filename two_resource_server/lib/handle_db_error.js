module.exports = function(err, res) {
  console.log(err);
  res.status = 500;
  res.body = {msg: 'server error'};
};
