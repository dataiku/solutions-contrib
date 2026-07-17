"""Internal framework adapters.

Import ``detect_adapter``/``Adapter`` from here; the concrete ``flask`` and
``fastapi`` subpackages are imported lazily by ``detect_adapter`` so neither
framework is required unless it is the one in use.
"""

from .base import Adapter, detect_adapter

__all__ = ["Adapter", "detect_adapter"]
