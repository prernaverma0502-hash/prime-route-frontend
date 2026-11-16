import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Plus,
  Download,
  Filter,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldAlert,
  FileCheck,
  Layers,
  Search
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ComplianceTable from './components/ComplianceTable';
import PoliciesView from './components/PoliciesView';
import ClaimsView from './components/ClaimsView';
import PolicyModal from './components/PolicyModal';
import ClaimModal from './components/ClaimModal';
import RenewComplianceModal from './components/RenewComplianceModal';
import { useFleet } from '../../context/FleetContext';
import {
  initialPolicies,
  initialInsuranceClaims,
  initialComplianceItems
} from '../../data/mockData';
import { exportToCsv } from '../../utils/exportCsv';
import { formatCurrency } from '../../utils/formatters';
import Can from '../../auth/Can';

const COMPLIANCE_CATEGORIES = [
  'All Categories',
  'Vehicle Registration',
  'Driver License',
  'Rental Contract',
  'Required Document'
];

const URGENCY_FILTERS = [
  'All Urgencies',
  'Critical (≤7 days)',
  'Due Soon (≤14 days)',
  'Upcoming (≤30 days)',
  'Compliant (>30 days)'
];

export default function InsurancePage() {
  const { accidents } = useFleet();

  // Active Tab: 'compliance' | 'policies' | 'claims'
  const [activeTab, setActiveTab] = useState('compliance');

  // Local State for Policies, Claims, and Compliance items
  const [policies, setPolicies] = useState(initialPolicies);
  const [claims, setClaims] = useState(initialInsuranceClaims);
  const [complianceItems, setComplianceItems] = useState(initialComplianceItems);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [urgencyFilter, setUrgencyFilter] = useState('All Urgencies');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedComplianceItem, setSelectedComplianceItem] = useState(null);

  // Filtered Compliance Items
  const filteredCompliance = useMemo(() => {
    return complianceItems.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (item.title || '').toLowerCase().includes(q) ||
        (item.entityName || '').toLowerCase().includes(q) ||
        (item.identifier || '').toLowerCase().includes(q) ||
        (item.authority || '').toLowerCase().includes(q) ||
        (item.documentFile || '').toLowerCase().includes(q);

      let matchesCategory = true;
      if (categoryFilter !== 'All Categories') {
        matchesCategory = item.category === categoryFilter;
      }

      let matchesUrgency = true;
      if (urgencyFilter !== 'All Urgencies') {
        if (urgencyFilter.includes('≤7 days')) {
          matchesUrgency = item.daysRemaining <= 7;
        } else if (urgencyFilter.includes('≤14 days')) {
          matchesUrgency = item.daysRemaining > 7 && item.daysRemaining <= 14;
        } else if (urgencyFilter.includes('≤30 days')) {
          matchesUrgency = item.daysRemaining > 14 && item.daysRemaining <= 30;
        } else if (urgencyFilter.includes('>30 days')) {
          matchesUrgency = item.daysRemaining > 30;
        }
      }

      return matchesSearch && matchesCategory && matchesUrgency;
    });
  }, [complianceItems, searchQuery, categoryFilter, urgencyFilter]);

  // Filtered Policies
  const filteredPolicies = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return policies.filter(
      (p) =>
        (p.insurer || '').toLowerCase().includes(q) ||
        (p.policyNumber || '').toLowerCase().includes(q) ||
        (p.coverage || '').toLowerCase().includes(q) ||
        (p.status || '').toLowerCase().includes(q)
    );
  }, [policies, searchQuery]);

  // Filtered Claims
  const filteredClaims = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return claims.filter(
      (c) =>
        (c.claimNumber || '').toLowerCase().includes(q) ||
        (c.insurer || '').toLowerCase().includes(q) ||
        (c.accidentId || '').toLowerCase().includes(q) ||
        (c.vehicle || '').toLowerCase().includes(q) ||
        (c.driver || '').toLowerCase().includes(q) ||
        (c.status || '').toLowerCase().includes(q)
    );
  }, [claims, searchQuery]);

  // Pagination for Compliance Table
  const paginatedCompliance = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCompliance.slice(start, start + pageSize);
  }, [filteredCompliance, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCompliance.length / pageSize) || 1;

  // KPI Calculations
  const stats = useMemo(() => {
    const criticalCount = complianceItems.filter((c) => c.daysRemaining <= 7).length;
    const dueSoonCount = complianceItems.filter((c) => c.daysRemaining > 7 && c.daysRemaining <= 14).length;
    const upcomingCount = complianceItems.filter((c) => c.daysRemaining > 14 && c.daysRemaining <= 30).length;
    const openClaimsCount = claims.filter((c) => c.status !== 'Settled').length;
    const totalPremium = policies.reduce((sum, p) => sum + (Number(p.premium) || 0), 0);

    return {
      totalCompliance: complianceItems.length,
      criticalCount,
      dueSoonCount,
      upcomingCount,
      totalPremium,
      openClaimsCount,
      totalPolicies: policies.length
    };
  }, [complianceItems, claims, policies]);

  // Handlers
  const handleSavePolicy = (policyData) => {
    if (selectedPolicy) {
      setPolicies((prev) => prev.map((p) => (p.id === policyData.id ? policyData : p)));
    } else {
      setPolicies((prev) => [policyData, ...prev]);
    }
    setSelectedPolicy(null);
  };

  const handleSaveClaim = (claimData) => {
    if (selectedClaim) {
      setClaims((prev) => prev.map((c) => (c.id === claimData.id ? claimData : c)));
    } else {
      setClaims((prev) => [claimData, ...prev]);
    }
    setSelectedClaim(null);
  };

  const handleSaveRenewal = (renewedItem) => {
    setComplianceItems((prev) =>
      prev.map((item) => (item.id === renewedItem.id ? renewedItem : item))
    );
    setSelectedComplianceItem(null);
  };

  const handleExport = () => {
    if (activeTab === 'policies') {
      exportToCsv('primeroute-fleet-insurance-policies', policies);
    } else if (activeTab === 'claims') {
      exportToCsv('primeroute-insurance-claims', claims);
    } else {
      exportToCsv('primeroute-compliance-tracking-report', filteredCompliance);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1E42] tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#075EE8]" />
            Insurance & Compliance Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Master fleet insurance policies, carrier claims tracking, and 30/14/7-day regulatory compliance countdown
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Can module="documents" do="export">
            <button
              onClick={handleExport}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Report
            </button>
          </Can>

          <Can module="inspections" do="add">
            <button
              onClick={() => {
                setSelectedClaim(null);
                setIsClaimModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              + File Insurance Claim
            </button>
          </Can>

          <Can module="settings" do="edit">
            <button
              onClick={() => {
                setSelectedPolicy(null);
                setIsPolicyModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all active:scale-97 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Policy
            </button>
          </Can>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={AlertTriangle}
          label="Critical Expiry (≤7 Days)"
          value={stats.criticalCount}
          change="Immediate Renewal Required"
          isPositive={false}
          color="rose"
        />
        <StatCard
          icon={Clock}
          label="Due Soon (≤14 Days)"
          value={stats.dueSoonCount}
          change={`${stats.upcomingCount} Within 30 Days`}
          isPositive={false}
          color="amber"
        />
        <StatCard
          icon={ShieldCheck}
          label="Active Fleet Policies"
          value={stats.totalPolicies}
          change={formatCurrency(stats.totalPremium) + ' Annual Premium'}
          isPositive={true}
          color="blue"
        />
        <StatCard
          icon={ShieldAlert}
          label="Open Insurance Claims"
          value={stats.openClaimsCount}
          change="Under Carrier Review"
          isPositive={false}
          color="indigo"
        />
      </div>

      {/* Primary Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('compliance');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'compliance'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>30/14/7-Day Compliance Tracker</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'compliance'
                  ? 'bg-white/20 text-white'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {stats.criticalCount} Critical
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('policies');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'policies'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Master Fleet Policies</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'policies'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {policies.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('claims');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'claims'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Claims Linked to Accidents</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'claims'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {claims.length}
            </span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(7,29,73,0.04)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={
              activeTab === 'compliance'
                ? 'Search registration, license, contract, permit...'
                : activeTab === 'policies'
                ? 'Search insurer, policy #, coverage...'
                : 'Search claim #, accident, vehicle, driver...'
            }
          />
        </div>

        {activeTab === 'compliance' && (
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {COMPLIANCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => {
                setUrgencyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {URGENCY_FILTERS.map((urg) => (
                <option key={urg} value={urg}>
                  {urg}
                </option>
              ))}
            </select>

            {(categoryFilter !== 'All Categories' || urgencyFilter !== 'All Urgencies' || searchQuery) && (
              <button
                onClick={() => {
                  setCategoryFilter('All Categories');
                  setUrgencyFilter('All Urgencies');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold text-rose-600 hover:underline px-2"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab Views */}
      {activeTab === 'compliance' ? (
        <>
          <ComplianceTable
            items={paginatedCompliance}
            onRenewItem={(item) => {
              setSelectedComplianceItem(item);
              setIsRenewModalOpen(true);
            }}
            onResetFilters={() => {
              setCategoryFilter('All Categories');
              setUrgencyFilter('All Urgencies');
              setSearchQuery('');
            }}
          />

          {filteredCompliance.length > pageSize && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredCompliance.length}
              pageSize={pageSize}
            />
          )}
        </>
      ) : activeTab === 'policies' ? (
        <PoliciesView
          policies={filteredPolicies}
          onEditPolicy={(p) => {
            setSelectedPolicy(p);
            setIsPolicyModalOpen(true);
          }}
        />
      ) : (
        <ClaimsView
          claims={filteredClaims}
          onEditClaim={(c) => {
            setSelectedClaim(c);
            setIsClaimModalOpen(true);
          }}
          onResetFilters={() => setSearchQuery('')}
        />
      )}

      {/* Modals */}
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => {
          setIsPolicyModalOpen(false);
          setSelectedPolicy(null);
        }}
        onSave={handleSavePolicy}
        policy={selectedPolicy}
      />

      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => {
          setIsClaimModalOpen(false);
          setSelectedClaim(null);
        }}
        onSave={handleSaveClaim}
        claim={selectedClaim}
        accidents={accidents}
      />

      <RenewComplianceModal
        isOpen={isRenewModalOpen}
        onClose={() => {
          setIsRenewModalOpen(false);
          setSelectedComplianceItem(null);
        }}
        onSave={handleSaveRenewal}
        item={selectedComplianceItem}
      />
    </div>
  );
}

