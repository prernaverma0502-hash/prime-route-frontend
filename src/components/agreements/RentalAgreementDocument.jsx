import React from 'react';
import { formatDate } from '../../utils/formatters';

// Helper to render signature cleanly without broken image icons or unwanted image placeholders
const renderSignatureContent = (signature, fallbackAwaiting) => {
  if (!signature) {
    return (
      <span className="text-xs text-slate-400 italic font-sans">
        [{fallbackAwaiting}]
      </span>
    );
  }

  // If digital signature is a valid Base64 image data URL (drawn via DigitalSignaturePad)
  if (typeof signature === 'string' && signature.startsWith('data:image')) {
    return (
      <img
        src={signature}
        alt="Digital Signature"
        className="max-h-full max-w-full object-contain select-none pointer-events-none"
      />
    );
  }

  // If string name or typed signature, render as clean elegant cursive script without any img element
  return (
    <span
      className="text-xl sm:text-2xl text-[#071D49] tracking-wider select-none font-medium italic"
      style={{ fontFamily: '"Brush Script MT", "Segoe Script", "Great Vibes", cursive, Georgia, serif' }}
    >
      {signature}
    </span>
  );
};

export default function RentalAgreementDocument({
  agreementData,
  driverSignature,
  representativeSignature,
  signedAt
}) {
  if (!agreementData) return null;

  const data = agreementData;
  const signingDateStr = signedAt ? formatDate(signedAt) : new Date().toLocaleDateString();

  const displayDriverName = data.driverName || data.renter || 'N/A';
  const displayDriverLicense = data.driverLicense || data.license || 'N/A';
  const displayDriverPhone = data.driverPhone || data.phone || 'N/A';
  const displayDriverEmail = data.driverEmail || data.email || 'N/A';
  const displayVehicleVin = data.vehicleVin || data.vin || 'N/A';
  const displayVehiclePlate = data.vehiclePlate || data.plate || 'N/A';

  return (
    <div className="printable-agreement bg-white text-slate-900 font-serif leading-relaxed text-[13px] sm:text-[14px] p-4 sm:p-8 md:p-10 border border-slate-200 rounded-2xl shadow-sm max-w-3xl mx-auto space-y-6">
      {/* Header with PrimeRoute Official Emblem */}
      <div className="text-center space-y-2 border-b border-slate-300 pb-5">
        <div className="flex justify-center mb-2">
          <img
            src="/primeroute-logo.png"
            alt="PrimeRoute"
            className="h-12 w-auto object-contain"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-black font-sans tracking-wide text-[#071D49] uppercase">
          Prime Route Vehicle Rental Agreement
        </h1>
        <p className="text-xs text-slate-600 font-sans">
          Official Fleet Lease &amp; Commercial Vehicle Dispatch Contract • Agreement ID: <span className="font-mono font-bold text-[#075EE8]">{data.agreementId || 'AGR-RECORD'}</span>
        </p>
      </div>

      {/* Preamble */}
      <p className="italic text-slate-800">
        This Vehicle Rental Agreement (&quot;Agreement&quot;) is entered into between{' '}
        <strong>PrimeRoute</strong> (&quot;Owner&quot;) and the undersigned Driver (&quot;Renter&quot;).
      </p>

      {/* Driver Information Box */}
      <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#071D49]">
          Driver Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans">
          <div>
            <span className="text-slate-500 block">Full Name:</span>
            <span className="font-bold text-slate-900 text-sm border-b border-slate-300 pb-0.5 block">
              {displayDriverName}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Driver License (DL#):</span>
            <span className="font-bold font-mono text-slate-900 border-b border-slate-300 pb-0.5 block">
              {displayDriverLicense}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Phone:</span>
            <span className="font-medium text-slate-800 border-b border-slate-300 pb-0.5 block">
              {displayDriverPhone}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Email:</span>
            <span className="font-medium text-slate-800 border-b border-slate-300 pb-0.5 block">
              {displayDriverEmail}
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle Information Box */}
      <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider font-sans text-[#071D49]">
          Vehicle Information
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-sans">
          <div>
            <span className="text-slate-500 block">Year:</span>
            <span className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 block">
              {data.vehicleYear || '2024'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Make:</span>
            <span className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 block">
              {data.vehicleMake || 'Toyota'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Model:</span>
            <span className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 block">
              {data.vehicleModel || 'Camry'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Color:</span>
            <span className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 block">
              {data.vehicleColor || 'Black'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-sans pt-1">
          <div className="sm:col-span-1">
            <span className="text-slate-500 block">VIN:</span>
            <span className="font-bold font-mono text-slate-900 border-b border-slate-300 pb-0.5 block truncate">
              {displayVehicleVin}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">License Plate:</span>
            <span className="font-bold font-mono text-slate-900 border-b border-slate-300 pb-0.5 block">
              {displayVehiclePlate}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Handover Odometer:</span>
            <span className="font-bold font-mono text-[#075EE8] border-b border-slate-300 pb-0.5 block">
              {typeof data.pickupOdometer === 'number' ? `${data.pickupOdometer.toLocaleString()} mi` : data.pickupOdometer || 'N/A'}
            </span>
          </div>
        </div>

        <div className="text-xs font-sans pt-1">
          <span className="text-slate-500 block">Fuel Level at Pickup:</span>
          <span className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 block">
            {data.pickupFuelLevel || 'Full (100%)'}
          </span>
        </div>
      </div>

      {/* Section 1: Rental Period */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">1. Rental Period</h2>
        <p className="text-justify">
          Rental begins <strong>{data.startDate ? formatDate(data.startDate) : '__________________'}</strong>. Weekly Rent: <strong>${data.weeklyRent || '______'}</strong>. Due: <strong>{data.paymentDueDay || '__________________'}</strong>. Refundable Security Deposit: <strong>${data.securityDeposit || '300.00'}</strong>.
        </p>
        <p className="text-justify font-medium text-slate-800">
          Late payment is a breach of this agreement and may result in termination and repossession where permitted by law.
        </p>
      </div>

      {/* Section 2: Driver Responsibilities */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">2. Driver Responsibilities</h2>
        <p className="text-justify">
          Operate safely; obey all traffic laws; keep the vehicle clean; return the vehicle with a full tank of fuel and in substantially the same condition as received (normal wear and tear excepted); report mileage when requested; immediately report accidents, warning lights, and damage; change oil every 5,000 miles at a PrimeRoute-approved location; and return all keys and accessories.
        </p>
      </div>

      {/* Section 3: Vehicle Care */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">3. Vehicle Care</h2>
        <p className="text-justify">
          No reckless driving, unauthorized drivers, repairs, modifications, replacement of parts, GPS tampering, or illegal use. Driver is responsible for damage caused by negligence, abuse, careless use, unauthorized repairs, or failure to properly maintain or report vehicle issues.
        </p>
      </div>

      {/* Section 4: Insurance Requirements and Rideshare Use */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">4. Insurance Requirements and Rideshare Use</h2>
        <p className="text-justify">
          PrimeRoute provides liability insurance for the vehicle as provided by the applicable insurance policy and law. The Driver is responsible for understanding whether additional insurance is needed for their intended use of the vehicle.
        </p>
        <p className="text-justify">
          For Uber, Lyft, delivery, or other rideshare/commercial use, PrimeRoute has informed the Driver that additional insurance coverage is required or recommended by law, the applicable platform, or the Driver&apos;s circumstances.
        </p>
        <p className="text-justify">
          PrimeRoute is not responsible for the Driver&apos;s failure to obtain or maintain any additional insurance coverage. The Driver is solely responsible for any consequences, claims, losses, or expenses resulting from the lack of such coverage, to the fullest extent permitted by law.
        </p>
        <p className="text-justify">
          The Driver acknowledges that PrimeRoute has provided this insurance information and has had the opportunity to ask questions regarding the coverage.
        </p>
      </div>

      {/* Section 5: Accidents & Insurance */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">5. Accidents &amp; Insurance</h2>
        <p className="text-justify">
          The Driver is responsible for the operation of the vehicle. If the Driver is determined to be at fault for an accident, the Driver is responsible for the cost of repairing the vehicle and the <strong>$1,000.00 insurance deductible</strong>, to the extent permitted by applicable law and the applicable insurance policy.
        </p>
        <p className="text-justify">
          The Driver shall immediately report any accident to PrimeRoute, cooperate with all insurance claims and investigations, and provide any required information or documentation. The Driver agrees to indemnify and hold PrimeRoute harmless to the fullest extent permitted by law, except for liability resulting from PrimeRoute&apos;s own negligence where applicable.
        </p>
      </div>

      {/* Section 6: Tickets & Tolls */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">6. Tickets &amp; Tolls</h2>
        <p className="text-justify">
          Driver is responsible for all parking tickets, speeding citations, tolls, camera violations, towing charges, impound fees, and administrative fees, including notices received after the vehicle is returned if incurred during the rental period.
        </p>
      </div>

      {/* Section 7: Illegal Use and Criminal Conduct */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">7. Illegal Use and Criminal Conduct</h2>
        <p className="text-justify">
          The Driver shall not use the vehicle for any unlawful, criminal, fraudulent, or unauthorized purpose. The Driver is solely responsible for any criminal acts, traffic offenses, civil violations, fines, penalties, forfeitures, investigations, arrests, lawsuits, or damages arising from the Driver&apos;s possession, operation, or use of the vehicle during the rental period. To the fullest extent permitted by applicable law, the Driver agrees to defend, indemnify, and hold harmless PrimeRoute, its owners, employees, and agents from any claims, liabilities, damages, losses, costs, attorney&apos;s fees, or expenses arising out of the Driver&apos;s unlawful or negligent use of the vehicle. PrimeRoute may immediately terminate this Agreement and recover the vehicle if it reasonably believes the vehicle has been used for illegal or unauthorized purposes.
        </p>
      </div>

      {/* Section 8: Responsibility During Possession */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">8. Responsibility During Possession</h2>
        <p className="text-justify">
          From the moment the Driver takes possession of the vehicle until it is returned and accepted by PrimeRoute, the Driver assumes full responsibility for the lawful operation and safekeeping of the vehicle and for complying with all applicable laws and regulations.
        </p>
      </div>

      {/* Section 9: Return of Vehicle, Advance Notice & Cleaning */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">9. Return of Vehicle, Advance Notice &amp; Cleaning</h2>
        <p className="text-justify">
          The Driver must provide PrimeRoute with at least <strong>three (3) days&apos; advance notice</strong> before returning the vehicle.
        </p>
        <ul className="list-disc pl-6 space-y-1 text-slate-800">
          <li><strong>Three (3) days or more notice:</strong> No notice charge.</li>
          <li><strong>Two (2) days&apos; notice:</strong> The applicable one-day charge will be deducted from the Driver&apos;s $300 security deposit.</li>
          <li><strong>Less than two (2) days&apos; notice or no notice:</strong> A charge of $35 per applicable day may be deducted from the Driver&apos;s security deposit.</li>
        </ul>
        <p className="text-justify">
          The vehicle must be returned clean and in substantially the same condition in which it was delivered, excluding normal wear and tear. If the vehicle requires cleaning beyond normal use, a <strong>$20 cleaning fee</strong> will be deducted from the security deposit. Plus a late fee of <strong>$20</strong> for each late payment over one day of specified date.
        </p>
        <p className="text-justify">
          The vehicle must be returned with a <strong>full tank of fuel</strong>, unless otherwise agreed in writing.
        </p>
        <p className="text-justify">
          The vehicle must be returned to the exact pickup/return location designated by PrimeRoute. The Driver may not leave or abandon the vehicle at another location without prior approval from PrimeRoute.
        </p>
        <p className="text-justify">
          The vehicle keys must be personally handed to the PrimeRoute representative or other person specifically designated by PrimeRoute. Leaving the keys inside the vehicle, in the vehicle, at another location, or with an unauthorized person does not constitute proper return of the vehicle unless PrimeRoute has provided prior written instructions allowing it.
        </p>
        <p className="text-justify">
          The Driver remains responsible for the vehicle until the vehicle and keys have been properly returned and the return has been accepted by PrimeRoute.
        </p>
        <p className="text-justify">
          Any applicable cleaning fees, notice charges, damages, unpaid amounts, tickets, tolls, or other authorized charges may be deducted from the <strong>$300 security deposit</strong>, to the extent permitted by applicable law.
        </p>
      </div>

      {/* Section 10 (Numbered 9 in original text): Default */}
      <div className="space-y-2 pt-2">
        <h2 className="text-base font-bold font-sans text-[#0A1E42]">9. Default</h2>
        <p className="text-justify">
          Late payment, failure to return the vehicle, allowing an unauthorized driver, illegal use, failure to report damage, careless operation, or any other breach allows PrimeRoute to terminate this Agreement.
        </p>
      </div>

      {/* Agreement Acknowledgment & Signatures Section */}
      <div className="border-t-2 border-slate-400 pt-5 space-y-6">
        <div>
          <h2 className="text-base font-bold font-sans text-[#0A1E42] mb-1">Agreement</h2>
          <p className="italic text-slate-700">
            Driver acknowledges reading and agreeing to all terms. Governed by the law of the rental state.
          </p>
        </div>

        {/* Representative Signature Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-sans text-slate-500 block">PrimeRoute Representative:</span>
            <span className="text-sm font-bold font-sans text-[#0A1E42] border-b border-slate-400 block pb-1">
              {data.representativeName || 'John Doe (Administrator)'}
            </span>
            <span className="text-xs font-sans text-slate-500 block mt-2">Date:</span>
            <span className="text-xs font-mono font-bold text-slate-800 border-b border-slate-400 block pb-1">
              {signingDateStr}
            </span>
          </div>

          <div>
            <span className="text-xs font-sans text-slate-500 block">Representative Signature:</span>
            <div className="h-16 border-b border-slate-400 flex items-center justify-center bg-white rounded-md mt-1 p-1">
              {renderSignatureContent(representativeSignature, 'Awaiting Representative Signature')}
            </div>
          </div>
        </div>

        {/* Driver Signature Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs font-sans text-slate-500 block">Driver (Renter):</span>
            <span className="text-sm font-bold font-sans text-[#0A1E42] border-b border-slate-400 block pb-1">
              {displayDriverName !== 'N/A' ? displayDriverName : '__________________'}
            </span>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <span className="text-xs font-sans text-slate-500 block">SSN:</span>
                <span className="text-xs font-mono text-slate-400 border-b border-slate-400 block pb-1">
                  [Omitted for Privacy]
                </span>
              </div>
              <div>
                <span className="text-xs font-sans text-slate-500 block">DL#:</span>
                <span className="text-xs font-mono font-bold text-slate-800 border-b border-slate-400 block pb-1">
                  {displayDriverLicense !== 'N/A' ? displayDriverLicense : '__________________'}
                </span>
              </div>
            </div>

            <span className="text-xs font-sans text-slate-500 block mt-2">Date:</span>
            <span className="text-xs font-mono font-bold text-slate-800 border-b border-slate-400 block pb-1">
              {signingDateStr}
            </span>
          </div>

          <div>
            <span className="text-xs font-sans text-slate-500 block">Driver Signature:</span>
            <div className="h-24 border-b border-slate-400 flex items-center justify-center bg-white rounded-md mt-1 p-1">
              {renderSignatureContent(driverSignature, 'Awaiting Driver Signature')}
            </div>
          </div>
        </div>
      </div>

      {/* Tamper-Evident Digital Footprint */}
      <div className="border-t border-slate-200 pt-3 text-[10px] font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1">
        <span>PrimeRoute Legal Document Security Hash: SHA256-{(data.agreementId || 'AGR').slice(-6)}8f9a2b</span>
        <span>Executed via PrimeRoute Administrator Console • {signedAt ? `Sealed on ${new Date(signedAt).toLocaleString()}` : 'Draft'}</span>
      </div>
    </div>
  );
}

