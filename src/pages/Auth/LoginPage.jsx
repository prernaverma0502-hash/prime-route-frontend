import React, { useState } from 'react';
import {
  Car,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  BarChart3,
  SlidersHorizontal,
  Compass,
  KeyRound,
  Check,
  Building,
  Server,
  Zap,
  Globe
} from 'lucide-react';
import Modal from '../../components/common/Modal';

export default function LoginPage({ onLogin }) {
  const [selectedRole] = useState('admin');
  const [email, setEmail] = useState('john.doe@primeroute.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const roleInfo = {
    id: 'admin',
    name: 'Administrator',
    badge: 'Full Access',
    subtitle: 'Fleet Operations • Global Console',
    defaultEmail: 'john.doe@primeroute.io',
    icon: Shield,
  };

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Corporate email is required.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid corporate email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Smooth transition simulation
    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) onLogin(selectedRole);
    }, 650);
  };


  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      return;
    }
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setIsForgotModalOpen(false);
      setResetEmail('');
    }, 2200);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F7FC] flex flex-col lg:flex-row antialiased selection:bg-[#075EE8] selection:text-white font-sans">
      {/* ======================================================== */}
      {/* LEFT SECTION – PREMIUM BRANDING / HERO AREA (~55% Width) */}
      {/* ======================================================== */}
      <div className="relative hidden lg:flex lg:w-[55%] bg-[#071D49] text-white flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-[#0D2D6C]">
        {/* Background Visual Layer: Modern Fleet Vehicle with Deep Navy Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&auto=format&fit=crop&q=85"
            alt="PrimeRoute Fleet Vehicle"
            className="w-full h-full object-cover object-center opacity-30 transform scale-105"
          />
          {/* Dual Gradient Overlays for sophisticated depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#061638] via-[#071D49]/90 to-[#071D49]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061638] via-transparent to-transparent opacity-90" />
        </div>

        {/* Elegant Geometric Lines & Road-Inspired Light Trails */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-40">
          <svg viewBox="0 0 1000 1000" className="w-full h-full object-cover" preserveAspectRatio="none">
            {/* Horizon light curve */}
            <path
              d="M 0 520 Q 500 480 1000 520"
              stroke="#38BDF8"
              strokeWidth="1.2"
              fill="none"
              strokeDasharray="6 6"
              opacity="0.6"
            />
            {/* Road trajectory perspective lines */}
            <path
              d="M 500 490 L 120 1000"
              stroke="#075EE8"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M 500 490 L 880 1000"
              stroke="#075EE8"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Center illuminated lane marker */}
            <path
              d="M 500 490 L 500 1000"
              stroke="#38BDF8"
              strokeWidth="3.5"
              strokeDasharray="16 12"
              fill="none"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* TOP BRANDING BAR */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* PrimeRoute Transparent Logo (No white background) */}
            <img
              src="/primeroute-logo-dark.png"
              alt="PrimeRoute"
              className="h-11 sm:h-12 w-auto object-contain"
            />
            <div className="border-l border-white/20 pl-3.5">
              <span className="text-xl font-extrabold tracking-wider text-white">
                PRIME<span className="text-[#38BDF8]">ROUTE</span>
              </span>
              <p className="text-[11px] text-blue-200/90 font-medium tracking-wide">
                Enterprise Fleet Management
              </p>
            </div>
          </div>
        </div>

        {/* HERO CONTENT AREA */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          {/* Main Heading */}
          <h1 className="text-4xl xl:text-[46px] font-black text-white leading-[1.15] tracking-tight">
            Manage. Track. Grow. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-[#38BDF8]">
              Your Fleet. Your Business.
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="text-sm xl:text-[15px] text-slate-300 mt-4 leading-relaxed font-normal">
            Complete fleet management, intelligent vehicle leasing, real-time operations and financial visibility — all in one powerful platform.
          </p>

          {/* THREE COMPACT INFORMATION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8">
            {/* Card 1: Fleet Management */}
            <div className="p-4 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:bg-white/[0.12] transition-all duration-300">
              <div className="w-8 h-8 rounded-lg bg-[#075EE8]/40 flex items-center justify-center text-[#38BDF8] mb-2.5">
                <Car className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">Fleet Management</h4>
              <ul className="text-[11px] text-slate-300 space-y-1 mt-2">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#38BDF8]" /> Vehicle tracking
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#38BDF8]" /> Fleet availability
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#38BDF8]" /> Vehicle operations
                </li>
              </ul>
            </div>

            {/* Card 2: Smart Analytics */}
            <div className="p-4 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:bg-white/[0.12] transition-all duration-300">
              <div className="w-8 h-8 rounded-lg bg-[#075EE8]/40 flex items-center justify-center text-[#38BDF8] mb-2.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">Smart Analytics</h4>
              <ul className="text-[11px] text-slate-300 space-y-1 mt-2">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#38BDF8]" /> Monthly revenue
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#38BDF8]" /> Expense tracking
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#38BDF8]" /> Profit insights
                </li>
              </ul>
            </div>

            {/* Card 3: Operational Control */}
            <div className="p-4 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:bg-white/[0.12] transition-all duration-300">
              <div className="w-8 h-8 rounded-lg bg-[#075EE8]/40 flex items-center justify-center text-[#38BDF8] mb-2.5">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">Operational Control</h4>
              <ul className="text-[11px] text-slate-300 space-y-1 mt-2">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#38BDF8]" /> Driver management
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#38BDF8]" /> Maintenance tracking
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#38BDF8]" /> Rental operations
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* TRUST SECTION AT BOTTOM */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-white text-[12px] tracking-wide">
              Trusted Fleet Management Platform
            </p>
            <p className="text-[11px] text-slate-400">
              Engineered for commercial transport &amp; leasing systems
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Access
            </span>
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#38BDF8]" /> Enterprise Ready
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Real-Time Operations
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT SECTION – LOGIN FORM (~45% Width)                  */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col justify-between px-4 py-6 sm:px-8 sm:py-10 xl:p-14 bg-[#F4F7FC] overflow-y-auto">
        {/* Mobile Branding Header (Only visible on small devices) */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <img
              src="/primeroute-logo.png"
              alt="PrimeRoute"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <div className="border-l border-slate-200 pl-2.5">
              <span className="text-base sm:text-lg font-black text-[#071D49] leading-tight block">
                PRIME<span className="text-[#075EE8]">ROUTE</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Enterprise Fleet Management</span>
            </div>
          </div>
        </div>

        {/* Centered Login Card */}
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_4px_24px_rgba(7,29,73,0.06)] border border-slate-200/80">
            {/* Header Titles */}
            <div className="mb-5 sm:mb-6">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#075EE8] bg-blue-50 px-2 py-0.5 rounded-md mb-2">
                ENTERPRISE FLEET GATEWAY
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#14213D] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sign in to access your PrimeRoute Fleet Console.
              </p>
            </div>

            {/* ACCOUNT ROLE DISPLAY (SINGLE ROLE: ADMINISTRATOR) */}
            <div className="mb-5">
              <label className="text-xs font-bold text-[#14213D] block mb-1.5">
                Account Role
              </label>
              <div className="p-3 sm:p-3.5 rounded-2xl border-2 border-[#075EE8] bg-blue-50/70 shadow-sm flex items-center justify-between gap-3 transition-all">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#075EE8] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-[#071D49] whitespace-nowrap">
                        {roleInfo.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#075EE8]/15 text-[#075EE8] border border-[#075EE8]/20 shrink-0">
                        {roleInfo.badge}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {roleInfo.subtitle}
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#075EE8] text-white flex items-center justify-center shrink-0 shadow-sm ml-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Corporate Email Field */}
              <div>
                <label className="text-xs font-bold text-[#14213D] block mb-1">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="Enter your corporate email"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl font-medium text-[#14213D] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      emailError
                        ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                        : 'border-slate-200 focus:ring-[#075EE8]/20 focus:border-[#075EE8]'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#14213D] block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs font-semibold text-[#075EE8] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border rounded-xl font-medium text-[#14213D] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      passwordError
                        ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                        : 'border-slate-200 focus:ring-[#075EE8]/20 focus:border-[#075EE8]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center pt-0.5">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#075EE8] focus:ring-[#075EE8] cursor-pointer"
                  />
                  <span className="font-medium">Remember me on this device</span>
                </label>
              </div>

              {/* PRIMARY LOGIN BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#075EE8] to-[#044EC2] hover:from-[#0650C7] hover:to-[#033E9E] active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-[0_4px_16px_rgba(7,94,232,0.3)] flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-75 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Fleet Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>


          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Password Recovery"
        subtitle="Enter your corporate email address to receive password reset instructions"
        maxWidth="max-w-md"
      >
        <form onSubmit={handlePasswordReset} className="space-y-4">
          {resetSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1.5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Recovery Instructions Dispatched</h4>
              <p className="text-xs text-emerald-700">
                A secure password reset link has been dispatched to your corporate email.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-[#14213D] block mb-1">
                  Corporate Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@primeroute.io"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#075EE8]/20 focus:border-[#075EE8]"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#075EE8] text-white rounded-xl text-xs font-bold shadow hover:bg-[#0650C7]"
                >
                  Send Recovery Link
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
