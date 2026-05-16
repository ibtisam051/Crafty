# Cookies, Sessions & Caching Guide

This guide explains how to use cookies, sessions, and caching in the Crafty application.

## Quick Start

### 1. Sessions (Built-in Django)

Sessions are automatically enabled and stored in the database. They maintain user state.

```python
from apps.core_utils import set_session, get_session, delete_session

# In a view
def my_view(request):
    # Set session data
    set_session(request, 'user_preferences', {'theme': 'dark'})
    
    # Get session data
    prefs = get_session(request, 'user_preferences', {})
    
    # Delete session key
    delete_session(request, 'user_preferences')
    
    return Response({'status': 'ok'})
```

### 2. Cookies

Cookies are used to store client-side data that persists between requests.

```python
from apps.core_utils import set_cookie, get_cookie, delete_cookie
from rest_framework.response import Response

# In a view
def preferences_view(request):
    # Get cookie
    theme = get_cookie(request, 'theme', 'light')
    
    # Create response
    response = Response({'theme': theme})
    
    # Set cookie (expires in 1 year)
    set_cookie(response, 'theme', 'dark', max_age=86400*365)
    
    # Or delete cookie
    delete_cookie(response, 'theme')
    
    return response
```

### 3. Caching

Cache is used to store expensive computations or database queries.

#### Built-in Caches:
- **default**: General application cache (5 min timeout)
- **session**: Session-related cache (1 hour timeout)
- **products**: Product listings cache (30 min timeout)

#### Basic Usage:

```python
from apps.core_utils import cache_get, cache_set, cache_delete, cache_or_compute

# Set cache
cache_set('my_key', {'data': 'value'}, timeout=300)

# Get cache
data = cache_get('my_key')

# Delete cache
cache_delete('my_key')

# Get or compute if missing
products = cache_or_compute(
    'all_products',
    lambda: Product.objects.all(),
    timeout=1800,
    cache_name='products'
)
```

#### Cache Decorator:

```python
from apps.core_utils import api_cache

@api_cache(timeout=1800, cache_name='products')
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
```

## Configuration

All settings are in `crafty_backend/settings.py`:

### Session Settings:
```python
SESSION_ENGINE = 'django.contrib.sessions.backends.db'  # Store in DB
SESSION_COOKIE_AGE = 1209600  # 2 weeks
SESSION_COOKIE_HTTPONLY = True  # Prevent JS access
SESSION_COOKIE_SAMESITE = 'Lax'  # CSRF protection
SESSION_COOKIE_NAME = 'crafty_sessionid'  # Custom name
```

### Cookie Settings:
```python
CSRF_COOKIE_HTTPONLY = True  # Prevent JS access
CSRF_COOKIE_SAMESITE = 'Lax'  # CSRF protection
CSRF_COOKIE_NAME = 'crafty_csrftoken'  # Custom name
```

### Cache Settings:
```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': 300,  # 5 minutes
        'OPTIONS': {'MAX_ENTRIES': 1000}
    },
    'session': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': 3600,  # 1 hour
    },
    'products': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': 1800,  # 30 minutes
    }
}
```

## Cache Management Commands

### Clear all caches:
```bash
python manage.py cache_management --action clear
```

### Clear specific cache:
```bash
python manage.py cache_management --action clear --cache products
```

### Show cache statistics:
```bash
python manage.py cache_management --action stats
```

### Clear product cache:
```bash
python manage.py cache_management --action clear-products
```

### Clear session cache:
```bash
python manage.py cache_management --action clear-sessions
```

### Show cache info:
```bash
python manage.py cache_management --action info
```

## API Endpoints Using Cache

These endpoints automatically cache responses:

| Endpoint | Cache Duration | Notes |
|----------|---|---|
| `/api/products/` | 10 minutes | Cleared when products change |
| `/api/categories/` | 30 minutes | Rarely changes |
| `/api/artisans/` | 20 minutes | Cleared when profile changes |

## Example: User Preferences with Sessions & Cookies

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.core_utils import set_session, get_session, set_cookie, get_cookie

@api_view(['GET', 'POST'])
def user_preferences(request):
    """Get or set user preferences using session and cookies"""
    
    if request.method == 'POST':
        # Set preferences in session
        prefs = request.data.get('preferences', {})
        set_session(request, 'user_preferences', prefs)
        
        # Also set cookie for client-side use
        response = Response({'status': 'saved'})
        for key, value in prefs.items():
            set_cookie(response, f'pref_{key}', str(value))
        
        return response
    
    else:  # GET
        # Get preferences from session
        prefs = get_session(request, 'user_preferences', {})
        
        return Response({
            'preferences': prefs,
            'theme': get_cookie(request, 'pref_theme', 'light')
        })
```

## Example: Caching Expensive Operations

```python
from django.db.models import Count, Avg
from apps.core_utils import cache_or_compute

def get_product_stats():
    """Get product statistics with caching"""
    
    def compute_stats():
        return {
            'total_products': Product.objects.count(),
            'avg_price': Product.objects.aggregate(Avg('price'))['price__avg'],
            'by_category': Product.objects.values('category__name').annotate(count=Count('id')),
        }
    
    # Compute once and cache for 1 hour
    return cache_or_compute(
        'product_stats',
        compute_stats,
        timeout=3600,
        cache_name='products'
    )
```

## Cache Invalidation

When data changes, invalidate relevant caches:

```python
from apps.core_utils import invalidate_product_cache, invalidate_user_cache

# In a product update view
def update_product(request, pk):
    product = Product.objects.get(pk=pk)
    # ... update logic ...
    
    # Clear product caches
    invalidate_product_cache()
    
    return Response({'status': 'updated'})

# In a user profile update view
def update_profile(request):
    # ... update logic ...
    
    # Clear user-specific caches
    invalidate_user_cache(request.user.id)
    
    return Response({'status': 'updated'})
```

## Production Setup (Optional)

For better performance in production, use Redis cache backend:

1. **Install Redis** (Windows: use WSL or Docker)

2. **Install Django cache package**:
```bash
pip install django-redis
```

3. **Update settings.py**:
```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    },
    'session': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/2',
    },
    'products': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/3',
    }
}
```

## Best Practices

1. **Session**: Use for user-specific data that needs to persist across requests
2. **Cookies**: Use for client-side preferences or tracking (limited to ~4KB)
3. **Cache**: Use for expensive queries, API responses, or computed data
4. **Always invalidate cache** when data changes
5. **Set reasonable timeouts** (don't cache too long for real-time data)
6. **Use appropriate cache backend** (local memory for dev, Redis for prod)
7. **Monitor cache hit rates** to optimize timeout values

## Debugging

Enable cache logging in `settings.py`:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'apps.core_utils': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

Then check the console output for cache operations.
