from datetime import datetime
import re
from dateutil.parser import isoparse

def parse_datetime_robust(date_value):
    """
    Robust datetime parsing that handles Supabase TIMESTAMP WITH TIME ZONE formats.
    Uses dateutil for flexible parsing, with fallback handling for odd cases.
    """
    if isinstance(date_value, datetime):
        return date_value

    if not date_value:
        return datetime.utcnow()

    date_string = str(date_value)

    try:
        # Preferred method: use flexible parser that handles timezones and microseconds
        return isoparse(date_string)
    except Exception:
        try:
            # Manual fallback
            # Remove Z suffix if present
            if date_string.endswith('Z'):
                date_string = date_string[:-1]

            # Remove timezone offset like +00:00 or -05:30
            date_string = re.sub(r'[+-]\d{2}:\d{2}$', '', date_string)

            # Ensure microseconds are max 6 digits
            if '.' in date_string:
                parts = date_string.split('.')
                if len(parts) == 2:
                    micro = parts[1][:6].ljust(6, '0')  # pad if needed
                    date_string = f"{parts[0]}.{micro}"

            return datetime.fromisoformat(date_string)
        except Exception as e:
            print(f"Warning: Could not parse datetime '{date_value}': {e}")
            return datetime.utcnow()


def format_datetime_for_supabase(dt):
    """
    Format datetime for sending to Supabase TIMESTAMP WITH TIME ZONE.
    Ensures 6-digit microseconds and appends 'Z' to indicate UTC time.
    """
    if isinstance(dt, datetime):
        return dt.isoformat(timespec='microseconds') + 'Z'
    return dt
