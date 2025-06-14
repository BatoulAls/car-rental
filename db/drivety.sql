-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 14, 2025 at 02:29 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `drivety`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `car_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `total_price` double DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `payment_method` enum('Cash','Card','Online') NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `car_id`, `customer_id`, `start_date`, `end_date`, `total_price`, `status`, `payment_method`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, '2025-05-22 20:42:51', '2025-05-31 08:00:00', 700, 'confirmed', 'Cash', '2025-05-05 22:50:00', '2025-05-05 22:50:00', '2025-05-14 20:42:48'),
(2, 1, 2, '2025-05-19 20:39:05', '2025-05-29 20:39:05', 300, 'confirmed', 'Cash', '2025-05-22 20:39:34', '2025-05-22 20:39:34', NULL),
(3, 1, 7, '2025-05-01 00:00:00', '2025-05-15 00:00:00', 15150, 'pending', 'Cash', '2025-06-14 00:19:03', '2025-06-14 00:19:03', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking_status_logs`
--

CREATE TABLE `booking_status_logs` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_status_logs`
--

INSERT INTO `booking_status_logs` (`id`, `booking_id`, `status`, `note`, `changed_by`, `changed_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'confirmed', 'Confirmed by vendor', 2, '2025-05-05 22:51:52', '2025-05-05 22:51:52', '2025-05-05 22:51:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `vendor_id` int(11) NOT NULL,
  `region_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `price_per_day` double DEFAULT NULL,
  `seats` int(11) DEFAULT NULL,
  `no_of_doors` int(11) DEFAULT NULL,
  `bags` int(11) DEFAULT NULL,
  `transmission` varchar(100) DEFAULT NULL,
  `engine_capacity` varchar(200) DEFAULT NULL,
  `regional_spec` varchar(100) DEFAULT NULL COMMENT 'Gcc',
  `fuel_type` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `location` text DEFAULT NULL,
  `availability_status` varchar(50) DEFAULT NULL,
  `mileage_limit` int(11) DEFAULT NULL,
  `additional_mileage_charge` double DEFAULT NULL,
  `insurance_included` tinyint(1) NOT NULL DEFAULT 1,
  `deposit_amount` double NOT NULL DEFAULT 0,
  `photo` text DEFAULT NULL,
  `average_rating` decimal(3,1) DEFAULT 0.0,
  `review_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `vendor_id`, `region_id`, `category_id`, `name`, `brand`, `model`, `year`, `price_per_day`, `seats`, `no_of_doors`, `bags`, `transmission`, `engine_capacity`, `regional_spec`, `fuel_type`, `description`, `color`, `location`, `availability_status`, `mileage_limit`, `additional_mileage_charge`, `insurance_included`, `deposit_amount`, `photo`, `average_rating`, `review_count`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 'Luxury Sedan', 'BMW', '5 Series', 2022, 1010, 3, 4, 3, 'manual', '4 L', 'GCC', 'disel', '<p><strong>Rent and Drive this Mercedes Benz G63 AMG 2022</strong> in Dubai for AED 1600/day. Rental cost includes comprehensive insurance and a mileage limit of 250 km/day. Extra km charged at AED 5/km. A security deposit of AED 2000 is required.</p>\n\n<p>This car has 4 doors and seats up to 5 passengers.</p>\n\n<p><strong>Mercedes Benz G63 AMG 2022</strong><br>\nModel Year: 2022</p>\n\n<h4>Specifications:</h4>\n<ol>\n  <li>3D Surround Camera</li>\n  <li>Memory Front Seats</li>\n  <li>Parking Assist</li>\n  <li>Built-in GPS</li>\n  <li>Parking Sensors</li>\n  <li>Steering Assist</li>\n  <li>Push Button Ignition</li>\n  <li>SRS Airbags</li>\n  <li>Front & Rear Airbags</li>\n  <li>Front Air Bags</li>\n</ol>\n\n<h4>Why hire the Mercedes Benz G63 AMG?</h4>\n<p>\n  Breathtakingly powerful and bold in design, the G63 AMG is built for luxury and performance. It features a twin-turbo 4.0L V8 engine, delivering over 560 horsepower and premium interior finishes. Standard with 4MATIC all-wheel drive, this SUV dominates on-road and off.\n</p>\n', NULL, 'Satwa', 'available', 40, 10, 1, 500, '', 0.0, 0, '2025-05-05 22:46:52', '2025-05-05 22:46:52', NULL),
(2, 2, 1, 2, 'Compact Car', 'Toyota', 'Yaris', 2021, 150, 7, NULL, NULL, 'auto', NULL, NULL, 'petrol', 'Affordable and efficient.', NULL, 'Satwa', 'available', NULL, NULL, 1, 0, '', 3.0, 0, '2025-05-05 22:46:52', '2025-05-05 22:46:52', NULL),
(3, 2, 1, 2, 'affordable car 1', 'Toyota', 'Yaris new', 2021, 650, 7, NULL, NULL, 'auto', NULL, NULL, 'petrol', 'Affordable and efficient.', NULL, 'Satwa', 'available', NULL, NULL, 1, 0, '', 0.0, 0, '2025-05-05 22:46:52', '2025-05-05 22:46:52', NULL),
(4, 2, 1, 1, 'New Test', 'BMW', 'Yaris', 2025, 150, 7, NULL, NULL, 'auto', NULL, NULL, 'petrol', 'Affordable and efficient.', NULL, 'Satwa', 'available', NULL, NULL, 1, 0, '', 0.0, 0, '2025-05-05 22:46:52', '2025-05-05 22:46:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `car_categories`
--

CREATE TABLE `car_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_categories`
--

INSERT INTO `car_categories` (`id`, `name`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'SVU', NULL, '2025-05-13 23:37:19', NULL, NULL),
(2, 'Sedan', NULL, '2025-05-13 23:37:19', NULL, NULL),
(3, 'Mini', NULL, '2025-05-13 23:37:29', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `car_features`
--

CREATE TABLE `car_features` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type_` enum('technical','comfort','safety','performance','other') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_features`
--

INSERT INTO `car_features` (`id`, `name`, `type_`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Air Conditioning', 'technical', '2025-05-05 22:49:16', '2025-05-05 22:49:16', NULL),
(2, 'GPS Navigation', 'technical', '2025-05-05 22:49:16', '2025-05-05 22:49:16', NULL),
(3, 'Bluetooth', 'comfort', '2025-05-05 22:49:16', '2025-05-05 22:49:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `car_feature_mapping`
--

CREATE TABLE `car_feature_mapping` (
  `id` int(11) NOT NULL,
  `car_id` int(11) DEFAULT NULL,
  `feature_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_feature_mapping`
--

INSERT INTO `car_feature_mapping` (`id`, `car_id`, `feature_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, '2025-05-05 22:50:00', '2025-05-05 22:50:00', NULL),
(2, 1, 2, '2025-05-05 22:50:00', '2025-05-05 22:50:00', NULL),
(3, 2, 1, '2025-05-05 22:50:00', '2025-05-05 22:50:00', NULL),
(4, 2, 3, '2025-05-05 22:50:00', '2025-05-05 22:50:00', NULL),
(5, 1, 3, '2025-05-05 22:50:00', '2025-05-05 22:50:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `car_images`
--

CREATE TABLE `car_images` (
  `id` int(11) NOT NULL,
  `car_id` int(11) NOT NULL,
  `image_url` text NOT NULL,
  `is_main` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `car_tags`
--

CREATE TABLE `car_tags` (
  `car_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_tags`
--

INSERT INTO `car_tags` (`car_id`, `tag_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `country_id` int(11) DEFAULT NULL,
  `name_ar` varchar(255) DEFAULT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `country_id`, `name_ar`, `name_en`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'دبي', 'Dubai', '2025-05-05 22:46:30', '2025-05-05 22:46:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name_ar` varchar(255) DEFAULT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name_ar`, `name_en`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'الإمارات', 'UAE', '2025-05-05 22:46:30', '2025-05-05 22:46:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `discount_type` varchar(20) DEFAULT NULL,
  `discount_value` double DEFAULT NULL,
  `vendor_id` int(11) DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `usage_count` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `vendor_id`, `valid_from`, `valid_to`, `usage_limit`, `usage_count`, `is_active`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'WELCOME10', '10% off for new users', 'percentage', 10, NULL, '2025-01-01', '2025-12-31', 100, 0, 1, '2025-05-05 22:51:52', '2025-05-05 22:51:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coupon_usage`
--

CREATE TABLE `coupon_usage` (
  `id` int(11) NOT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `redeemed_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon_usage`
--

INSERT INTO `coupon_usage` (`id`, `coupon_id`, `user_id`, `booking_id`, `redeemed_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, '2025-05-05 22:51:52', '2025-05-05 22:51:52', '2025-05-05 22:51:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `paid_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `payment_method`, `amount`, `payment_status`, `paid_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'credit_card', 700, 'paid', '2025-05-05 22:51:52', '2025-05-05 22:51:52', '2025-05-05 22:51:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `id` int(11) NOT NULL,
  `city_id` int(11) DEFAULT NULL,
  `name_ar` varchar(255) DEFAULT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `regions`
--

INSERT INTO `regions` (`id`, `city_id`, `name_ar`, `name_en`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'السطوة', 'Satwa', '2025-05-05 22:46:30', '2025-05-05 22:46:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `car_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `booking_id`, `customer_id`, `car_id`, `rating`, `comment`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 5, 'Great car, smooth ride!', '2025-05-05 22:51:52', '2025-05-05 22:51:52', NULL),
(2, 1, 1, 1, 5, 'Great car, smooth ride!', '2025-05-05 22:51:52', '2025-05-05 22:51:52', NULL),
(3, 1, 1, 1, 5, 'Great car, smooth ride!', '2025-05-05 22:51:52', '2025-05-05 22:51:52', NULL),
(4, 1, 1, 1, 5, 'Great car, smooth ride!', '2025-05-05 22:51:52', '2025-05-05 22:51:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `seasonal_pricing`
--

CREATE TABLE `seasonal_pricing` (
  `id` int(11) NOT NULL,
  `car_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `price_per_day` double DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'luxury', '2025-05-13 23:35:45', NULL, NULL),
(2, 'budget', '2025-05-13 23:35:45', NULL, NULL),
(3, 'sports', '2025-05-13 23:35:45', NULL, NULL),
(4, 'new-arrival', '2025-05-13 23:35:45', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `phone`, `photo`, `password`, `role`, `createdAt`, `updatedAt`, `deletedAt`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'john_doe', 'john@example.com', '1234567890', '', 'hashed_pass_1', 'customer', '2025-05-06 00:46:30', NULL, NULL, NULL, NULL),
(2, 'vendor_girl', 'vendor@example.com', '0987654321', '', 'hashed_pass_2', 'vendor', '2025-05-06 00:46:30', NULL, NULL, NULL, NULL),
(3, 'admin_user', 'admin@example.com', '5551234567', '', 'hashed_pass_3', 'admin', '2025-05-06 00:46:30', NULL, NULL, NULL, NULL),
(7, 'New Name', 'john1@example.com', '+491234567890', 'https://yourapp.com/uploads/avatar.jpg', '$2b$10$LsGIESKeQEfxPTZBFg1MzurgtRoJA549HNH14q2JYtwnVmA7pjXmW', 'customer', '2025-06-08 18:29:21', '2025-06-08 21:47:05', NULL, 'c055956962ea314e3ccd9d6ee2b22e85a901394f6b1207b59eabca7974c73c29', '2025-06-08 19:31:30');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `region_id` int(11) DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `active` tinyint(4) DEFAULT 1,
  `background_image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `shop_open_time` time DEFAULT NULL,
  `shop_close_time` time DEFAULT NULL,
  `open_24_7` tinyint(4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `user_id`, `name`, `phone`, `region_id`, `photo`, `verified`, `active`, `background_image`, `description`, `shop_open_time`, `shop_close_time`, `open_24_7`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 2, 'Speedy Rentals', '0987654321', 1, '', 1, 1, NULL, NULL, NULL, NULL, NULL, '2025-05-05 22:46:52', NULL, NULL),
(2, 2, 'Speedy Rentals2', '0987654321', 1, '', 1, 1, NULL, NULL, NULL, NULL, NULL, '2025-05-05 22:46:52', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car_id` (`car_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `booking_status_logs`
--
ALTER TABLE `booking_status_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `changed_by` (`changed_by`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendor_id` (`vendor_id`),
  ADD KEY `region_id` (`region_id`);

--
-- Indexes for table `car_categories`
--
ALTER TABLE `car_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_features`
--
ALTER TABLE `car_features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `car_feature_mapping`
--
ALTER TABLE `car_feature_mapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car_id` (`car_id`),
  ADD KEY `feature_id` (`feature_id`);

--
-- Indexes for table `car_images`
--
ALTER TABLE `car_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `car_tags`
--
ALTER TABLE `car_tags`
  ADD PRIMARY KEY (`car_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `coupon_usage`
--
ALTER TABLE `coupon_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `coupon_id` (`coupon_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `seasonal_pricing`
--
ALTER TABLE `seasonal_pricing`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car_id` (`car_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `region_id` (`region_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `booking_status_logs`
--
ALTER TABLE `booking_status_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `car_categories`
--
ALTER TABLE `car_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `car_features`
--
ALTER TABLE `car_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `car_feature_mapping`
--
ALTER TABLE `car_feature_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `car_images`
--
ALTER TABLE `car_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coupon_usage`
--
ALTER TABLE `coupon_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `regions`
--
ALTER TABLE `regions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `seasonal_pricing`
--
ALTER TABLE `seasonal_pricing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `booking_status_logs`
--
ALTER TABLE `booking_status_logs`
  ADD CONSTRAINT `booking_status_logs_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `booking_status_logs_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`),
  ADD CONSTRAINT `cars_ibfk_2` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`);

--
-- Constraints for table `car_feature_mapping`
--
ALTER TABLE `car_feature_mapping`
  ADD CONSTRAINT `car_feature_mapping_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  ADD CONSTRAINT `car_feature_mapping_ibfk_2` FOREIGN KEY (`feature_id`) REFERENCES `car_features` (`id`);

--
-- Constraints for table `car_images`
--
ALTER TABLE `car_images`
  ADD CONSTRAINT `car_images_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`);

--
-- Constraints for table `car_tags`
--
ALTER TABLE `car_tags`
  ADD CONSTRAINT `car_tags_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  ADD CONSTRAINT `car_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`);

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`);

--
-- Constraints for table `coupon_usage`
--
ALTER TABLE `coupon_usage`
  ADD CONSTRAINT `coupon_usage_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`),
  ADD CONSTRAINT `coupon_usage_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `coupon_usage_ibfk_3` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Constraints for table `regions`
--
ALTER TABLE `regions`
  ADD CONSTRAINT `regions_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`);

--
-- Constraints for table `seasonal_pricing`
--
ALTER TABLE `seasonal_pricing`
  ADD CONSTRAINT `seasonal_pricing_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`);

--
-- Constraints for table `vendors`
--
ALTER TABLE `vendors`
  ADD CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `vendors_ibfk_2` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
