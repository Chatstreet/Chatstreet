# ext. libraries
from colorama import Fore
from colorama import Style
from colorama import init as colorama_init

colorama_init()


class NoDatabaseConnectionException(Exception):
    """Raised if the database and connection can't be established"""

    style = f'{Style.BRIGHT}{Fore.RED}'

    def __init__(self, msg: str):
        self.__message: str = f'{self.style}{msg}{Style.RESET_ALL}'
        super().__init__(self.__message)
