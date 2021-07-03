module.exports = function error(err, req, res, next) {
  console.log(err)
  if (err.code) return res.status(err.code).json({ message: err.message })

  const [ValidationErrorItem] = err.errors
}