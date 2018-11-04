import numpy as np


def findErrors(df, field, pattern):

	brkcell_idxs = np.where(np.logical_not(df[field].str.match(pat=pattern, case=True).values))[0]
	brkcell_values = df[field].values[brkcell_idxs]
	
	err_list = []
	for idx,val in zip(brkcell_idxs, brkcell_values):
		err_list.append((idx, f"ERROR | ROW {idx+2} | KEY: {field} | VALUE: {val}"))
	return err_list 



# PORT OF LOADING DATA PATTERNS
def polRules(df):
	err_list = findErrors(df, 'ID', '^[A-Z]{3}$')                                                                                   # 3 letter (uppercase) code + NOT NULL
	err_list += findErrors(df, 'Name', '.')                                                                                         # Free format text + NOT NULL
	err_list += findErrors(df, 'Country', '.')                                                                                      # Free format text + NOT NULL
	err_list += findErrors(df, '3PL', '.')                                                                                          # Free format text + NOT NULL
	return err_list


# PORT OF DESTINATION DATA PATTERNS
def podRules(df):
	err_list = findErrors(df, 'ID', '^[A-Z]{3}$')                                                                                   # 3 letter (uppercase) code + NOT NULL
	err_list += findErrors(df, 'Name', '.')                                                                                         # Free form text + NOT NULL
	return err_list


# MASTER CLASSIFICATION (flat-file) DATABASE DATA PATTERNS
def mcdRules(df):
	err_list = findErrors(df, 'EAN', '^[1-9][0-9]{4,12}$')                                                                          # (5-13) digit code not beginning with zero + NOT NULL
	err_list += findErrors(df, 'SKU Code', '^([1-9][0-9]{4,12}|)$')                                                                 # (5-13) digit code not beginning with zero
	err_list += findErrors(df, 'Commodity Code', '^([1-9][0-9]{9}|)$')                                                              # 10 digit code not beginning with zero
	err_list += findErrors(df, 'Preference Code', '^([0-9]|[1-9][0-9]+|)$')                                                         # Integer
	err_list += findErrors(df, 'Country of Origin', '^([A-Z]{2}|)$')                                                                # 2 letter (uppercase) code
	err_list += findErrors(df, 'Effective Duty Rate (%)', '^(([0-9]|[1-9][0-9])(\.[0-9]*){0,1}|)$')                                 # Percentage value 
	# err_list += findErrors(df, 'Stock Description', --anything--)                                                                 # Free format text
	return err_list


# BUYING GROUP DATA PATTERNS
def bgRules(df):
	err_list = findErrors(df, 'ID', '^([0-9]|[1-9][0-9]+)$')                                                                        # Integer + NOT NULL
	err_list += findErrors(df, 'Name', '.')                                                                                         # Free format text + NOT NULL
	return err_list


# VENDOR DATA PATTERNS
def vendorRules(df):
	err_list = findErrors(df, 'ID', '^[A-Z,0-9]{9}$')                                                                               # 9 character alphanumeric code + NOT NULL
	err_list += findErrors(df, 'Name', '.')                                                                                         # Free form text + NOT NULL
	# err_list += findErrors(df, 'Country', --anything--)                                                                           # Free format text
	# err_list += findErrors(df, 'Contact', --anything--)                                                                           # Free format text
	# err_list += findErrors(df, 'Phone', --anything--)                                                                             # Free format text
	# err_list += findErrors(df, 'Email', --anything--)                                                                             # Free format text
	# err_list += findErrors(df, 'Address', --anything--)                                                                           # Free format text
	return err_list


# CATEGORY DATA PATTERNS
def categoryRules(df):
	err_list = findErrors(df, 'ID', '^[A-Z,0-9]{10}$')                                                                              # 10 character alphanumeric code + NOT NULL
	err_list += findErrors(df, 'Name', '.')                                                                                         # Free form text + NOT NULL
	return err_list


def dcRules(df):
	err_list = findErrors(df, 'ID', '^[A-Z]{3,4}$')                                                                                 # (3-4) character code + NOT NULL
	err_list += findErrors(df, 'Name', '.')                                                                                         # Free form text + NOT NULL
	return err_list



# PHASE ONE UPLOAD DATA PATTERNS
def phaseOneRules(df):
	err_list = findErrors(df, 'EAN', '^[1-9][0-9]{4,12}$')                                                                          # (5-13) digit code not beginning with zero + NOT NULL
	err_list += findErrors(df, 'Category Code', '^[A-Z,0-9]{10}$')                                                                  # 10 character alphanumeric code + NOT NULL
	err_list += findErrors(df, 'BG Code', '^([0-9]|[1-9][0-9]+)$')                                                                  # Integer + NOT NULL
	err_list += findErrors(df, 'Vendor Code', '^[A-Z,0-9]{9}$')                                                                     # 9 character alphanumeric code + NOT NULL
	err_list += findErrors(df, 'DC Code', '^[A-Z]{3,4}$')                                                                           # (3-4) character code + NOT NULL
	err_list += findErrors(df, 'POL Code', '^[A-Z]{3}$')                                                                            # 3 letter (uppercase) code + NOT NULL
	err_list += findErrors(df, 'POD Code', '^[A-Z]{3}$')                                                                            # 3 letter (uppercase) code + NOT NULL
	err_list += findErrors(df, 'SAP PO No.', '^([1-9][0-9]{8}|)$')                                                                  # 9 digit code not beginning with zero
	err_list += findErrors(df, 'SAP PO Date', '^(20[0-9]{2}-[0-9]{2}-[0-9]{2}( 00:00:00){0,1}|)$')                                  # Date
	err_list += findErrors(df, 'SAP Article No.', '^([1-9][0-9]{8}|)$')                                                             # 9 digit code not beginning with zero
	err_list += findErrors(df, 'Incoterm Code', '^([A-Z]{3}|)$')                                                                    # 3 letter (uppercase) code
	# err_list += findErrors(df, 'Incoterm Port/Place', --anything--)                                                               # Free form text
	err_list += findErrors(df, 'Latest Receipt Date', '^(20[0-9]{2}-[0-9]{2}-[0-9]{2}( 00:00:00){0,1}|)$')                          # Date
	err_list += findErrors(df, 'Priority ID', '^([1-9]|10|)$')                                                                      # Integer between 1 and 10
	err_list += findErrors(df, 'Quantity Ordered', '^([0-9]|[1-9][0-9]+|)$')                                                        # Integer
	err_list += findErrors(df, 'Unit Price', '^(([0-9]|[1-9][0-9]+)(\.[0-9]*){0,1}|)$')                                             # Decimal or integer
	return err_list