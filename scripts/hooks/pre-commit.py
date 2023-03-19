import sys
import hashlib
import os

ROOT_PATH_LIST: list = os.path.dirname(os.path.abspath(__file__)).split("\\")
ROOT_PATH = "\\".join(ROOT_PATH_LIST[:len(ROOT_PATH_LIST) - 2])
os.chdir(ROOT_PATH)

print("""
<Hooks> Running pre-commit hook""")

BUF_SIZE: int = 65536
BLOODY_CONTRACT_PATH: str = "./contract/bloody-contract"
FILES_IN_BLOODY_CONTRACT: dict = {
    "wsgi": "./apps/chatstreet-backend/app/wsgi/__init__.py",
    "package_lock": "./apps/chatstreet-frontend/package-lock.json",
	"backend_dockerfile": "./apps/chatstreet-backend/Dockerfile",
	"frontend_dockerfile": "./apps/chatstreet-frontend/Dockerfile",
	"requirements": "./apps/chatstreet-backend/requirements.txt"
}

BLOODY_CONTRACT_TEMPLATE: str = """꒷꒦꒷꒷꒦꒦꒷꒦꒷꒷꒦꒦꒷꒦꒷꒷꒷꒦꒷꒷꒦꒦꒷꒦꒷꒷꒦꒷꒷꒷꒦꒦꒷
       -----  BLOODY CONTRACT  ------

       DO NOT TOUCH THIS FILE. IF THIS
       FILE GETS MODIFIED DURING YOUR
       DEVELOPMENT PROCESS YOU EITHER 
       REALLY KNOW WHAT YOU ARE DOING
       OR CHANGED A FILE YOU SHOULDN'T
                  HAVE!

      HASH CODES OF FILES THAT SHOULD
             NOT BE MODIFIED:
==============================================
{file_hash_formatted}"""

BLOODY_FILE_HASH_FORMATTED: str = ""

for file_name in FILES_IN_BLOODY_CONTRACT:
    sha1 = hashlib.sha1()
    file_path = FILES_IN_BLOODY_CONTRACT[file_name]
    try:
        with open(file_path, 'rb') as file:
            while True:
                data = file.read(BUF_SIZE)
                if not data:
                    break
                sha1.update(data)
            file.close()
    except FileNotFoundError:
        pass
    BLOODY_FILE_HASH_FORMATTED += f"{file_name}: {sha1.hexdigest()}\n"

bloody_contract_content = BLOODY_CONTRACT_TEMPLATE.format(file_hash_formatted=BLOODY_FILE_HASH_FORMATTED)

with open(BLOODY_CONTRACT_PATH, 'w', encoding='utf-8') as file:
    file.write(bloody_contract_content)
    file.close()
