import mongoose from "mongoose";

export interface IShop {
  _id?: mongoose.Types.ObjectId;

  ownerId: mongoose.Types.ObjectId;

  shopName: string;

  ownerName: string;

  email: string;

  mobile: string;

  category: string;

  address: string;

  location: {
    type: string;
    coordinates: number[];
  };

  deliveryRadius: number;

  openingTime: string;

  closingTime: string;

  shopImage?: string;

  status: "pending" | "approved" | "rejected" | "suspended";

isActive: boolean;

isOpen: boolean;

rating: number;
}

const shopSchema = new mongoose.Schema(
  {
    ownerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  unique: true,
},

    shopName: {
      type: String,
      required: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    deliveryRadius: {
      type: Number,
      default: 5000,
    },

    openingTime: String,

    closingTime: String,

    shopImage: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: false,
    },
    isOpen: {
  type: Boolean,
  default: true,
},

rating: {
  type: Number,
  default: 0,
},
  },
  {
    timestamps: true,
  }
);

shopSchema.index({
  location: "2dsphere",
});

shopSchema.index({
  status: 1,
});

shopSchema.index({
  ownerId: 1,
});

const Shop =
  mongoose.models.Shop ||
  mongoose.model<IShop>("Shop", shopSchema);

export default Shop;