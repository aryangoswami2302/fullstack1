import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 GET
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await axios.get("http://localhost:3000/Product");
    return res.data;
  }
);

// 🔥 ADD
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (newProduct) => {
    const res = await axios.post("http://localhost:3000/Product", newProduct);
    return res.data;
  }
);

// 🔥 DELETE
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    await axios.delete(`http://localhost:3000/Product/${id}`);
    return id;
  }
);
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product) => {
    const res = await axios.put(
      `http://localhost:3000/Product/${product.id}`,
      product
    );
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = "Error fetching data";
      })

      // ADD
      .addCase(addProduct.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.data = state.data.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
  },
});

export default productSlice.reducer;