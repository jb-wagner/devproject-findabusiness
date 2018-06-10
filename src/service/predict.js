const Clarifai = require('clarifai');

const app = new Clarifai.App(
  'NO18sIhXk9nZDkAdVXNPSThzPXPI8wHn78vAncxe',
  'c2vHENnTnNj6XdFkXCEWbG1g1oSdBmTqOTO44eP9'
);

export default function predict(url, success, error) {
  // Predict the contents of an image by passing in a url
  return app.models.predict(Clarifai.GENERAL_MODEL, url).then(
    function (response) {
      success(response);
    },
    function (err) {
      error(err);
    }
  )
}