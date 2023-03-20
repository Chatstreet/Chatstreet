class InvalidUserException(Exception):
    """Raised if the username and password don't match"""

    def __init__(self, username: str):
        self.__message: str = f"The user \"{username}\" doesn't exist"
        super().__init__(self.__message)
