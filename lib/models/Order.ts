import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  attributes?: {
    hairColor?: string;
    eyeColor?: string;
    size?: string;
  };
}

export interface IOrderStatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
  triggeredBy?: string;
}

export interface IOrder extends Document {
  orderReference: string;
  items: IOrderItem[];
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  shipping: {
    address: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
    preferredShippingMethod?: string;
  };
  payment: {
    preferredMethod: string;
    customMethod?: string;
    status: "pending" | "deposit_received" | "paid" | "refunded";
    depositAmount?: number;
    totalAmount: number;
  };
  status: "new" | "awaiting_deposit" | "paid" | "in_progress" | "shipped" | "completed" | "cancelled";
  statusHistory: IOrderStatusHistory[];
  notes?: string;
  customNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  attributes: {
    hairColor: String,
    eyeColor: String,
    size: String,
  },
});

const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: String,
  triggeredBy: String,
});

const OrderSchema = new Schema<IOrder>(
  {
    orderReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
    },
    shipping: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      preferredShippingMethod: String,
    },
    payment: {
      preferredMethod: { type: String, required: true },
      customMethod: String,
      status: {
        type: String,
        enum: ["pending", "deposit_received", "paid", "refunded"],
        default: "pending",
      },
      depositAmount: Number,
      totalAmount: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: [
        "new",
        "pending",
        "awaiting_deposit",
        "confirmed",
        "paid",
        "in_progress",
        "shipped",
        "completed",
        "cancelled",
      ],
      default: "new",
    },
    statusHistory: {
      type: [OrderStatusHistorySchema],
      default: [],
    },
    notes: String,
    customNotes: String,
  },
  {
    timestamps: true,
  }
);

// Index for queries
OrderSchema.index({ "customer.email": 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Generate order reference before saving
// Generate order reference before validation
OrderSchema.pre("validate", async function (next) {
  if (!this.orderReference) {
    const count = await mongoose.models.Order?.countDocuments() || 0;
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    this.orderReference = `RB${date}${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Add status to history when status changes
OrderSchema.pre("save", function (next) {
  if (this.isModified("status") && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

