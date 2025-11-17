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
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(100) NOT NULL,
  `comentario` text NOT NULL,
  `valoracion` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `comentarios_chk_1` CHECK ((`valoracion` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
INSERT INTO `comentarios` VALUES (1,'henry burelo','me gusto mucho el servicio',5,'2025-04-22 02:54:48'),(2,'loret rodrigez','excelente servicio lo recomiendo mucho un exquisito menú',5,'2025-04-22 21:45:00'),(3,'alfredo mendez','me gusto mucho el menú pero el servicio un poco lento',4,'2025-04-22 21:47:14'),(4,'wilber ramirez','es muy caro todo',1,'2025-04-29 18:32:25'),(5,'Hector Gonzalo','Esta muy buena la app pero el servicio funciona lento',4,'2025-05-21 20:23:39'),(6,'roberto','me gusto el servicio',4,'2025-05-27 15:47:50'),(7,'carlos sanchez','un poco lento el servicio pero no es tan malo',3,'2025-05-27 16:04:13'),(8,'ricardo lopez','muy bueno todo',5,'2025-05-27 16:05:58'),(9,'samuel hernandez','me gusto mucho',5,'2025-05-27 16:09:48'),(10,'juan perez','me gusto mucho pero podrian mejorar mas',4,'2025-05-27 16:22:22'),(11,'natalia hernandez','mu bueno todo pero el sistema es algo lento',3,'2025-05-27 16:33:15'),(12,'ever mendez','me gusto todo',5,'2025-05-27 16:35:36'),(13,'loret lopez','muy buen servicio',5,'2025-06-03 17:33:02');
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
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
