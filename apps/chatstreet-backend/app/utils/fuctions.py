import random


def generate_random_token() -> int:
    return random.choice(range(1000, 9999))
