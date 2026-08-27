# Padini-HR-Chatbot 

## Setup Instructions
#### Backend running on Python 3.14.4 
#### Frontend required Node.JS 24.15.0 and NPM 11.12.1

### Create Virtual Python Environments
Using venv built into Python to create a local virtual environment \
```.venv```is the name of the virtual environment directory \
This command creates a new directory called .venv 
```
cd backend
python -m venv .venv
```

Next we need to activate the virtual environment
This command assumes you follow the same name for the virtual environment ```.venv```
```
.venv\Scripts\Activate.ps1
```

You can validate if the virtual environment is activated by running these commands 

``` pip list ``` you should see only pip installed 

``` Get-Command python ``` which should show your path to the virtual environment you just made

To deactivate the virtual environment you can run the command 
```
deactivate
```
To delete the Environemnt run the command 
```
rm -r .\.venv
```
Ensure the virtual environment is deactivated in your IDE and terminal first

#### RASA
Rasa requires an older version of Python with will need its own virtual environment
```
cd backend\rasa
python -m venv .venv_rasa
.venv_rasa\Scripts\Activate.ps1
```


### Install Packages with PIP
#### Backend Packages
Install packages directly (use within virtual environment active)
``` 
pip install "fastapi[standard]"
```

If there is a requirments.txt file present you can use ``` pip install -r ``` 
```
cd backend
pip install -r requirments.txt
```

#### Rasa Packages
Install packages directly (use within virtual environment active)
``` 
pip install rasa
```

If there is a requirments.txt file present you can use ``` pip install -r ``` 
```
cd backend/rasa
pip install -r requirments.txt
```

