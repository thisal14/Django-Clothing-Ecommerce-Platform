from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Coupon, FlashSale
from .serializers import CouponSerializer, FlashSaleSerializer

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]

class FlashSaleViewSet(viewsets.ModelViewSet):
    queryset = FlashSale.objects.all()
    serializer_class = FlashSaleSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def validate_coupon(request):
    code = request.query_params.get('code')
    if not code:
        return Response({"valid": False, "error": "Code required"}, status=status.HTTP_400_BAD_MODULE)
    
    try:
        coupon = Coupon.objects.get(code=code)
        valid, message = coupon.is_valid()
        if valid:
            return Response({
                "valid": True,
                "code": coupon.code,
                "type": coupon.type,
                "value": coupon.value
            })
        return Response({"valid": False, "error": message})
    except Coupon.DoesNotExist:
        return Response({"valid": False, "error": "Invalid code"})
