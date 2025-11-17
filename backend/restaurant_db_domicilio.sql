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
-- Table structure for table `domicilio`
--

DROP TABLE IF EXISTS `domicilio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domicilio` (
  `folio_d` varchar(20) NOT NULL,
  `folio_cliente` varchar(36) NOT NULL,
  `cortes` json NOT NULL,
  `bebidas` json NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `referencia` varchar(100) NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`folio_d`),
  KEY `folio_cliente` (`folio_cliente`),
  CONSTRAINT `domicilio_ibfk_1` FOREIGN KEY (`folio_cliente`) REFERENCES `cliente` (`folio_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domicilio`
--

LOCK TABLES `domicilio` WRITE;
/*!40000 ALTER TABLE `domicilio` DISABLE KEYS */;
INSERT INTO `domicilio` VALUES ('DO-0001','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"CERVEZA\"]',389.00,'calle mendoza 34','casa verde','Efectivo'),('DOM-20250414-0705','fc339d1f-3564-4938-b1fe-6c8222972f0a','[{\"nombre\": \"COWBOY\", \"precio\": 385, \"cantidad\": 1}]','[{\"nombre\": \"CERVEZA\", \"precio\": 100, \"cantidad\": 1}]',485.00,'evaristo numero 5','apartamento 23',NULL),('DOM-20250414-5642','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"CERVEZA\"]',485.00,'evaristo numero 45','apartamento 17',NULL),('DOM-20250418-2706','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"PIÑA COLADA\"]',715.00,'benito juarez numero 20','casa color rosa',NULL),('DOM-20250418-2822','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\", \"PICANHADA PRIME\"]','[\"MARGARITA\", \"CERVEZA\"]',1045.00,'calle romero numero 35','apartamento 29',NULL),('DOM-20250418-3153','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"RIB EYE\", \"COSTILLA BOTANERA\"]','[\"MARGARITA\"]',585.00,'calle romero numero 56','apartamento 12',NULL),('DOM-20250418-7764','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"MARGARITA\", \"VINO ROJO\"]',815.00,'calle sabrino nummero 45','casa color cafe',NULL),('DOM-20250422-4356','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"CERVEZA\"]',715.00,'juarez numero 23','apartamento 4','Efectivo'),('DOM-20250422-4386','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"CERVEZA\"]',715.00,'lopez numero 57','apartamento 46',NULL),('DOM-20250422-7127','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"VINO ROJO\"]',715.00,'juarez numero 45','apartamento 28',NULL),('DOM-20250424-3085','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\", \"RIB EYE\"]','[\"PIÑA COLADA\"]',1020.00,'juarez numero 55','apartamento 3','Efectivo'),('DOM-20250428-0542','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"CERVEZA\"]',485.00,'juarez numero 34','casa color verde','Google Pay'),('DOM-20250428-4357','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"VINO ROJO\"]',715.00,'domingo numero 54','apartamento 2','Efectivo'),('DOM-20250428-5197','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"CERVEZA\"]',485.00,'juarez numero 34','casa color verde','Efectivo'),('DOM-20250429-4952','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\", \"PICANHADA PRIME\"]','[\"CERVEZA\", \"PIÑA COLADA\"]',1045.00,'juarez numero 55','casa color verde con rojo','Efectivo'),('DOM-20250429-5391','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"CERVEZA\"]',485.00,'juarez 25','casa color rosa','Efectivo'),('DOM-20250429-6978','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\", \"NEW YORK ANGUS\"]','[\"PIÑA COLADA\", \"CERVEZA\"]',1200.00,'juarez numero 21','casa color rojo','Efectivo'),('DOM-20250501-5188','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"PIÑA COLADA\"]',485.00,'evaristo numero 43','apartamento 12','Efectivo'),('DOM-20250521-8053','189ad86b-5d13-4e7b-bd21-279d2f538945','[\"NEW YORK ANGUS\", \"COSTILLA BOTANERA\", \"RIB EYE\", \"PICANHADA PRIME\", \"COWBOY\"]','[\"MARGARITA\", \"PIÑA COLADA\", \"CERVEZA\", \"VINO ROJO\", \"COCA COLA 600 ML\"]',2385.00,'universidad juarez','en el centro de  computo','Mercado Pago'),('DOM-20250526-2374','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"PIÑA COLADA\"]',485.00,'romero numero 4','casa color rojo','Efectivo'),('DOM-20250527-9052','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\", \"PICANHADA PRIME\"]','[\"PIÑA COLADA\", \"VINO ROJO\"]',1045.00,'lozano numero 45','casa color verde','Efectivo'),('DOM-20250528-0008','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"PIÑA COLADA\"]',715.00,'calle benito numero 24','casa color rosa','Efectivo'),('DOM-20250528-3313','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"MARGARITA\"]',485.00,'calle juarez numero 33','casa color rosa','Efectivo'),('DOM-20250528-4523','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[]',615.00,'sabrino numero 44','casa color morado','Efectivo'),('DOM-20250528-7335','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"CERVEZA\"]',715.00,'benito numero 45','casa color verde','Efectivo'),('DOM-20250528-8148','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\", \"RIB EYE\"]','[\"PIÑA COLADA\"]',790.00,'calle sabrino numero 2','casa color negro','Google Pay'),('DOM-20250528-9185','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\", \"PICANHADA PRIME\"]','[\"PIÑA COLADA\", \"CERVEZA\"]',1045.00,'evaristo numero 56','casa color verde','Efectivo'),('DOM-20250529-8498','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"PIÑA COLADA\"]',719.00,'calle lopez numero 12','casa color morado','PayPal'),('DOM-20250530-4548','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"PIÑA COLADA\"]',469.00,'calle evaristo numero 13','casa color negro','Google Pay'),('DOM-20250530-9927','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\"]','[\"MARGARITA\"]',629.00,'juares numero 45','casa color morado','Mercado Pago'),('DOM-20250603-8921','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"PIÑA COLADA\"]',469.00,'loreto numero 50','casa color verde','PayPal'),('DOM-20250604','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\"]','[\"CERVEZA\"]',389.00,'calle mendoza 34','casa roja','Mercado Pago'),('DOM-20250605','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\", \"NEW YORK ANGUS\"]','[\"CERVEZA\", \"VINO TINTO\"]',1107.00,'calle romero 45','casa roja','PayPal'),('DOM-20250606','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"COWBOY\", \"NEW YORK ANGUS\", \"PICAÑADA PRIME\", \"RIB EYE\", \"COSTILLA BOTANERA\"]','[\"MARGARITA\", \"PIÑA COLADA\", \"CERVEZA\", \"VINO TINTO\", \"COCA COLA 600 ML\"]',2491.00,'calle flores umero 56','casa color verde','Efectivo'),('DOM-20250607','cc043521-25af-4b48-b7cc-9794e7aef7e4','[\"NEW YORK ANGUS\"]','[\"PIÑA COLADA\"]',719.00,'calle flores 34','casa verde',NULL),('DOM-20250608','cc043521-25af-4b48-b7cc-9794e7aef7e4','[\"NEW YORK ANGUS\"]','[\"PIÑA COLADA\"]',719.00,'calle flores 34','casa verde','Efectivo'),('DOM-20250609','fc339d1f-3564-4938-b1fe-6c8222972f0a','[\"NEW YORK ANGUS\", \"PICAÑADA PRIME\"]','[\"PIÑA COLADA\"]',1323.00,'calle andres numero 23','casas verde','Efectivo');
/*!40000 ALTER TABLE `domicilio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-16 21:21:10
