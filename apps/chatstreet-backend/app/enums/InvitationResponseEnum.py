from enum import Enum


class InvitationResponseEnum(Enum):
    ACCEPT = 'ACCEPT'
    DECLINE = 'DECLINE'

    @staticmethod
    def fromString(string: str | None) -> any:
        if string is None:
            return None
        match string:
            case 'ACCEPT':
                return InvitationResponseEnum.ACCEPT
            case 'DECLINE':
                return InvitationResponseEnum.DECLINE
            case _:
                return None
