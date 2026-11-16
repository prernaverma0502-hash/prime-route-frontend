-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: primeroute
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accidents`
--

DROP TABLE IF EXISTS `accidents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accidents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `driver_id` bigint(20) unsigned DEFAULT NULL,
  `rental_id` bigint(20) unsigned DEFAULT NULL,
  `accident_date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `police_report_no` varchar(100) DEFAULT NULL,
  `estimated_damage` decimal(12,2) DEFAULT NULL,
  `status` enum('reported','under_investigation','repair_pending','resolved') NOT NULL DEFAULT 'reported',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `accidents_vehicle_id_index` (`vehicle_id`),
  KEY `accidents_driver_id_index` (`driver_id`),
  KEY `accidents_rental_id_index` (`rental_id`),
  KEY `accidents_accident_date_index` (`accident_date`),
  KEY `accidents_status_index` (`status`),
  CONSTRAINT `accidents_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `accidents_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  CONSTRAINT `accidents_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accidents`
--

LOCK TABLES `accidents` WRITE;
/*!40000 ALTER TABLE `accidents` DISABLE KEYS */;
/*!40000 ALTER TABLE `accidents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alert_history`
--

DROP TABLE IF EXISTS `alert_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alert_history` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rule_id` bigint(20) unsigned DEFAULT NULL,
  `event_type` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `severity` enum('info','warning','danger') NOT NULL DEFAULT 'info',
  `message` text DEFAULT NULL,
  `related_entity_type` varchar(100) DEFAULT NULL,
  `related_entity_id` bigint(20) unsigned DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `resolved_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `alert_history_rule_id_index` (`rule_id`),
  KEY `alert_history_event_type_index` (`event_type`),
  KEY `alert_history_severity_index` (`severity`),
  KEY `alert_history_related_entity_type_related_entity_id_index` (`related_entity_type`,`related_entity_id`),
  KEY `alert_history_resolved_at_index` (`resolved_at`),
  KEY `alert_history_resolved_by_index` (`resolved_by`),
  CONSTRAINT `alert_history_resolved_by_foreign` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `alert_history_rule_id_foreign` FOREIGN KEY (`rule_id`) REFERENCES `notification_rules` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alert_history`
--

LOCK TABLES `alert_history` WRITE;
/*!40000 ALTER TABLE `alert_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `alert_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `module` varchar(100) NOT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(100) DEFAULT NULL,
  `entity_id` bigint(20) unsigned DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_index` (`user_id`),
  KEY `audit_logs_module_index` (`module`),
  KEY `audit_logs_action_index` (`action`),
  KEY `audit_logs_entity_type_entity_id_index` (`entity_type`,`entity_id`),
  KEY `audit_logs_created_at_index` (`created_at`),
  CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_versions`
--

DROP TABLE IF EXISTS `document_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `document_versions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `document_id` bigint(20) unsigned NOT NULL,
  `version_number` int(11) NOT NULL DEFAULT 1,
  `file_url` varchar(500) NOT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `uploaded_by` bigint(20) unsigned DEFAULT NULL,
  `change_summary` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `document_versions_document_id_index` (`document_id`),
  KEY `document_versions_uploaded_by_index` (`uploaded_by`),
  CONSTRAINT `document_versions_document_id_foreign` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  CONSTRAINT `document_versions_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_versions`
--

LOCK TABLES `document_versions` WRITE;
/*!40000 ALTER TABLE `document_versions` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `document_type` varchar(100) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size` int(10) unsigned DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `vehicle_id` bigint(20) unsigned DEFAULT NULL,
  `driver_id` bigint(20) unsigned DEFAULT NULL,
  `rental_id` bigint(20) unsigned DEFAULT NULL,
  `uploaded_by` bigint(20) unsigned DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `documents_vehicle_id_index` (`vehicle_id`),
  KEY `documents_driver_id_index` (`driver_id`),
  KEY `documents_rental_id_index` (`rental_id`),
  KEY `documents_uploaded_by_index` (`uploaded_by`),
  KEY `documents_document_type_index` (`document_type`),
  KEY `documents_expiry_date_index` (`expiry_date`),
  CONSTRAINT `documents_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `documents_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  CONSTRAINT `documents_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`),
  CONSTRAINT `documents_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drivers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `license_number` varchar(100) DEFAULT NULL,
  `license_state` varchar(10) DEFAULT NULL,
  `license_expiry` date DEFAULT NULL,
  `status` enum('active','inactive','suspended','pending') NOT NULL DEFAULT 'pending',
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `deposit_held` decimal(12,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `drivers_email_index` (`email`),
  KEY `drivers_license_number_index` (`license_number`),
  KEY `drivers_license_expiry_index` (`license_expiry`),
  KEY `drivers_status_index` (`status`),
  KEY `drivers_archived_at_index` (`archived_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (1,'Marcus','Vance','marcus.vance@primeroute.io','+1 (555) 234-8901','DL-NY-9028148','NY','2026-09-14','active',0.00,500.00,'Driver with Apex Logistics contract.',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(2,'David','Miller','david.miller@gmail.com','+1 (555) 345-6712','DL-CA-4491029','CA','2026-11-20','active',0.00,600.00,'Commercial delivery driver.',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(3,'Sarah','Jenkins','sjenkins@outlook.com','+1 (555) 456-7890','DL-IL-8849103','IL','2026-04-18','active',0.00,500.00,'Urban Express Services contractor.',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(4,'Alexander','Reed','alex.reed@ridesharefleet.com','+1 (555) 567-8901','DL-TX-5510928','TX','2027-01-10','active',150.00,500.00,'Green Mobility Corp EV driver.',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(5,'Elena','Rostova','elena.rostova@vipchauffeur.org','+1 (555) 678-9012','DL-FL-7729104','FL','2026-07-25','active',0.00,1000.00,'Executive livery service chauffeur.',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(6,'Carlos','Mendez','cmendez88@gmail.com','+1 (555) 789-0123','DL-WA-3391028','WA','2025-12-05','pending',0.00,0.00,'Application under review.',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28');
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_paperwork`
--

DROP TABLE IF EXISTS `employee_paperwork`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employee_paperwork` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `driver_id` bigint(20) unsigned DEFAULT NULL,
  `full_name` varchar(200) NOT NULL,
  `ssn_last4` varchar(4) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `emergency_contact` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`emergency_contact`)),
  `direct_deposit_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`direct_deposit_details`)),
  `status` enum('draft','submitted','under_review','approved','rejected') NOT NULL DEFAULT 'draft',
  `submitted_at` datetime DEFAULT NULL,
  `reviewed_by` bigint(20) unsigned DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  `signature_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `employee_paperwork_user_id_index` (`user_id`),
  KEY `employee_paperwork_driver_id_index` (`driver_id`),
  KEY `employee_paperwork_status_index` (`status`),
  KEY `employee_paperwork_submitted_at_index` (`submitted_at`),
  KEY `employee_paperwork_reviewed_by_index` (`reviewed_by`),
  CONSTRAINT `employee_paperwork_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `employee_paperwork_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `employee_paperwork_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_paperwork`
--

LOCK TABLES `employee_paperwork` WRITE;
/*!40000 ALTER TABLE `employee_paperwork` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee_paperwork` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned DEFAULT NULL,
  `vendor_id` bigint(20) unsigned DEFAULT NULL,
  `rental_id` bigint(20) unsigned DEFAULT NULL,
  `recorded_by` bigint(20) unsigned DEFAULT NULL,
  `approver_id` bigint(20) unsigned DEFAULT NULL,
  `category` enum('insurance','registration','oil_change','repairs','tires','towing','cleaning','tolls','parking','tickets','marketing','software','bank_fees','office','legal_accounting','other') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `expense_date` date NOT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `invoice_receipt_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','approved','rejected','paid') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `expenses_recorded_by_foreign` (`recorded_by`),
  KEY `expenses_approver_id_foreign` (`approver_id`),
  KEY `expenses_vehicle_id_index` (`vehicle_id`),
  KEY `expenses_vendor_id_index` (`vendor_id`),
  KEY `expenses_rental_id_index` (`rental_id`),
  KEY `expenses_category_index` (`category`),
  KEY `expenses_expense_date_index` (`expense_date`),
  KEY `expenses_status_index` (`status`),
  CONSTRAINT `expenses_approver_id_foreign` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `expenses_recorded_by_foreign` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`),
  CONSTRAINT `expenses_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  CONSTRAINT `expenses_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `expenses_vendor_id_foreign` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_photos`
--

DROP TABLE IF EXISTS `inspection_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inspection_photos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `inspection_id` bigint(20) unsigned NOT NULL,
  `photo_url` varchar(500) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `tag` enum('exterior_front','exterior_back','exterior_left','exterior_right','interior','dashboard_odometer','damage_detail','other') NOT NULL DEFAULT 'other',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `inspection_photos_inspection_id_index` (`inspection_id`),
  KEY `inspection_photos_tag_index` (`tag`),
  CONSTRAINT `inspection_photos_inspection_id_foreign` FOREIGN KEY (`inspection_id`) REFERENCES `inspections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_photos`
--

LOCK TABLES `inspection_photos` WRITE;
/*!40000 ALTER TABLE `inspection_photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `inspection_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspections`
--

DROP TABLE IF EXISTS `inspections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inspections` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rental_id` bigint(20) unsigned DEFAULT NULL,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `inspector_id` bigint(20) unsigned DEFAULT NULL,
  `inspection_type` enum('pickup','return','routine') NOT NULL,
  `inspection_date` datetime NOT NULL,
  `odometer` int(11) NOT NULL,
  `fuel_level` varchar(50) DEFAULT NULL,
  `condition_checklist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`condition_checklist`)),
  `notes` text DEFAULT NULL,
  `driver_acknowledged` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `inspections_rental_id_index` (`rental_id`),
  KEY `inspections_vehicle_id_index` (`vehicle_id`),
  KEY `inspections_inspector_id_index` (`inspector_id`),
  KEY `inspections_inspection_type_index` (`inspection_type`),
  KEY `inspections_inspection_date_index` (`inspection_date`),
  CONSTRAINT `inspections_inspector_id_foreign` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`),
  CONSTRAINT `inspections_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  CONSTRAINT `inspections_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspections`
--

LOCK TABLES `inspections` WRITE;
/*!40000 ALTER TABLE `inspections` DISABLE KEYS */;
/*!40000 ALTER TABLE `inspections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance_claims`
--

DROP TABLE IF EXISTS `insurance_claims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `insurance_claims` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `policy_id` bigint(20) unsigned NOT NULL,
  `accident_id` bigint(20) unsigned DEFAULT NULL,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `claim_number` varchar(100) NOT NULL,
  `claim_date` date NOT NULL,
  `claim_amount` decimal(12,2) NOT NULL,
  `payout_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `deductible_applied` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('submitted','under_review','approved','denied','settled') NOT NULL DEFAULT 'submitted',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `insurance_claims_policy_id_index` (`policy_id`),
  KEY `insurance_claims_accident_id_index` (`accident_id`),
  KEY `insurance_claims_vehicle_id_index` (`vehicle_id`),
  KEY `insurance_claims_claim_number_index` (`claim_number`),
  KEY `insurance_claims_status_index` (`status`),
  CONSTRAINT `insurance_claims_accident_id_foreign` FOREIGN KEY (`accident_id`) REFERENCES `accidents` (`id`),
  CONSTRAINT `insurance_claims_policy_id_foreign` FOREIGN KEY (`policy_id`) REFERENCES `insurance_policies` (`id`),
  CONSTRAINT `insurance_claims_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance_claims`
--

LOCK TABLES `insurance_claims` WRITE;
/*!40000 ALTER TABLE `insurance_claims` DISABLE KEYS */;
/*!40000 ALTER TABLE `insurance_claims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance_policies`
--

DROP TABLE IF EXISTS `insurance_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `insurance_policies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned DEFAULT NULL,
  `policy_number` varchar(100) NOT NULL,
  `insurer_name` varchar(150) NOT NULL,
  `coverage_type` varchar(100) NOT NULL,
  `premium` decimal(12,2) NOT NULL,
  `deductible` decimal(12,2) NOT NULL DEFAULT 0.00,
  `effective_date` date NOT NULL,
  `expiry_date` date NOT NULL,
  `status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `insurance_policies_vehicle_id_index` (`vehicle_id`),
  KEY `insurance_policies_policy_number_index` (`policy_number`),
  KEY `insurance_policies_expiry_date_index` (`expiry_date`),
  KEY `insurance_policies_status_index` (`status`),
  CONSTRAINT `insurance_policies_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance_policies`
--

LOCK TABLES `insurance_policies` WRITE;
/*!40000 ALTER TABLE `insurance_policies` DISABLE KEYS */;
/*!40000 ALTER TABLE `insurance_policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invitations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `role` enum('owner','secondary_admin','finance','fleet_maintenance','rental_operations','readonly_manager') NOT NULL,
  `token` varchar(255) NOT NULL,
  `invited_by` bigint(20) unsigned DEFAULT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `accepted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `invitations_token_unique` (`token`),
  KEY `invitations_email_index` (`email`),
  KEY `invitations_invited_by_index` (`invited_by`),
  CONSTRAINT `invitations_invited_by_foreign` FOREIGN KEY (`invited_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitations`
--

LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoice_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint(20) unsigned NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` enum('insurance','registration','oil_change','repairs','tires','towing','cleaning','tolls','parking','tickets','marketing','software','bank_fees','office','legal_accounting','other') DEFAULT NULL,
  `quantity` decimal(8,2) NOT NULL DEFAULT 1.00,
  `unit_price` decimal(12,2) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `invoice_items_invoice_id_index` (`invoice_id`),
  CONSTRAINT `invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(100) NOT NULL,
  `rental_id` bigint(20) unsigned DEFAULT NULL,
  `driver_id` bigint(20) unsigned NOT NULL,
  `issued_by` bigint(20) unsigned DEFAULT NULL,
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `tax` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL,
  `paid_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('draft','issued','partially_paid','paid','overdue','cancelled','void') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoices_invoice_number_unique` (`invoice_number`),
  KEY `invoices_rental_id_index` (`rental_id`),
  KEY `invoices_driver_id_index` (`driver_id`),
  KEY `invoices_issued_by_index` (`issued_by`),
  KEY `invoices_issue_date_index` (`issue_date`),
  KEY `invoices_due_date_index` (`due_date`),
  KEY `invoices_status_index` (`status`),
  CONSTRAINT `invoices_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `invoices_issued_by_foreign` FOREIGN KEY (`issued_by`) REFERENCES `users` (`id`),
  CONSTRAINT `invoices_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
/*!40000 ALTER TABLE `knex_migrations` DISABLE KEYS */;
INSERT INTO `knex_migrations` VALUES (1,'001_create_users_and_auth_tables.js',1,'2026-11-16 07:32:09'),(2,'002_create_audit_logs_table.js',1,'2026-11-16 07:32:10'),(3,'003_create_vehicles_and_drivers_tables.js',1,'2026-11-16 07:32:10'),(4,'004_create_rentals_tables.js',1,'2026-11-16 07:32:11'),(5,'005_create_inspections_and_photos_tables.js',1,'2026-11-16 07:32:12'),(6,'006_create_accidents_and_insurance_tables.js',1,'2026-11-16 07:32:12'),(7,'007_create_vendors_expenses_and_maintenance_tables.js',1,'2026-11-16 07:32:14'),(8,'008_create_invoices_and_ledger_tables.js',1,'2026-11-16 07:32:15'),(9,'009_create_tolls_tickets_table.js',1,'2026-11-16 07:32:16'),(10,'010_create_documents_tables.js',1,'2026-11-16 07:32:16'),(11,'011_create_employee_paperwork_table.js',1,'2026-11-16 07:32:17'),(12,'012_create_settings_and_notifications_tables.js',1,'2026-11-16 07:32:17');
/*!40000 ALTER TABLE `knex_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;
INSERT INTO `knex_migrations_lock` VALUES (1,0);
/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ledger_entries`
--

DROP TABLE IF EXISTS `ledger_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ledger_entries` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rental_id` bigint(20) unsigned DEFAULT NULL,
  `driver_id` bigint(20) unsigned DEFAULT NULL,
  `invoice_id` bigint(20) unsigned DEFAULT NULL,
  `recorded_by` bigint(20) unsigned DEFAULT NULL,
  `entry_type` enum('charge','payment','deposit','refund','credit','adjustment','reversal') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` enum('cash','zelle','stripe','card','bank_transfer','credit','adjustment') DEFAULT NULL,
  `reference_no` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `entry_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ledger_entries_rental_id_index` (`rental_id`),
  KEY `ledger_entries_driver_id_index` (`driver_id`),
  KEY `ledger_entries_invoice_id_index` (`invoice_id`),
  KEY `ledger_entries_recorded_by_index` (`recorded_by`),
  KEY `ledger_entries_entry_type_index` (`entry_type`),
  KEY `ledger_entries_reference_no_index` (`reference_no`),
  KEY `ledger_entries_entry_date_index` (`entry_date`),
  CONSTRAINT `ledger_entries_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `ledger_entries_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  CONSTRAINT `ledger_entries_recorded_by_foreign` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`),
  CONSTRAINT `ledger_entries_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ledger_entries`
--

LOCK TABLES `ledger_entries` WRITE;
/*!40000 ALTER TABLE `ledger_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `ledger_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_records`
--

DROP TABLE IF EXISTS `maintenance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintenance_records` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `vendor_id` bigint(20) unsigned DEFAULT NULL,
  `service_date` date NOT NULL,
  `odometer` int(11) NOT NULL,
  `service_type` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `cost` decimal(12,2) NOT NULL,
  `invoice_url` varchar(500) DEFAULT NULL,
  `next_service_odometer` int(11) DEFAULT NULL,
  `next_service_date` date DEFAULT NULL,
  `status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `maintenance_records_vehicle_id_index` (`vehicle_id`),
  KEY `maintenance_records_vendor_id_index` (`vendor_id`),
  KEY `maintenance_records_service_date_index` (`service_date`),
  KEY `maintenance_records_status_index` (`status`),
  CONSTRAINT `maintenance_records_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  CONSTRAINT `maintenance_records_vendor_id_foreign` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_records`
--

LOCK TABLES `maintenance_records` WRITE;
/*!40000 ALTER TABLE `maintenance_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mfa_backup_codes`
--

DROP TABLE IF EXISTS `mfa_backup_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mfa_backup_codes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `code_hash` varchar(255) NOT NULL,
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `mfa_backup_codes_user_id_index` (`user_id`),
  CONSTRAINT `mfa_backup_codes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mfa_backup_codes`
--

LOCK TABLES `mfa_backup_codes` WRITE;
/*!40000 ALTER TABLE `mfa_backup_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `mfa_backup_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_rules`
--

DROP TABLE IF EXISTS `notification_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification_rules` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `event_type` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `channel` enum('email','sms','both') NOT NULL DEFAULT 'email',
  `lead_time_days` int(11) NOT NULL DEFAULT 0,
  `recipients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`recipients`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `notification_rules_event_type_unique` (`event_type`),
  KEY `notification_rules_event_type_index` (`event_type`),
  KEY `notification_rules_is_active_index` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_rules`
--

LOCK TABLES `notification_rules` WRITE;
/*!40000 ALTER TABLE `notification_rules` DISABLE KEYS */;
INSERT INTO `notification_rules` VALUES (1,'overdue_payments','Overdue Driver Lease Payments','both',1,'[\"finance\",\"owner\"]',1,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(2,'contract_ending','Upcoming Rental Contract Expirations','email',7,'[\"rental_operations\",\"secondary_admin\"]',1,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(3,'document_expiry','Driver License, Registration or Insurance Expiration','both',14,'[\"fleet_maintenance\",\"rental_operations\"]',1,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(4,'oil_change_due','Vehicle 5,000-Mile Oil Change Due','email',3,'[\"fleet_maintenance\"]',1,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(5,'unpaid_tolls_tickets','Unpaid Tolls or Violation Citations Received','email',2,'[\"rental_operations\",\"finance\"]',1,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(6,'missing_documents','Missing Required Driver or Vehicle Documents','email',0,'[\"rental_operations\"]',1,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(7,'unresolved_accidents','Unresolved Accident Reports & Open Insurance Claims','both',0,'[\"fleet_maintenance\",\"owner\"]',1,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(8,'vehicles_awaiting_inspection','Vehicles Awaiting Pickup or Return Inspection','email',0,'[\"fleet_maintenance\",\"rental_operations\"]',1,'2026-11-16 07:36:28','2026-11-16 07:36:28');
/*!40000 ALTER TABLE `notification_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `password_resets_user_id_index` (`user_id`),
  KEY `password_resets_token_hash_index` (`token_hash`),
  CONSTRAINT `password_resets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `revoked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `refresh_tokens_user_id_index` (`user_id`),
  KEY `refresh_tokens_token_hash_index` (`token_hash`),
  KEY `refresh_tokens_expires_at_index` (`expires_at`),
  CONSTRAINT `refresh_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_amendments`
--

DROP TABLE IF EXISTS `rental_amendments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rental_amendments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rental_id` bigint(20) unsigned NOT NULL,
  `amended_by` bigint(20) unsigned DEFAULT NULL,
  `amendment_type` varchar(100) NOT NULL,
  `previous_end_date` date DEFAULT NULL,
  `new_end_date` date DEFAULT NULL,
  `previous_weekly_rate` decimal(12,2) DEFAULT NULL,
  `new_weekly_rate` decimal(12,2) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `rental_amendments_rental_id_index` (`rental_id`),
  KEY `rental_amendments_amended_by_index` (`amended_by`),
  CONSTRAINT `rental_amendments_amended_by_foreign` FOREIGN KEY (`amended_by`) REFERENCES `users` (`id`),
  CONSTRAINT `rental_amendments_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_amendments`
--

LOCK TABLES `rental_amendments` WRITE;
/*!40000 ALTER TABLE `rental_amendments` DISABLE KEYS */;
/*!40000 ALTER TABLE `rental_amendments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_signatures`
--

DROP TABLE IF EXISTS `rental_signatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rental_signatures` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rental_id` bigint(20) unsigned NOT NULL,
  `signer_name` varchar(255) NOT NULL,
  `signer_role` enum('driver','owner','manager') NOT NULL,
  `signature_data` longtext NOT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `signed_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `rental_signatures_rental_id_index` (`rental_id`),
  KEY `rental_signatures_signed_at_index` (`signed_at`),
  CONSTRAINT `rental_signatures_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_signatures`
--

LOCK TABLES `rental_signatures` WRITE;
/*!40000 ALTER TABLE `rental_signatures` DISABLE KEYS */;
/*!40000 ALTER TABLE `rental_signatures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rentals`
--

DROP TABLE IF EXISTS `rentals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rentals` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `contract_no` varchar(100) NOT NULL,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `driver_id` bigint(20) unsigned NOT NULL,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `status` enum('draft','awaiting_signature','active','renewed','terminated','completed') NOT NULL DEFAULT 'draft',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `weekly_rate` decimal(12,2) NOT NULL,
  `deposit_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `mileage_at_pickup` int(11) NOT NULL DEFAULT 0,
  `mileage_at_return` int(11) DEFAULT NULL,
  `terms` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `rentals_contract_no_unique` (`contract_no`),
  KEY `rentals_vehicle_id_index` (`vehicle_id`),
  KEY `rentals_driver_id_index` (`driver_id`),
  KEY `rentals_created_by_index` (`created_by`),
  KEY `rentals_status_index` (`status`),
  KEY `rentals_start_date_index` (`start_date`),
  KEY `rentals_end_date_index` (`end_date`),
  CONSTRAINT `rentals_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `rentals_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `rentals_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rentals`
--

LOCK TABLES `rentals` WRITE;
/*!40000 ALTER TABLE `rentals` DISABLE KEYS */;
INSERT INTO `rentals` VALUES (1,'RNT-2024-089',1,1,1,'active','2025-07-01','2025-07-15',487.50,500.00,24500,NULL,'Premium commercial fleet lease agreement.','2026-11-16 07:36:28','2026-11-16 07:36:28'),(2,'RNT-2024-090',3,3,1,'active','2025-07-05','2025-07-19',420.00,500.00,42100,NULL,'Rideshare commercial rental with mileage tier.','2026-11-16 07:36:28','2026-11-16 07:36:28'),(3,'RNT-2024-091',5,4,1,'awaiting_signature','2025-07-10','2025-07-24',462.50,500.00,12400,NULL,'Supercharging allowance included.','2026-11-16 07:36:28','2026-11-16 07:36:28'),(4,'RNT-2024-092',2,2,1,'completed','2025-06-15','2025-07-12',525.00,600.00,28100,31200,'Vehicle returned in pristine condition.','2026-11-16 07:36:28','2026-11-16 07:36:28'),(5,'RNT-2024-093',7,3,1,'draft','2025-07-22','2025-07-29',1100.00,500.00,22400,NULL,'Tow package requested for filming gear.','2026-11-16 07:36:28','2026-11-16 07:36:28');
/*!40000 ALTER TABLE `rentals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_setting_key_unique` (`setting_key`),
  KEY `settings_setting_key_index` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'company_name','PrimeRoute Fleet Solutions','Official registered company business name','2026-11-16 07:36:28','2026-11-16 07:36:28'),(2,'company_email','operations@primeroute.io','Primary customer support and operations email','2026-11-16 07:36:28','2026-11-16 07:36:28'),(3,'company_phone','+1 (555) 234-5678','Primary company phone number','2026-11-16 07:36:28','2026-11-16 07:36:28'),(4,'company_address','1200 Fleet Management Way, Suite 400, Chicago, IL 60607','Headquarters physical address','2026-11-16 07:36:28','2026-11-16 07:36:28'),(5,'oil_change_interval_miles','5000','Standard mileage threshold trigger for scheduled routine oil change','2026-11-16 07:36:28','2026-11-16 07:36:28'),(6,'default_weekly_deposit','500.00','Standard refundable security deposit held per vehicle lease','2026-11-16 07:36:28','2026-11-16 07:36:28'),(7,'currency','USD','Default operational and accounting currency','2026-11-16 07:36:28','2026-11-16 07:36:28'),(8,'timezone','America/Chicago','Default operational timezone','2026-11-16 07:36:28','2026-11-16 07:36:28'),(9,'late_fee_percentage','5.00','Percentage penalty applied on overdue driver lease balances','2026-11-16 07:36:28','2026-11-16 07:36:28');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tolls_tickets`
--

DROP TABLE IF EXISTS `tolls_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tolls_tickets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `driver_id` bigint(20) unsigned DEFAULT NULL,
  `rental_id` bigint(20) unsigned DEFAULT NULL,
  `violation_number` varchar(100) NOT NULL,
  `violation_date` datetime NOT NULL,
  `issuing_authority` varchar(150) NOT NULL,
  `violation_type` enum('toll','speeding','red_light','parking','other') NOT NULL DEFAULT 'toll',
  `amount` decimal(12,2) NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('unassigned','under_review','assigned','charged','paid','disputed') NOT NULL DEFAULT 'unassigned',
  `driver_charged` tinyint(1) NOT NULL DEFAULT 0,
  `invoice_id` bigint(20) unsigned DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `tolls_tickets_vehicle_id_index` (`vehicle_id`),
  KEY `tolls_tickets_driver_id_index` (`driver_id`),
  KEY `tolls_tickets_rental_id_index` (`rental_id`),
  KEY `tolls_tickets_violation_number_index` (`violation_number`),
  KEY `tolls_tickets_violation_date_index` (`violation_date`),
  KEY `tolls_tickets_status_index` (`status`),
  KEY `tolls_tickets_invoice_id_index` (`invoice_id`),
  CONSTRAINT `tolls_tickets_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `tolls_tickets_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  CONSTRAINT `tolls_tickets_rental_id_foreign` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  CONSTRAINT `tolls_tickets_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tolls_tickets`
--

LOCK TABLES `tolls_tickets` WRITE;
/*!40000 ALTER TABLE `tolls_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tolls_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('owner','secondary_admin','finance','fleet_maintenance','rental_operations','readonly_manager') NOT NULL DEFAULT 'readonly_manager',
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `phone` varchar(50) DEFAULT NULL,
  `mfa_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `mfa_secret` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_email_index` (`email`),
  KEY `users_role_index` (`role`),
  KEY `users_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Marcus Brody','marcus.brody@primeroute.io','$2a$10$B7./cqCSYMTmaDHLRebOD.avikokxXcgOX110DquXBNvcwXnxT0gW','owner','active','+1 (555) 019-2831',0,NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(2,'Elena Vance','elena.vance@primeroute.io','$2a$10$B7./cqCSYMTmaDHLRebOD.avikokxXcgOX110DquXBNvcwXnxT0gW','secondary_admin','active','+1 (555) 019-2832',0,NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(3,'Michael Chang','michael.chang@primeroute.io','$2a$10$B7./cqCSYMTmaDHLRebOD.avikokxXcgOX110DquXBNvcwXnxT0gW','finance','active','+1 (555) 019-2833',0,NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(4,'Tom Gallagher','tom.gallagher@primeroute.io','$2a$10$B7./cqCSYMTmaDHLRebOD.avikokxXcgOX110DquXBNvcwXnxT0gW','fleet_maintenance','active','+1 (555) 019-2834',0,NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(5,'Sarah Connor','sarah.connor@primeroute.io','$2a$10$B7./cqCSYMTmaDHLRebOD.avikokxXcgOX110DquXBNvcwXnxT0gW','rental_operations','active','+1 (555) 019-2835',0,NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(6,'Rachel Green','rachel.green@primeroute.io','$2a$10$B7./cqCSYMTmaDHLRebOD.avikokxXcgOX110DquXBNvcwXnxT0gW','readonly_manager','active','+1 (555) 019-2836',0,NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_assignments`
--

DROP TABLE IF EXISTS `vehicle_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicle_assignments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `driver_id` bigint(20) unsigned NOT NULL,
  `assigned_by` bigint(20) unsigned DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `vehicle_assignments_vehicle_id_index` (`vehicle_id`),
  KEY `vehicle_assignments_driver_id_index` (`driver_id`),
  KEY `vehicle_assignments_assigned_by_index` (`assigned_by`),
  KEY `vehicle_assignments_start_date_index` (`start_date`),
  KEY `vehicle_assignments_end_date_index` (`end_date`),
  CONSTRAINT `vehicle_assignments_assigned_by_foreign` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`),
  CONSTRAINT `vehicle_assignments_driver_id_foreign` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `vehicle_assignments_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_assignments`
--

LOCK TABLES `vehicle_assignments` WRITE;
/*!40000 ALTER TABLE `vehicle_assignments` DISABLE KEYS */;
INSERT INTO `vehicle_assignments` VALUES (1,1,1,1,'2025-07-01 09:00:00',NULL,'Active lease assignment','2026-11-16 07:36:28','2026-11-16 07:36:28'),(2,3,3,1,'2025-07-05 10:00:00',NULL,'Active rideshare assignment','2026-11-16 07:36:28','2026-11-16 07:36:28'),(3,2,2,1,'2025-06-15 08:30:00','2025-07-12 16:00:00','Completed delivery contract','2026-11-16 07:36:28','2026-11-16 07:36:28');
/*!40000 ALTER TABLE `vehicle_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vin` varchar(50) NOT NULL,
  `plate` varchar(50) NOT NULL,
  `make` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int(11) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `mileage` int(11) NOT NULL DEFAULT 0,
  `status` enum('available','reserved','rented','maintenance','unavailable','sold_retired') NOT NULL DEFAULT 'available',
  `purchase_date` date DEFAULT NULL,
  `purchase_price` decimal(12,2) DEFAULT NULL,
  `financing_details` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicles_vin_unique` (`vin`),
  UNIQUE KEY `vehicles_plate_unique` (`plate`),
  KEY `vehicles_status_index` (`status`),
  KEY `vehicles_make_model_index` (`make`,`model`),
  KEY `vehicles_archived_at_index` (`archived_at`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,'4T1B11HK5JU192831','PR-2024-TC','Toyota','Camry',2023,'Midnight Black',24500,'rented','2023-01-15',28500.00,'Commercial Fleet Finance LLC - Term 48 mo','JFK Airport Fleet Hub',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(2,'1HGCR2F83HA029341','PR-2024-HA','Honda','Accord',2023,'Platinum White',31200,'rented','2023-03-20',29800.00,'Direct Capital - Term 36 mo','LAX Cargo Hub',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(3,'5NPE24AF9NH194821','PR-2024-HS','Hyundai','Sonata',2022,'Electric Shadow',42100,'rented','2022-08-10',26200.00,'Paid in Full','Chicago Midway Hub',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(4,'1G1ZD5ST8LF104928','PR-2024-CM','Chevrolet','Malibu',2023,'Dark Ash Metallic',19800,'available','2023-05-18',27400.00,'Commercial Fleet Finance LLC','Main Yard Dispatch',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(5,'5YJ3E1EB8NF839210','PR-2024-TM','Tesla','Model 3',2024,'Deep Blue Metallic',14300,'rented','2024-01-10',44000.00,'Tesla Financial Services - Term 60 mo','Austin Domain Tech Center',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(6,'1GNSKBKC9PR901842','PR-2024-CT','Chevrolet','Tahoe',2023,'Summit White',38900,'maintenance','2023-02-14',62500.00,'Fleet Lease Corp','Metro Service Facility',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(7,'1FTFW1ED6PFB92841','PR-2024-FF','Ford','F-150',2023,'Carbonized Gray',22400,'available','2023-04-11',56000.00,'Direct Capital','Central Dispatch Yard',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28'),(8,'WBA53BJ04RCL91823','PR-2024-BM','BMW','5 Series',2024,'Phytonic Blue',9800,'rented','2024-02-28',64800.00,'BMW Financial Services','Downtown Executive Terminal',NULL,'2026-11-16 07:36:28','2026-11-16 07:36:28');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendors` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `service_type` varchar(100) DEFAULT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `vendors_name_index` (`name`),
  KEY `vendors_service_type_index` (`service_type`),
  KEY `vendors_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-16 14:32:42
