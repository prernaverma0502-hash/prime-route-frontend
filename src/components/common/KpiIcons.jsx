import React from 'react';

/**
 * Pixel-perfect, professional vector icons precisely matching Image 2
 * Standard 24x24 vector grid with clean geometry, smooth curves, and crisp royal blue `#075EE8`.
 */

// 1. Total Vehicles: Front-view modern car with crisp windshield and headlights
export const SolidCarIcon = ({ className = "w-11 h-11" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} shrink-0`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main car body */}
    <path
      d="M4.8 11.2L6.4 6.2C6.7 5.3 7.6 4.7 8.6 4.7H15.4C16.4 4.7 17.3 5.3 17.6 6.2L19.2 11.2C20.3 11.6 21.1 12.7 21.1 14.1V18.2C21.1 18.8 20.6 19.3 20 19.3H19C18.4 19.3 18 18.8 18 18.2V17.3H6V18.2C6 18.8 5.6 19.3 5 19.3H4C3.4 19.3 2.9 18.8 2.9 18.2V14.1C2.9 12.7 3.7 11.6 4.8 11.2Z"
      fill="#075EE8"
    />
    {/* Windshield */}
    <path
      d="M7 11L8.2 7.2C8.4 6.8 8.8 6.5 9.2 6.5H14.8C15.2 6.5 15.6 6.8 15.8 7.2L17 11H7Z"
      fill="#FFFFFF"
    />
    {/* Circular Headlights */}
    <circle cx="6.2" cy="14.3" r="1.3" fill="#FFFFFF" />
    <circle cx="17.8" cy="14.3" r="1.3" fill="#FFFFFF" />
    {/* Center lower grill */}
    <rect x="9.5" y="14.5" width="5" height="1.2" rx="0.6" fill="#FFFFFF" opacity="0.85" />
  </svg>
);

// 2. Active Drivers: Clean circular steering wheel with spokes & hub
export const SolidSteeringWheelIcon = ({ className = "w-11 h-11" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} shrink-0`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer wheel ring */}
    <circle cx="12" cy="12" r="9.3" stroke="#075EE8" strokeWidth="2.8" />
    {/* Center hub */}
    <circle cx="12" cy="12" r="3.2" fill="#075EE8" />
    {/* Center white dot */}
    <circle cx="12" cy="12" r="1.1" fill="#FFFFFF" />
    {/* Left horizontal spoke */}
    <path d="M4.6 12H9" stroke="#075EE8" strokeWidth="2.4" strokeLinecap="round" />
    {/* Right horizontal spoke */}
    <path d="M15 12H19.4" stroke="#075EE8" strokeWidth="2.4" strokeLinecap="round" />
    {/* Bottom spoke */}
    <path d="M12 15V19.4" stroke="#075EE8" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

// 3. Monthly Revenue: Solid royal blue circle disc with bold white $
export const SolidDollarCircleIcon = ({ className = "w-11 h-11" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} shrink-0`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Solid Blue Circle Disc */}
    <circle cx="12" cy="12" r="10.5" fill="#075EE8" />
    {/* Vertical Dollar Spine */}
    <path d="M12 4.6V19.4" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round" />
    {/* S Curve */}
    <path
      d="M15.2 8.6C15.2 7.1 13.8 6 12 6C10.2 6 8.8 7.1 8.8 8.6C8.8 10.2 10.1 10.9 12 11.4C13.9 11.9 15.2 12.7 15.2 14.3C15.2 15.9 13.8 17 12 17C10.2 17 8.8 15.9 8.8 14.4"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 4. Monthly Expenses: Solid blue horizontal wallet with top fold and white clasp
export const SolidWalletIcon = ({ className = "w-11 h-11" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} shrink-0`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top bill fold peek */}
    <path
      d="M5.5 7.2C5.5 6.1 6.3 5.3 7.4 5.3H16.6C17.7 5.3 18.5 6.1 18.5 7.2V8.5H5.5V7.2Z"
      fill="#075EE8"
      opacity="0.8"
    />
    {/* Main wallet body */}
    <rect x="3.2" y="7.5" width="17.6" height="12" rx="2.5" fill="#075EE8" />
    {/* Subtle top edge crease */}
    <path d="M5.5 8H18.5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
    {/* Clasp flap on right */}
    <path
      d="M15 11.5H19.4C20.3 11.5 21 12.2 21 13V14C21 14.8 20.3 15.5 19.4 15.5H15C14.4 15.5 14 15.1 14 14.5V12.5C14 11.9 14.4 11.5 15 11.5Z"
      fill="#0447B5"
    />
    {/* White clasp button */}
    <circle cx="18.8" cy="13.5" r="1" fill="#FFFFFF" />
  </svg>
);

// 5. Net Profit: Rising bars with upward trend line arrow
export const SolidProfitChartIcon = ({ className = "w-11 h-11" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className} shrink-0`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 3 Rising Solid Blue Bars */}
    <rect x="3.2" y="13.5" width="3.6" height="7" rx="0.8" fill="#075EE8" />
    <rect x="8.2" y="10" width="3.6" height="10.5" rx="0.8" fill="#075EE8" />
    <rect x="13.2" y="6.5" width="3.6" height="14" rx="0.8" fill="#075EE8" />
    {/* Trend Line & Arrowhead */}
    <path
      d="M3.5 10.5L9.5 6.5L14 9L20.5 3M20.5 3H16M20.5 3V7.5"
      stroke="#075EE8"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
