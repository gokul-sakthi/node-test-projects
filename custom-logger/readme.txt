
Custom Logger:

Requirements
1. maintain the logs in a log file
2. to be able to write the files to a log in specific directory
3. to implement log rotation
4. the files should be written in the latest log file


Development steps:

1. create directory to store the logs 
2. create a metadata json file to store the latest log file details
3. check if the log file exceeds the size limit before writing to it 
4. create a new file if it exceeds the size limit
5. write to the latest log file
