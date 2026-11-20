
import secrets
import hashlib
import hmac


def generate_otp():
    """Generate a random six-digit OTP."""
    return f"{secrets.randbelow(1000000):06d}"


def hash_otp(otp: str):
    """Hash OTP with a random salt."""
    salt = secrets.token_bytes(16)

    hashed = hashlib.pbkdf2_hmac(
        "sha256",
        otp.encode("utf-8"),
        salt,
        200000
    )

    return f"{salt.hex()}${hashed.hex()}"


def verify_otp(otp: str, stored_hash: str):
    """Verify entered OTP against stored hash."""
    try:
        salt_hex, hash_hex = stored_hash.split("$")

        salt = bytes.fromhex(salt_hex)

        new_hash = hashlib.pbkdf2_hmac(
            "sha256",
            otp.encode("utf-8"),
            salt,
            200000
        )

        return hmac.compare_digest(
            new_hash.hex(),
            hash_hex
        )

    except (ValueError, TypeError):
        return False
