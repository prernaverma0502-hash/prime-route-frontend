import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  initialRentals,
  initialVehicles,
  initialDrivers,
  initialInspections,
  initialAccidents
} from '../data/mockData';
import {
  vehiclesApi,
  driversApi,
  rentalsApi,
  inspectionsApi,
  auditApi
} from '../api';

const FleetContext = createContext(null);

export function FleetProvider({ children }) {
  const [rentals, setRentals] = useState(initialRentals);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [inspections, setInspections] = useState(initialInspections);
  const [accidents, setAccidents] = useState(initialAccidents);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial data load via API layer
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        const [vList, dList, rList, insList, accList] = await Promise.all([
          vehiclesApi.getVehicles(),
          driversApi.getDrivers(),
          rentalsApi.getRentals(),
          inspectionsApi.getInspections(),
          inspectionsApi.getAccidents()
        ]);

        if (isMounted) {
          if (vList?.length) setVehicles(vList);
          if (dList?.length) setDrivers(dList);
          if (rList?.length) setRentals(rList);
          if (insList?.length) setInspections(insList);
          if (accList?.length) setAccidents(accList);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load fleet data via API layer:', err);
          setError(err.message || 'Failed to load fleet records');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper: Update vehicle status (e.g. 'Available', 'Rented', 'Maintenance') and optionally assign/unassign driver & update mileage
  const updateVehicleStatus = useCallback((vehicleIdOrPlate, newStatus, driverName = null, newMileage = null) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleIdOrPlate || v.plate === vehicleIdOrPlate || v.name === vehicleIdOrPlate) {
          const updated = {
            ...v,
            status: newStatus,
            ...(driverName !== null ? { driver: driverName } : {}),
            ...(newMileage !== null && !isNaN(Number(newMileage)) ? { mileage: `${Number(newMileage).toLocaleString()} mi` } : {})
          };
          // Asynchronously sync to API layer
          vehiclesApi.updateVehicle(v.id, updated).catch(console.error);
          return updated;
        }
        return v;
      })
    );

    auditApi.appendAuditLog({
      action: 'Vehicle Status Changed',
      module: 'Vehicles',
      details: `Vehicle "${vehicleIdOrPlate}" updated to "${newStatus}"${driverName ? ` (Driver: ${driverName})` : ''}`
    });
  }, []);

  // Helper: Update driver vehicle assignment
  const updateDriverVehicle = useCallback((driverIdOrName, vehicleName = null) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverIdOrName || d.name === driverIdOrName) {
          const updated = {
            ...d,
            ...(vehicleName !== null ? { vehicle: vehicleName } : {})
          };
          driversApi.updateDriver(d.id, updated).catch(console.error);
          return updated;
        }
        return d;
      })
    );
  }, []);

  // Helper: Add or update rental
  const saveRental = useCallback((rentalData) => {
    setRentals((prev) => {
      const exists = prev.some((r) => r.id === rentalData.id);
      if (exists) {
        rentalsApi.updateRental(rentalData.id, rentalData).catch(console.error);
        return prev.map((r) => (r.id === rentalData.id ? { ...r, ...rentalData } : r));
      }
      rentalsApi.createRental(rentalData).catch(console.error);
      return [rentalData, ...prev];
    });

    auditApi.appendAuditLog({
      action: 'Rental Agreement Saved',
      module: 'Rentals',
      details: `Rental contract ${rentalData.id || ''} saved for ${rentalData.customer || rentalData.driver || 'Driver'}`
    });
  }, []);

  const updateRental = useCallback((rentalId, patch) => {
    setRentals((prev) =>
      prev.map((r) => {
        if (r.id === rentalId) {
          const updated = { ...r, ...patch };
          rentalsApi.updateRental(rentalId, updated).catch(console.error);
          return updated;
        }
        return r;
      })
    );
  }, []);

  // Helper: Add inspection record (e.g. check-out pickup or check-in return)
  const addInspection = useCallback((inspectionData) => {
    setInspections((prev) => [inspectionData, ...prev]);
    inspectionsApi.createInspection(inspectionData).catch(console.error);
    auditApi.appendAuditLog({
      action: 'Vehicle Inspection Completed',
      module: 'Inspections',
      details: `Inspection logged for ${inspectionData.vehicle || inspectionData.vehicleId}`
    });
  }, []);

  // Entity resolvers
  const resolveVehicle = useCallback(
    (rentalOrVehicleRef) => {
      if (!rentalOrVehicleRef) return null;
      const ref =
        typeof rentalOrVehicleRef === 'string'
          ? rentalOrVehicleRef
          : rentalOrVehicleRef.vehicleId || rentalOrVehicleRef.vehicle;
      if (!ref) return null;

      return (
        vehicles.find(
          (v) =>
            v.id === ref ||
            v.plate === ref ||
            v.name.toLowerCase() === ref.toLowerCase() ||
            ref.includes(v.plate) ||
            ref.includes(v.name)
        ) || null
      );
    },
    [vehicles]
  );

  const resolveDriver = useCallback(
    (rentalOrDriverRef) => {
      if (!rentalOrDriverRef) return null;
      const ref =
        typeof rentalOrDriverRef === 'string'
          ? rentalOrDriverRef
          : rentalOrDriverRef.driverId || rentalOrDriverRef.driver;
      if (!ref) return null;

      return (
        drivers.find(
          (d) =>
            d.id === ref ||
            d.name.toLowerCase() === ref.toLowerCase() ||
            ref.includes(d.name)
        ) || null
      );
    },
    [drivers]
  );

  const resolveRental = useCallback(
    (rentalId) => {
      if (!rentalId) return null;
      return rentals.find((r) => r.id === rentalId) || null;
    },
    [rentals]
  );

  const value = useMemo(
    () => ({
      rentals,
      setRentals,
      saveRental,
      updateRental,
      vehicles,
      setVehicles,
      updateVehicleStatus,
      drivers,
      setDrivers,
      updateDriverVehicle,
      inspections,
      setInspections,
      addInspection,
      accidents,
      setAccidents,
      resolveVehicle,
      resolveDriver,
      resolveRental,
      isLoading,
      error
    }),
    [
      rentals,
      vehicles,
      drivers,
      inspections,
      accidents,
      saveRental,
      updateRental,
      updateVehicleStatus,
      updateDriverVehicle,
      addInspection,
      resolveVehicle,
      resolveDriver,
      resolveRental,
      isLoading,
      error
    ]
  );

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

// Hook with safe fallback
export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    return {
      rentals: initialRentals,
      setRentals: () => {},
      saveRental: () => {},
      updateRental: () => {},
      vehicles: initialVehicles,
      setVehicles: () => {},
      updateVehicleStatus: () => {},
      drivers: initialDrivers,
      setDrivers: () => {},
      updateDriverVehicle: () => {},
      inspections: initialInspections,
      setInspections: () => {},
      addInspection: () => {},
      accidents: initialAccidents,
      setAccidents: () => {},
      resolveVehicle: () => null,
      resolveDriver: () => null,
      resolveRental: () => null,
      isLoading: false,
      error: null
    };
  }
  return context;
}
