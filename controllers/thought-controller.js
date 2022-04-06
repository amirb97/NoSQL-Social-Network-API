const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .select('-__V')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(400).json(err));
    },

    // get one thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
          .select('-__V')
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found with this id' });
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
    },

    // create a thought
    createThought({ params, body }, res)  {
        Thought.create(body)
          .then(({ _id }) => {
              return User.findByIdAndUpdate(
                  { _id: params.userId },
                  { $push: { thoughts: _id }},
                  { new: true }
              );
          })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
    },

    // update a thought by id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { thoughtText: body.thoughtText },
            { new: true, runValidators: true })
          .then(dbThoughtData => {
              if (!dbThoughtData) {
                  res.status(404).json({ message: 'No thought found wiht this id' })
                  return;
              }
              res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
    },

    // delete a thought by id
    deleteThought({ params }, res) {
        Thought.findByIdAndDelete({ _id: params.id })
          .then( dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found wiht this id' })
                return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
    },

    // add a reaction to a thought
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $push: { reactions: body } },
            { new: true,  runValidators: true }
        )
          .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found wiht this id' })
                return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
    },

    // delete a reaction
    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtID },
            { $pull: { reactions: body } },
            { new: true, runValidators: true }
        )
          .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found wiht this id' })
                return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(400).json(err));
    }
}

module.exports = thoughtController;
