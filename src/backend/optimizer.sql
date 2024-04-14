-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 14, 2024 at 02:31 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `optimizer`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasktable`
--

CREATE TABLE `tasktable` (
  `ID` int(11) NOT NULL,
  `todoID` int(11) NOT NULL,
  `title` text NOT NULL,
  `status` set('1','2','3','4','5') NOT NULL DEFAULT '2',
  `description` text NOT NULL,
  `createDate` datetime DEFAULT current_timestamp(),
  `updateDate` datetime NOT NULL DEFAULT current_timestamp(),
  `lastUpdate` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `todotable`
--

CREATE TABLE `todotable` (
  `ID` int(10) UNSIGNED NOT NULL,
  `taskID` int(10) UNSIGNED NOT NULL,
  `title` text NOT NULL,
  `status` set('1','2','3','4','5') NOT NULL DEFAULT '2',
  `description` text NOT NULL,
  `createDate` date NOT NULL DEFAULT current_timestamp(),
  `updateDate` date NOT NULL DEFAULT current_timestamp(),
  `lastUpdate` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='todo table';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasktable`
--
ALTER TABLE `tasktable`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `todotable`
--
ALTER TABLE `todotable`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasktable`
--
ALTER TABLE `tasktable`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `todotable`
--
ALTER TABLE `todotable`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
