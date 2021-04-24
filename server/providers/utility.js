const _cleverThings = [
  "I'm starting to get impatient here.. Anyway the answer is - ",
  "Guys, we've already been through this!! It's ",
  "How many times can I say this? It's ",
  "Honestly I thought you'll be smarter.. It's ",
  "Don't you just love saying the same things over and over again? It's ",
  "PLEAAAASE stop asking that.. It's "
];

function cleverify(message) {
  return (
    _cleverThings[Math.floor(Math.random() * _cleverThings.length)] + message
  );
}

module.exports = { cleverify };
