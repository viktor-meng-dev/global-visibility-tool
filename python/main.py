import sys
from file2sql import processUserRequest
from config import sqlConfig

file = sys.argv[1]

err_log = processUserRequest(file, sqlConfig)

if err_log:
	print('WARNING', flush=True)
else:
	print('SUCCESS', flush=True)