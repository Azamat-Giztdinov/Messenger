const {formSchema} = require("@messenger-clone/common")

const validateForm = (req, res) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch(err => {
      res.status(422).send();
      console.log(err.errors);
    })
    .then(valid => {
      if (valid) {
        console.log("form is good");
      }
    });
};

module.exports = validateForm;