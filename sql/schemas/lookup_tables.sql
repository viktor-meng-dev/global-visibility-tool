
-- PORT OF LOADING LOOKUP TABLE SCHEMA
CREATE TABLE pol (
	ID CHAR(3) PRIMARY KEY,                                                 -- 3 letter uppercase code (non-empty)
	Name TINYTEXT NOT NULL,                                                 -- Free format text (non-empty)
	Country TINYTEXT NOT NULL,                                              -- Free format text (non-empty)
	threePL TINYTEXT NOT NULL                                               -- Free format text (non-empty)
);


-- PORT OF DESTINATION LOOKUP TABLE SCHEMA
CREATE TABLE pod (
	ID CHAR(3) PRIMARY KEY,                                                 -- 3 letter uppercase code (non-empty)
	Name TINYTEXT NOT NULL                                                  -- Free format text (non-empty)
);


-- MASTER CLASSIFICATION DATABASE LOOKUP TABLE SCHEMA
CREATE TABLE mcd (
	EAN BIGINT UNSIGNED PRIMARY KEY,                                        -- (5-13) digit code not beginning with zero (non-empty)
	SKUCode BIGINT UNSIGNED,                                                -- (5-13) digit code not beginning with zero
	CommodityCode BIGINT UNSIGNED,                                          -- 10 digit code not beginning with zero
	PreferenceCode INT UNSIGNED,                                            -- Integer
	CoO CHAR(2),                                                            -- 2 letter uppercase code
	EffectiveDutyRate DECIMAL(4,2) UNSIGNED,                                -- Percentage value less than 100%
	StockDescription TEXT                                                   -- Free format text
);


-- BUYING GROUP LOOKUP TABLE SCHEMA
CREATE TABLE bg (
	ID INT UNSIGNED PRIMARY KEY,                                            -- Integer (non-empty)
	Name TINYTEXT NOT NULL                                                  -- Free format text (non-empty)
);


-- VENDOR LOOKUP TABLE SCHEMA
CREATE TABLE vendor (
	ID CHAR(9) PRIMARY KEY,                                                 -- 9 character alphanumeric code (non-empty)
	Name TINYTEXT NOT NULL,                                                 -- Free format text (non-empty)
	Country TINYTEXT,                                                       -- Free format text
	Contact TINYTEXT,                                                       -- Free format text
	Phone TINYTEXT,                                                         -- Free format text
	Email TINYTEXT,                                                         -- Free format text
	Address TINYTEXT                                                        -- Free format text
);


-- CATEGORY LOOKUP TABLE SCHEMA
CREATE TABLE category (
	ID CHAR(10) PRIMARY KEY,                                                -- 10 character alphanumeric code
	Name TINYTEXT NOT NULL                                                  -- Free form text (non-empty)
);


-- DISTRIBUTION CENTRE LOOKUP TABLE SCHEMA
CREATE TABLE dc (
	ID VARCHAR(4) PRIMARY KEY,                                              -- (3-4) character uppercase code (non-empty)
	Name TINYTEXT NOT NULL                                                  -- Free form text (non-empty)
);


