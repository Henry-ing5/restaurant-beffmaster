-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: restaurant_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `folio_cliente` varchar(36) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`folio_cliente`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES ('189ad86b-5d13-4e7b-bd21-279d2f538945','Hector Gonzalo','9371636364','hectorgonzalo@gmail.com','hect364'),('26e0a83d-8bf1-43cc-aa3c-1f42dfca87a9','Jose Silvan','9932477857','jose24@gmail.com','jose857'),('2f93c25a-4a0f-482a-b487-7d3661e97dd2','henry burelo','9141274821','burelo@gmail.com','henr821'),('3cff4358-de39-43ab-85a0-f4ba345937f0','loret rodrigez','9936589985','loret@gmail.com','lore985'),('44cdb41b-ad40-45e1-b490-edbe3f8dcb6c','carlos sanchez','9141052230','carlos123@gmail.com','carl230'),('7dc85bf4-9a92-41ff-9afc-a99f69cd850a','carlos lopez','9915632588','carloslo@gmail.com','carl588'),('80ee6e70-e88f-4f1a-a70c-336126aefcca','roberto soberano','9141274821','robeto123@gmail.com','robe821'),('96d6ae4b-854f-4edb-8ab3-7e298b6ade61','roberto hernandez','9142006630','rthernandez@gmail.com','robe630'),('9a376530-c018-4767-b77b-b1b666ac882a','Hector Gonzalo','9371636364','hedhaffs@gmail.com','hect364'),('cc043521-25af-4b48-b7cc-9794e7aef7e4','henry contreras burelo','9141508897','henryburelo2@gmail.com','henr897'),('e09f7f59-fb47-4147-87b4-6daff7a5314e','Armando Lopez','9141058890','armando@gmail.com','arma890'),('e8b4f351-11f6-421d-8a73-93d5d965324d','henry burelo','9141274821','cb123@gmail.com','henr821'),('fc339d1f-3564-4938-b1fe-6c8222972f0a','henry burelo','9141274821','henryburelo@gmail.com','henr821');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-16 21:21:11
