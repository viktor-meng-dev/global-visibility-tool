import config
import mysql.connector
import itertools
import pandas as pd


# READ DATA FROM .csv OR .xlsx FILE AND LOAD INTO DATAFRAME
def readData(fpath, fields):

	cache = {}
	def cached_date_parser(date):                                                                                               # Define custom date parser
	    if date in cache:                                                                                                       # Cache all previosly parsed dates for opt. retrieval
	        return cache[date]
	    try:
	    	dt = pd.to_datetime(date, infer_datetime_format=True, errors="raise")                                               # All date formats accepted (raise error on failure)
	    	cache[date] = dt
	    	return dt
	    except ValueError:
	    	return "N/E DATE"                                                                                                   # Date does not exist e.g. 33 Oct 2015

	path_comps = fpath.split(".")                                                                                               # Split file path on extension

	if path_comps[-1] == 'csv':                                                                                                 # File is of .csv type

		datecols = [x for x in fields if x.find("Date") != -1]

		df = pd.read_csv(filepath_or_buffer=fpath,
	                     sep=',',
		                 usecols=fields,
		                 encoding='utf-8',
		                 parse_dates=datecols,
		                 date_parser=cached_date_parser,
		                 dtype=str).dropna(axis="index", how="all").fillna("").astype({d:str for d in datecols})
		return df

	else:
		print("File type not supported")
		return pd.DataFrame()                                                                                              # If file type is not supported, return an empty dataframe



def sqlInsert(df, table, fields, sqlFields, sqlConfig):

	sql_errlog = []
	nrecs = len(df)

	if not nrecs:                                                                                                              # If no clean records exist, then abort function
		return sql_errlog

	bsize = config.batch_size

	ix_lower = range(0, nrecs - 1 // bsize * bsize, bsize)
	ix_upper = itertools.chain(range(bsize, nrecs - 1 // bsize * bsize, bsize), [nrecs])


	query = 'INSERT INTO {0} {1} VALUES ({2})'.format(table, 
	                                                  str(tuple(sqlFields)).replace("'", ""),
	                                                  ('NULLIF(%({})s, ""),'*len(fields))[:-1].format(*fields)
	                                                  )

	cnx = mysql.connector.connect(**sqlConfig)                                                                                 # Open connection to MySQL server instance
	cursor = cnx.cursor()                                                                                                      # Instantiate MySQLCursor object

	for ix_0,ix_inf in zip(ix_lower, ix_upper):

		batch = df.iloc[ix_0:ix_inf]
		
		try:
			cursor.executemany(query, batch.to_dict(orient='records'))
		except mysql.connector.Error as err:

			for ix,record in enumerate(batch.to_dict(orient='records')):
				try:
					cursor.execute(query, record)
				except mysql.connector.Error as err:
					sql_errlog.append('SQL ERROR | ROW {0} | {1}'.format(ix + ix_0 + 2, err))


	cnx.commit()                                                                                                              # Commit changes to MySQL database
	cursor.close()
	cnx.close()

	return sql_errlog



def processUserRequest(file, sqlConfig):

	print('Configuring...', flush=True)
	table = file.split('@')[0]

	rules = config.dataRules[table]	
	sqlFieldMap = config.sqlFieldMap[table]
	fields = sqlFieldMap.keys()
	fpath = config.staging_area_dir + file
	# fields = config.tableFields[table]

	sqlFields = [sqlFieldMap[x] for x in fields]

	print('Reading file...', flush=True)
	df = readData(fpath, fields)
	if df.empty:
		return

	print('Validating data quality...', flush=True)
	dqe_list = rules(df)
	dqe_rows, dqe_errlog = [list(x) for x in zip(*dqe_list)] if dqe_list else [[], []]
	df.drop(dqe_rows, axis='index', inplace=True)

	print('Uploading data to MySQL...', flush=True)
	sql_errlog = sqlInsert(df, table, fields, sqlFields, sqlConfig)
	return dqe_errlog + sql_errlog