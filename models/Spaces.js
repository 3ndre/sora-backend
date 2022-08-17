const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpacesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId
  },
  tokenId: {
    type: Number,
  },
  creatorAddress: {
    type: String,
  },
  signature: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String
  },
  contractAddress: {
    type: String
  },
  category: {
    type: String
  },
  type: {
    type: String
  },
  supply: {
    type: Number,
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
  },
  posts: [
    {
      user: {
        type: Schema.Types.ObjectId
      },
      text: {
        type: String,
      },
      wallet: {
        type: String
      },
      members: {
        type: String
      },
      signature: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  moderators: [
    {
      wallet: {
        type: String
      },
    }
  ],
  drops: [
    {
      user: {
        type: Schema.Types.ObjectId
      },
      dropId: {
        type: Number,
      },
      creatorAddress: {
        type: String,
      },
      signature: {
        type: String,
      },
      name: {
        type: String,
      },
      description: {
        type: String
      },
      supply: {
        type: Number,
      },
      price: {
        type: Number,
      },
      image: {
        type: String,
      },
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('spaces', SpacesSchema);
