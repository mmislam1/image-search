import { useState, useEffect, useCallback, useReducer } from "react";
import { Eye, EyeOff, Check, X, Loader2, User, Mail, Lock, ShieldCheck, LogIn, UserPlus } from "lucide-react";

// ─── i18n ────────────────────────────────────────────────────────────────────
const messages = {
  ko: {
    signupTitle:"회원가입", signinTitle:"로그인",
    continueGoogle:"Google 계정으로 계속하기", or:"OR",
    name:"이름", namePlaceholder:"이름을 입력하세요", nameRequired:"이름을 입력하세요.",
    email:"이메일", emailPlaceholder:"이메일을 입력하세요", emailInvalid:"유효한 이메일을 입력하세요.",
    verify:"인증하기", verified:"인증됨", verifying:"인증 중...",
    password:"비밀번호", passwordPlaceholder:"비밀번호를 입력하세요",
    pwAlpha:"영문", pwNum:"숫자", pwSpecial:"특수문자", pwLen:"8자 이상",
    confirmPassword:"비밀번호 확인", confirmPlaceholder:"비밀번호를 다시 입력하세요",
    confirmMatch:"비밀번호 일치", confirmNoMatch:"비밀번호 불일치",
    age18:"만 18세 이상입니다",
    submit:"가입하기", signinSubmit:"로그인", submitting:"처리 중...",
    successSignup:"가입 완료! 🎉", successSignin:"로그인 성공! 👋",
    noAccount:"계정이 없으신가요?", haveAccount:"이미 계정이 있으신가요?",
    goSignup:"회원가입", goSignin:"로그인",
    errorWrong:"오류가 발생했습니다. 다시 시도해 주세요.",
    errorCredentials:"이메일 또는 비밀번호가 올바르지 않습니다.",
    forgotPassword:"비밀번호를 잊으셨나요?",
  },
  en: {
    signupTitle:"Sign Up", signinTitle:"Sign In",
    continueGoogle:"Continue with Google", or:"OR",
    name:"Name", namePlaceholder:"Enter your name", nameRequired:"Name is required.",
    email:"Email", emailPlaceholder:"Enter your email", emailInvalid:"Enter a valid email.",
    verify:"Verify", verified:"Verified", verifying:"Verifying...",
    password:"Password", passwordPlaceholder:"Enter your password",
    pwAlpha:"Letter", pwNum:"Number", pwSpecial:"Symbol", pwLen:"8+ chars",
    confirmPassword:"Confirm Password", confirmPlaceholder:"Re-enter your password",
    confirmMatch:"Passwords match", confirmNoMatch:"Passwords don't match",
    age18:"I am 18 years or older",
    submit:"Create Account", signinSubmit:"Sign In", submitting:"Processing...",
    successSignup:"Account created! 🎉", successSignin:"Welcome back! 👋",
    noAccount:"Don't have an account?", haveAccount:"Already have an account?",
    goSignup:"Sign Up", goSignin:"Sign In",
    errorWrong:"Something went wrong. Please try again.",
    errorCredentials:"Invalid email or password.",
    forgotPassword:"Forgot password?",
  },
};

// ─── Fake API ─────────────────────────────────────────────────────────────────
const fakeApi = {
  verifyEmail: (e) => new Promise(r => setTimeout(() => r({ ok:true }), 1200)),
  signup: (p) => new Promise((res,rej) => setTimeout(() => {
    if (p.email.includes("error")) rej(new Error("SERVER_ERROR"));
    else res({ ok:true, userId:"usr_"+Math.random().toString(36).slice(2,8), name:p.name });
  }, 1800)),
  signin: (p) => new Promise((res,rej) => setTimeout(() => {
    if (p.password === "wrong") rej(new Error("INVALID_CREDENTIALS"));
    else res({ ok:true, userId:"usr_"+Math.random().toString(36).slice(2,8), name:"User" });
  }, 1500)),
  googleAuth: () => new Promise(r => setTimeout(() => r({ ok:true, userId:"google_usr", name:"Google User" }), 1000)),
};

// ─── RTK-style userSlice ──────────────────────────────────────────────────────
const Status = { IDLE:"idle", LOADING:"loading", SUCCESS:"success", ERROR:"error" };

const initialUser = {
  user: null,          // { userId, name }
  signupStatus: Status.IDLE,
  signinStatus: Status.IDLE,
  emailVerifyStatus: Status.IDLE,
  error: null,
};

const A = {
  // email verify
  EV_REQ:"EV_REQ", EV_OK:"EV_OK", EV_ERR:"EV_ERR",
  // signup
  SU_REQ:"SU_REQ", SU_OK:"SU_OK", SU_ERR:"SU_ERR",
  // signin
  SI_REQ:"SI_REQ", SI_OK:"SI_OK", SI_ERR:"SI_ERR",
  // misc
  RESET_STATUS:"RESET_STATUS", LOGOUT:"LOGOUT",
};

function userReducer(state = initialUser, action) {
  switch(action.type) {
    case A.EV_REQ: return { ...state, emailVerifyStatus: Status.LOADING };
    case A.EV_OK:  return { ...state, emailVerifyStatus: Status.SUCCESS };
    case A.EV_ERR: return { ...state, emailVerifyStatus: Status.ERROR };
    case A.SU_REQ: return { ...state, signupStatus: Status.LOADING, error: null };
    case A.SU_OK:  return { ...state, signupStatus: Status.SUCCESS, user: action.payload, error: null };
    case A.SU_ERR: return { ...state, signupStatus: Status.ERROR, error: action.payload };
    case A.SI_REQ: return { ...state, signinStatus: Status.LOADING, error: null };
    case A.SI_OK:  return { ...state, signinStatus: Status.SUCCESS, user: action.payload, error: null };
    case A.SI_ERR: return { ...state, signinStatus: Status.ERROR, error: action.payload };
    case A.RESET_STATUS: return { ...state, signupStatus:Status.IDLE, signinStatus:Status.IDLE, emailVerifyStatus:Status.IDLE, error:null };
    case A.LOGOUT: return initialUser;
    default: return state;
  }
}

// Async thunks
const thunks = {
  verifyEmail: async (email, dispatch) => {
    dispatch({ type:A.EV_REQ });
    try { await fakeApi.verifyEmail(email); dispatch({ type:A.EV_OK }); }
    catch { dispatch({ type:A.EV_ERR }); }
  },
  signup: async (payload, dispatch, t) => {
    dispatch({ type:A.SU_REQ });
    try { const r = await fakeApi.signup(payload); dispatch({ type:A.SU_OK, payload:r }); }
    catch(e) { dispatch({ type:A.SU_ERR, payload: e.message === "SERVER_ERROR" ? t.errorWrong : t.errorWrong }); }
  },
  signin: async (payload, dispatch, t) => {
    dispatch({ type:A.SI_REQ });
    try { const r = await fakeApi.signin(payload); dispatch({ type:A.SI_OK, payload:r }); }
    catch(e) { dispatch({ type:A.SI_ERR, payload: e.message === "INVALID_CREDENTIALS" ? t.errorCredentials : t.errorWrong }); }
  },
  googleAuth: async (dispatch) => {
    dispatch({ type:A.SI_REQ });
    try { const r = await fakeApi.googleAuth(); dispatch({ type:A.SI_OK, payload:r }); }
    catch(e) { dispatch({ type:A.SI_ERR, payload:e.message }); }
  },
};

// ─── Password rules ───────────────────────────────────────────────────────────
const pwRules = [
  { key:"pwAlpha",   test: p => /[a-zA-Z]/.test(p) },
  { key:"pwNum",     test: p => /[0-9]/.test(p) },
  { key:"pwSpecial", test: p => /[^a-zA-Z0-9]/.test(p) },
  { key:"pwLen",     test: p => p.length >= 8 },
];

// ─── Small shared UI ──────────────────────────────────────────────────────────
const Label = ({ text, required }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
    {text} {required && <span className="text-blue-500">*</span>}
  </label>
);

const ErrorBanner = ({ msg }) => msg ? (
  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4">
    <X size={13} className="text-red-500 shrink-0"/>
    <p className="text-xs text-red-500 font-medium">{msg}</p>
  </div>
) : null;

const GoogleBtn = ({ label, onClick, loading }) => (
  <button onClick={onClick} disabled={loading}
    className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition mb-5 disabled:opacity-50">
    {loading ? <Loader2 size={16} className="animate-spin"/> :
      <svg width="17" height="17" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>}
    {label}
  </button>
);

const Divider = ({ label }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="flex-1 h-px bg-gray-200"/>
    <span className="text-xs text-gray-400 font-medium">{label}</span>
    <div className="flex-1 h-px bg-gray-200"/>
  </div>
);

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
const SuccessScreen = ({ message, userId, onReset }) => (
  <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm px-7 py-14 text-center">
    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
      <Check size={32} className="text-green-500"/>
    </div>
    <h2 className="text-2xl font-black text-gray-900 mb-2">{message}</h2>
    <p className="text-sm text-gray-400 mb-6">
      ID: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{userId}</code>
    </p>
    <button onClick={onReset} className="text-sm font-semibold text-blue-500 hover:underline">
      ← Back
    </button>
  </div>
);

// ─── SIGN UP PAGE ─────────────────────────────────────────────────────────────
function SignUpPage({ t, locale, onNavigate }) {
  const [userState, dispatch] = useReducer(userReducer, initialUser);
  const [f, setF] = useState({ name:"", email:"", password:"", confirm:"", isAdult:false });
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [touched, setTouch]     = useState({});

  const touch = k => setTouch(p => ({ ...p, [k]:true }));
  const set   = (k,v) => { setF(p=>({...p,[k]:v})); if(k==="email") dispatch({type:A.EV_REQ, skip:true}), dispatch({type:A.RESET_STATUS}); };

  const emailOk   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  const isVerified = userState.emailVerifyStatus === Status.SUCCESS;
  const pwAllPass  = pwRules.every(r => r.test(f.password));
  const pwMatch    = f.password !== "" && f.password === f.confirm;
  const isLoading  = userState.signupStatus === Status.LOADING;

  const canSubmit = f.name.trim() && emailOk && isVerified && pwAllPass && pwMatch && f.isAdult && !isLoading;

  if (userState.signupStatus === Status.SUCCESS)
    return <SuccessScreen message={t.successSignup} userId={userState.user?.userId}
      onReset={() => { dispatch({type:A.LOGOUT}); setF({name:"",email:"",password:"",confirm:"",isAdult:false}); }} />;

  return (
    <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm px-7 py-10 relative">

      {/* Locale badge */}
      <div className="absolute top-4 left-4 text-xs font-bold text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1 tracking-widest uppercase">
        /{locale}
      </div>

      <h1 className="text-3xl font-black text-center text-gray-900 mb-7 mt-3 tracking-tight">{t.signupTitle}</h1>

      <GoogleBtn label={t.continueGoogle} loading={isLoading}
        onClick={() => thunks.googleAuth(dispatch)} />
      <Divider label={t.or} />

      {/* Name */}
      <div className="mb-4">
        <Label text={t.name} required />
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="text" value={f.name}
            onChange={e => set("name", e.target.value)}
            onBlur={() => touch("name")}
            placeholder={t.namePlaceholder}
            className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-50 focus:border-blue-400 ${touched.name && !f.name.trim() ? "border-red-300":"border-gray-200"}`}/>
        </div>
        {touched.name && !f.name.trim() && <p className="text-xs text-red-400 mt-1">{t.nameRequired}</p>}
      </div>

      {/* Email */}
      <div className="mb-4">
        <Label text={t.email} required />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input type="email" value={f.email}
              onChange={e => { set("email", e.target.value); }}
              onBlur={() => touch("email")}
              placeholder={t.emailPlaceholder}
              className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-50 focus:border-blue-400 ${touched.email && !emailOk ? "border-red-300":"border-gray-200"}`}/>
          </div>
          <button
            onClick={() => emailOk && thunks.verifyEmail(f.email, dispatch)}
            disabled={!emailOk || isVerified || userState.emailVerifyStatus === Status.LOADING}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl transition whitespace-nowrap disabled:cursor-not-allowed
              ${isVerified ? "bg-green-50 text-green-600 border border-green-200"
              : userState.emailVerifyStatus===Status.LOADING ? "bg-blue-50 text-blue-400 border border-blue-100"
              : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`}>
            {userState.emailVerifyStatus===Status.LOADING
              ? <><Loader2 size={11} className="animate-spin"/>{t.verifying}</>
              : isVerified ? <><Check size={11}/>{t.verified}</> : t.verify}
          </button>
        </div>
        {touched.email && !emailOk && <p className="text-xs text-red-400 mt-1">{t.emailInvalid}</p>}
      </div>

      {/* Password */}
      <div className="mb-4">
        <Label text={t.password} required />
        <div className="relative">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type={showPw?"text":"password"} value={f.password}
            onChange={e => set("password", e.target.value)}
            placeholder={t.passwordPlaceholder}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"/>
          <button type="button" onClick={() => setShowPw(p=>!p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {pwRules.map(r => (
            <span key={r.key} className={`flex items-center gap-1 text-xs font-medium transition-colors ${r.test(f.password)?"text-blue-500":"text-gray-400"}`}>
              <Check size={10} strokeWidth={3}/>{t[r.key]}
            </span>
          ))}
        </div>
      </div>

      {/* Confirm */}
      <div className="mb-4">
        <Label text={t.confirmPassword} required />
        <div className="relative">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type={showCf?"text":"password"} value={f.confirm}
            onChange={e => set("confirm", e.target.value)}
            placeholder={t.confirmPlaceholder}
            className={`w-full border rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-50
              ${f.confirm ? (pwMatch?"border-green-300 focus:border-green-400":"border-red-300 focus:border-red-400"):"border-gray-200 focus:border-blue-400"}`}/>
          <button type="button" onClick={() => setShowCf(p=>!p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showCf ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>
        {f.confirm && <p className={`flex items-center gap-1 text-xs mt-1 font-medium ${pwMatch?"text-green-500":"text-red-400"}`}>
          {pwMatch ? <Check size={11}/> : <X size={11}/>}
          {pwMatch ? t.confirmMatch : t.confirmNoMatch}
        </p>}
      </div>

      {/* 18+ checkbox */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer group select-none">
          <div onClick={() => setF(p=>({...p,isAdult:!p.isAdult}))}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition
              ${f.isAdult?"bg-blue-500 border-blue-500":"border-gray-300 group-hover:border-blue-400"}`}>
            {f.isAdult && <Check size={11} color="white" strokeWidth={3}/>}
          </div>
          <span className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
            <ShieldCheck size={14} className={f.isAdult?"text-blue-500":"text-gray-400"}/>
            {t.age18}
          </span>
        </label>
      </div>

      <ErrorBanner msg={userState.error} />

      <button onClick={() => canSubmit && thunks.signup(f, dispatch, t)} disabled={!canSubmit}
        className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition
          ${canSubmit?"bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100":"bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
        {isLoading ? <><Loader2 size={15} className="animate-spin"/>{t.submitting}</> : <><UserPlus size={15}/>{t.submit}</>}
      </button>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t.haveAccount}{" "}
        <button onClick={onNavigate} className="text-red-500 font-semibold hover:underline">{t.goSignin}</button>
      </p>
    </div>
  );
}

// ─── SIGN IN PAGE ─────────────────────────────────────────────────────────────
function SignInPage({ t, locale, onNavigate }) {
  const [userState, dispatch] = useReducer(userReducer, initialUser);
  const [f, setF]   = useState({ email:"", password:"" });
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouch] = useState({});

  const touch  = k => setTouch(p=>({...p,[k]:true}));
  const set    = (k,v) => setF(p=>({...p,[k]:v}));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  const isLoading = userState.signinStatus === Status.LOADING;
  const canSubmit = emailOk && f.password.length >= 1 && !isLoading;

  if (userState.signinStatus === Status.SUCCESS)
    return <SuccessScreen message={t.successSignin} userId={userState.user?.userId}
      onReset={() => { dispatch({type:A.LOGOUT}); setF({email:"",password:""}); }} />;

  return (
    <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm px-7 py-10 relative">

      <div className="absolute top-4 left-4 text-xs font-bold text-blue-500 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1 tracking-widest uppercase">
        /{locale}
      </div>

      <h1 className="text-3xl font-black text-center text-gray-900 mb-7 mt-3 tracking-tight">{t.signinTitle}</h1>

      <GoogleBtn label={t.continueGoogle} loading={isLoading}
        onClick={() => thunks.googleAuth(dispatch)}/>
      <Divider label={t.or}/>

      {/* Email */}
      <div className="mb-4">
        <Label text={t.email} required/>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="email" value={f.email}
            onChange={e => set("email", e.target.value)}
            onBlur={() => touch("email")}
            placeholder={t.emailPlaceholder}
            className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-50 focus:border-blue-400 ${touched.email && !emailOk?"border-red-300":"border-gray-200"}`}/>
        </div>
        {touched.email && !emailOk && <p className="text-xs text-red-400 mt-1">{t.emailInvalid}</p>}
      </div>

      {/* Password */}
      <div className="mb-2">
        <Label text={t.password} required/>
        <div className="relative">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type={showPw?"text":"password"} value={f.password}
            onChange={e => set("password", e.target.value)}
            placeholder={t.passwordPlaceholder}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"/>
          <button type="button" onClick={() => setShowPw(p=>!p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
          </button>
        </div>
      </div>

      {/* Forgot */}
      <div className="flex justify-end mb-6">
        <button className="text-xs text-blue-500 hover:underline font-medium">{t.forgotPassword}</button>
      </div>

      <ErrorBanner msg={userState.error}/>

      <button onClick={() => canSubmit && thunks.signin(f, dispatch, t)} disabled={!canSubmit}
        className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition
          ${canSubmit?"bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100":"bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
        {isLoading ? <><Loader2 size={15} className="animate-spin"/>{t.submitting}</> : <><LogIn size={15}/>{t.signinSubmit}</>}
      </button>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t.noAccount}{" "}
        <button onClick={onNavigate} className="text-red-500 font-semibold hover:underline">{t.goSignup}</button>
      </p>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [locale, setLocale] = useState("ko");
  const [page, setPage]     = useState("signup"); // "signup" | "signin"
  const t = messages[locale];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 gap-4">
      {/* Locale switcher — simulates Next.js [locale] param */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
        <span className="text-xs text-gray-400 font-medium">locale param:</span>
        {["ko","en"].map(l => (
          <button key={l} onClick={() => setLocale(l)}
            className={`text-xs font-bold px-3 py-1 rounded-full transition ${locale===l?"bg-blue-500 text-white":"text-gray-500 hover:bg-gray-100"}`}>
            {l}
          </button>
        ))}
      </div>

      {page === "signup"
        ? <SignUpPage t={t} locale={locale} onNavigate={() => setPage("signin")}/>
        : <SignInPage t={t} locale={locale} onNavigate={() => setPage("signup")}/>
      }
    </div>
  );
}