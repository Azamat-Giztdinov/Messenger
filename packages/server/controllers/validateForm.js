const {formSchema} = require("@messenger-clone/common")

module.exports.validateForm = (req, res, next) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch(() => {
      res.status(422).send();
    })
    .then(valid => {
      if (valid) {

        next();
        console.log("form is good");
        } else {
        console.log("not good");
        res.status(422).send();
      }
    });
};

