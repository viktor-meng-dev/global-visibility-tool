
-- PHASE ONE UPLOAD TABLE SCHEMA
CREATE TABLE purchase_orders (
	EAN BIGINT UNSIGNED NOT NULL,                               -- (5-13) digit code not beginning with zero (non-empty)
	CategoryCode CHAR(10) NOT NULL,                             -- 10 character alphanumeric code (non-empty)
	BGCode INT UNSIGNED NOT NULL,                               -- Integer (non-empty)
	VendorCode CHAR(9) NOT NULL,                                -- 9 character alphanumeric code (non-empty)
	DCCode VARCHAR(4) NOT NULL,                                 -- (3-4) letter uppercase code (non-empty)
	POLCode CHAR(3) NOT NULL,                                   -- 3 letter uppercase code (non-empty)
	PODCode CHAR(3) NOT NULL,                                   -- 3 letter uppercase code (non-empty)
	SAPPONum INT UNSIGNED,                                      -- 9 digit code not beginning with zero
	SAPPODate DATE,                                             -- Date (excel format)
	SAPArticleNum INT UNSIGNED,                                 -- 9 digit code not beginning with zero
	IncotermCode CHAR(3),                                       -- 3 letter uppercase code
	IncotermPP TINYTEXT,                                        -- Free form text
	LatestReceiptDate DATE,                                     -- Date (excel format)
	PriorityCode TINYINT UNSIGNED,                              -- Integer between 1 and 10
	QuantityOrdered INT UNSIGNED,                               -- Integer
	UnitPrice DECIMAL(6,2) UNSIGNED                             -- Decimal
);