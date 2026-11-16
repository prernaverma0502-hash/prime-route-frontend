import React from 'react';
import { ClipboardCheck, CheckCircle2, AlertTriangle, ShieldAlert, Clock } from 'lucide-react';
import StatCard from '../../../components/common/StatCard';
import { formatCurrency } from '../../../utils/formatters';

export default function InspectionKpis({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={ClipboardCheck}
        label="Total Inspections"
        value={stats.totalInspections}
        change={`${stats.passedCount} Clean Handover`}
        isPositive={true}
        color="blue"
      />
      <StatCard
        icon={Clock}
        label="Awaiting Inspection"
        value={stats.awaitingCount || 2}
        change="Pending Sign-off"
        isPositive={false}
        color="amber"
      />
      <StatCard
        icon={AlertTriangle}
        label="Damages Flagged"
        value={stats.damageCount}
        change="Action Required"
        isPositive={false}
        color="indigo"
      />
      <StatCard
        icon={ShieldAlert}
        label="Accident Claims Total"
        value={formatCurrency(stats.totalRepairCost)}
        change={`${stats.openClaims} Unresolved Claims`}
        isPositive={false}
        color="rose"
      />
    </div>
  );
}
