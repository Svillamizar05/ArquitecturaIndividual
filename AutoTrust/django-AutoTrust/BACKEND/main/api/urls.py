from rest_framework.routers import DefaultRouter
from .views import CarViewSet

router=DefaultRouter()
router.register('Car', CarViewSet , basename='Car')
urlpatterns = router.urls
