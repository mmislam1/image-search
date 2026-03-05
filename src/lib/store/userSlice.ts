// features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store.ts";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserProfile {
  userId: string;
  name: string;
  email: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  isAdult: boolean;
}

export interface SignInPayload {
  email: string;
  password: string;
}

interface UserState {
  user: UserProfile | null;
  token: string | null;
  signupStatus: "idle" | "loading" | "success" | "error";
  signinStatus: "idle" | "loading" | "success" | "error";
  emailVerifyStatus: "idle" | "loading" | "success" | "error";
  error: string | null;
}

// ─── Fake API (replace with real endpoints) ───────────────────────────────────
const api = {
  verifyEmail: (email: string) =>
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(r => { if (!r.ok) throw new Error("VERIFY_FAILED"); return r.json(); }),

  signup: (payload: SignUpPayload) =>
    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(r => { if (!r.ok) throw new Error("SIGNUP_FAILED"); return r.json(); }),

  signin: (payload: SignInPayload) =>
    fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(r => { if (!r.ok) throw new Error("INVALID_CREDENTIALS"); return r.json(); }),

  googleAuth: () =>
    fetch("/api/auth/google", { method: "POST" })
      .then(r => { if (!r.ok) throw new Error("GOOGLE_FAILED"); return r.json(); }),
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────
export const verifyEmailThunk = createAsyncThunk(
  "user/verifyEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      return await api.verifyEmail(email);
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const signUpThunk = createAsyncThunk(
  "user/signUp",
  async (payload: SignUpPayload, { rejectWithValue }) => {
    try {
      return await api.signup(payload);              // { user, token }
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const signInThunk = createAsyncThunk(
  "user/signIn",
  async (payload: SignInPayload, { rejectWithValue }) => {
    try {
      return await api.signin(payload);              // { user, token }
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const googleAuthThunk = createAsyncThunk(
  "user/googleAuth",
  async (_, { rejectWithValue }) => {
    try {
      return await api.googleAuth();
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const initialState: UserState = {
  user: null,
  token: null,
  signupStatus: "idle",
  signinStatus: "idle",
  emailVerifyStatus: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.signupStatus = "idle";
      state.signinStatus = "idle";
      state.emailVerifyStatus = "idle";
      state.error = null;
    },
    resetAuthStatus(state) {
      state.signupStatus = "idle";
      state.signinStatus = "idle";
      state.emailVerifyStatus = "idle";
      state.error = null;
    },
    resetEmailVerify(state) {
      state.emailVerifyStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    // ── verifyEmail ──
    builder
      .addCase(verifyEmailThunk.pending, (state) => {
        state.emailVerifyStatus = "loading";
      })
      .addCase(verifyEmailThunk.fulfilled, (state) => {
        state.emailVerifyStatus = "success";
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.emailVerifyStatus = "error";
        state.error = action.payload as string;
      });

    // ── signUp ──
    builder
      .addCase(signUpThunk.pending, (state) => {
        state.signupStatus = "loading";
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.signupStatus = "success";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.signupStatus = "error";
        state.error = action.payload as string;
      });

    // ── signIn ──
    builder
      .addCase(signInThunk.pending, (state) => {
        state.signinStatus = "loading";
        state.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.signinStatus = "success";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.signinStatus = "error";
        state.error = action.payload as string;
      });

    // ── googleAuth (shared signin flow) ──
    builder
      .addCase(googleAuthThunk.pending, (state) => {
        state.signinStatus = "loading";
        state.error = null;
      })
      .addCase(googleAuthThunk.fulfilled, (state, action) => {
        state.signinStatus = "success";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(googleAuthThunk.rejected, (state, action) => {
        state.signinStatus = "error";
        state.error = action.payload as string;
      });
  },
});

export const { logout, resetAuthStatus, resetEmailVerify } = userSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectUser              = (s: RootState) => s.user.user;
export const selectToken             = (s: RootState) => s.user.token;
export const selectSignupStatus      = (s: RootState) => s.user.signupStatus;
export const selectSigninStatus      = (s: RootState) => s.user.signinStatus;
export const selectEmailVerifyStatus = (s: RootState) => s.user.emailVerifyStatus;
export const selectAuthError         = (s: RootState) => s.user.error;
export const selectIsAuthenticated   = (s: RootState) => !!s.user.token;

export default userSlice.reducer;