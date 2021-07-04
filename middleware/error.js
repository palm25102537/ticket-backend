module.exports = error = (err, req, res, next) => {
  console.log(err)
  if (err.code) return res.status(err.code).json({ message: err.message })

  const [ValidationErrorItem] = err.errors

  if (ValidationErrorItem.message === "user.username must be unique" || ValidationErrorItem.message === "user.email must be unique")
    return res.status(400).send(`Username and email must be unique`)
  res.status(500).json({ message: err.message })
}