"""
Core utilities for caching, cookies, and session management
"""
from django.core.cache import caches, cache
from django.views.decorators.cache import cache_page, cache_control
from django.utils.decorators import decorator_from_middleware_with_args
from django.middleware.cache import UpdateCacheMiddleware, FetchFromCacheMiddleware
from functools import wraps
import logging

logger = logging.getLogger(__name__)


# ============================================================================
# CACHE UTILITIES
# ============================================================================

def get_cache(cache_name='default'):
    """
    Get a specific cache backend.
    
    Usage:
        cache_backend = get_cache('products')
        cache_backend.set('key', value, timeout=300)
    """
    return caches[cache_name]


def cache_get(key, cache_name='default'):
    """
    Retrieve a value from cache.
    
    Args:
        key: Cache key
        cache_name: Cache backend name (default, session, products)
    
    Returns:
        Cached value or None
    """
    cache_backend = caches[cache_name]
    value = cache_backend.get(key)
    if value is not None:
        logger.debug(f"Cache HIT: {key}")
    else:
        logger.debug(f"Cache MISS: {key}")
    return value


def cache_set(key, value, timeout=None, cache_name='default'):
    """
    Store a value in cache.
    
    Args:
        key: Cache key
        value: Value to cache
        timeout: Cache timeout in seconds (None uses default)
        cache_name: Cache backend name
    """
    cache_backend = caches[cache_name]
    cache_backend.set(key, value, timeout)
    logger.debug(f"Cache SET: {key} (timeout: {timeout}s)")


def cache_delete(key, cache_name='default'):
    """Delete a value from cache."""
    caches[cache_name].delete(key)
    logger.debug(f"Cache DELETE: {key}")


def cache_clear(cache_name='default'):
    """Clear entire cache backend."""
    caches[cache_name].clear()
    logger.warning(f"Cache CLEARED: {cache_name}")


def cache_or_compute(key, compute_func, timeout=None, cache_name='default'):
    """
    Retrieve from cache or compute if missing.
    
    Usage:
        products = cache_or_compute('all_products', lambda: Product.objects.all(), timeout=1800, cache_name='products')
    """
    cache_backend = caches[cache_name]
    value = cache_backend.get(key)
    
    if value is None:
        logger.debug(f"Computing cache value for: {key}")
        value = compute_func()
        cache_backend.set(key, value, timeout)
    
    return value


# ============================================================================
# DECORATOR FOR CACHING API RESPONSES
# ============================================================================

def api_cache(timeout=300, cache_name='default', key_prefix=''):
    """
    Decorator to cache API response for GET requests.
    
    Usage:
        @api_cache(timeout=1800, cache_name='products')
        def get_products(request):
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Only cache GET requests
            if request.method != 'GET':
                return view_func(request, *args, **kwargs)
            
            # Build cache key from request
            cache_key = f"{key_prefix}:{request.get_full_path()}"
            cache_backend = caches[cache_name]
            
            # Try to get from cache
            cached_response = cache_backend.get(cache_key)
            if cached_response is not None:
                logger.debug(f"Returning cached API response: {cache_key}")
                return cached_response
            
            # Call view and cache response
            response = view_func(request, *args, **kwargs)
            
            # Cache response if status is 200
            if hasattr(response, 'status_code') and response.status_code == 200:
                cache_backend.set(cache_key, response, timeout)
                logger.debug(f"Cached API response: {cache_key}")
            
            return response
        
        return wrapper
    return decorator


# ============================================================================
# COOKIE UTILITIES
# ============================================================================

def set_cookie(response, key, value, max_age=None, secure=False, httponly=True):
    """
    Safely set a cookie on response.
    
    Usage:
        response.set_cookie('theme', 'dark', max_age=86400*365)
    """
    response.set_cookie(
        key=key,
        value=value,
        max_age=max_age,
        secure=secure,
        httponly=httponly,
        samesite='Lax'
    )
    logger.debug(f"Cookie SET: {key}")
    return response


def get_cookie(request, key, default=None):
    """
    Safely get a cookie from request.
    
    Usage:
        theme = get_cookie(request, 'theme', 'light')
    """
    value = request.COOKIES.get(key, default)
    logger.debug(f"Cookie GET: {key}")
    return value


def delete_cookie(response, key):
    """
    Delete a cookie from response.
    """
    response.delete_cookie(key, samesite='Lax')
    logger.debug(f"Cookie DELETE: {key}")
    return response


# ============================================================================
# SESSION UTILITIES
# ============================================================================

def set_session(request, key, value):
    """
    Set a session value.
    
    Usage:
        set_session(request, 'user_preferences', {'theme': 'dark'})
    """
    request.session[key] = value
    request.session.modified = True
    logger.debug(f"Session SET: {key}")


def get_session(request, key, default=None):
    """
    Get a session value.
    
    Usage:
        prefs = get_session(request, 'user_preferences', {})
    """
    value = request.session.get(key, default)
    logger.debug(f"Session GET: {key}")
    return value


def delete_session(request, key):
    """Delete a session value."""
    if key in request.session:
        del request.session[key]
        request.session.modified = True
        logger.debug(f"Session DELETE: {key}")


def clear_session(request):
    """Clear entire session."""
    request.session.flush()
    logger.warning("Session FLUSHED")


def get_or_create_session_id(request):
    """
    Get or create a unique session identifier for anonymous users.
    Useful for tracking anonymous cart/browsing.
    """
    session_id = request.session.session_key
    if session_id is None:
        request.session.create()
        session_id = request.session.session_key
    return session_id


# ============================================================================
# CACHE INVALIDATION HELPERS
# ============================================================================

def invalidate_product_cache():
    """Invalidate all product-related caches."""
    cache_backend = caches['products']
    cache_backend.clear()
    logger.warning("Product cache invalidated")


def invalidate_user_cache(user_id):
    """Invalidate cache for specific user."""
    keys_to_delete = [
        f'user_profile:{user_id}',
        f'user_cart:{user_id}',
        f'user_orders:{user_id}',
    ]
    for key in keys_to_delete:
        caches['default'].delete(key)
    logger.warning(f"User cache invalidated: {user_id}")


def invalidate_order_cache():
    """Invalidate all order-related caches."""
    cache_backend = caches['default']
    cache_backend.delete('all_orders')
    logger.warning("Order cache invalidated")
