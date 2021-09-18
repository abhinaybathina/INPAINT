from django.urls import path
from inpaint.views import InpaintView

urlpatterns = [
    path('inpaint', InpaintView.as_view(), name="inpaint-view")
]