# MOBIGIC SERVICES

1. Check out to main 
## install dependencies
bash
on root  run command - yarn install

## create a mongo database named mobigic on your local


## create an .env file at root of the project

## add the following values to your .env file
bash
MOBIGIC_MONGO_URL= "mongodb://127.0.0.1:27017/mobigic?authSource=admin&w=1"
MOBIGIC_MONGO_TEST_URL= "mongodb://127.0.0.1:27017/mobigic?authSource=admin&w=1"
AZURE_SAS_TOKEN = "sp=racwdli&st=2023-04-01T17:09:17Z&se=2023-11-17T01:09:17Z&sv=2021-12-02&sr=c&sig=%2F5oc2NQnpThT56a3NyHAtiWJJ23XUzfSrORbklu21%2Fg%3D"
AZURE_CONTAINER_NAME = "mobigic"
AZURE_STORAGE_ACCOUNT = "mobigicstorageaccount"

## run the server
bash
run command - yarn start
