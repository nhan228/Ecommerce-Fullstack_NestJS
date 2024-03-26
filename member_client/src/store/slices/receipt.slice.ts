import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./product.slice"
import { User } from "./user.slice";

export interface Receipt {
  id: number;
  total: number;
  createAt: string;
  updateAt: string;
  paid: boolean;
  paidAt?: string | null;
  payMode: PayMode;
  userId: number;
  status: ReceiptStatus;
  pending?: string | null;
  acceptAt?: string | null;
  shippingAt?: string | null;
  doneAt?: string | null;
  user?: User;
  usersId?: number | null;
  detail: ReceiptDetail[];
}

interface ReceiptDetail {
  id: number;
  receiptId: number;
  productId: number;
  quantity: number;
  note: string;
  product: Product;
  receipt: Receipt;
}

enum ReceiptStatus {
  SHOPPING = "shopping",
  PENDING = "pending",
  ACCEPTED = "accepted",
  SHIPPING = "shipping",
  DONE = "done",
  DELETE = "delete",
}

enum PayMode {
  ZALO_PAY = "zalo_pay",
  CASH = "cash",
}

interface ReceiptState {
  cart: Receipt | null;
  receipts: Receipt[];
  allReceipts: Receipt[];
}

const initialState: ReceiptState = {
  cart: null,
  receipts: [],
  allReceipts: [],
};

const receiptSlice = createSlice({
  name: "receipt",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Receipt | null>) => {
      state.cart = action.payload;
    },
    setReceipt: (state, action: PayloadAction<Receipt[]>) => {
      state.receipts = action.payload;
    },
    setAll: (state, action: PayloadAction<Receipt[]>) => {
      state.allReceipts = action.payload;
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      if (state.cart) {
        state.cart.detail = state.cart.detail.filter(
          (item) => item.id != action.payload
        );
      }
    },
    updateItem: (
      state,
      action: PayloadAction<{ itemId: number; quantity: number }>
    ) => {
      if (state.cart) {
        state.cart.detail = state.cart.detail.map((item) => {
          if (item.id == action.payload.itemId) {
            return {
              ...item,
              quantity: action.payload.quantity,
            };
          }
          return item;
        });
      }
    },
    update: (state, action: PayloadAction<Receipt>) => {
      state.receipts = state.receipts.map((item) =>
        item.id == action.payload.id ? action.payload : item
      );
    },
    addReceipt: (state, action: PayloadAction<Receipt>) => {
      state.receipts.unshift(action.payload);
    },
  },
})

export const receiptReducer = receiptSlice.reducer;
export const receiptAction = receiptSlice.actions;
