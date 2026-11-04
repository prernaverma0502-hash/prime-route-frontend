import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  initialRentals,
  initialVehicles,
  initialDrivers,
  initialInspections,
  initialAccidents
} from '../data/mockData';

const FleetContext = createContext(null);

export function FleetProvider({ children }) {
  const [rentals, setRentals] = useState(initialRentals);
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [inspections, setInspections] = useState(initialInspections);
  const [accidents, setAccidents] = useState(initialAccidents);

  // Helper: Update vehicle status (e.g. 'Available', 'Rented', 'Maintenance') and optionally assign/unassign driver
  const updateVehicleStatus = useCallback((vehicleIdOrPlate, newStatus, driverName = null) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleIdOrPlate || v.plate === vehicleIdOrPlate || v.name === vehicleIdOrPlate) {
          return {
            ...v,
            status: newStatus,
            ...(driverName !== null ? { driver: driverName } : {})
          };
        }
        return v;
      })
    );
  }, []);

  // Helper: Update driver vehicle assignment
  const updateDriverVehicle = useCallback((driverIdOrName, vehicleName = null) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverIdOrName || d.name === driverIdOrName) {
          return {
            ...d,
            ...(vehicleName !== null ? { vehicle: vehicleName } : {})
          };
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
        return prev.map((r) => (r.id === rentalData.id ? { ...r, ...rentalData } : r));
      }
      return [rentalData, ...prev];
    });
  }, []);

  const updateRental = useCallback((rentalId, patch) => {
    setRentals((prev) =>
      prev.map((r) => (r.id === rentalId ? { ...r, ...patch } : r))
    );
  }, []);

  // Helper: Add inspection record (e.g. check-out pickup or check-in return)
  const addInspection = useCallback((inspectionData) => {
    setInspections((prev) => [inspectionData, ...prev]);
  }, []);

  // Backward-compatible entity resolvers: resolve by ID first, then by text name/plate
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
      resolveRental
    ]
  );

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

// Hook with safe fallback
export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    // Graceful fallback for standalone usage
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
    };
  }
  return context;
}

