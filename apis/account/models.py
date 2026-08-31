import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    class RoleChoices(models.TextChoices):
        OWNER = 'OWNER', _('Cafe Owner')
        CUSTOMER = 'CUSTOMER', _('Crypto Customer')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=10, choices=RoleChoices.choices, default=RoleChoices.CUSTOMER)

    email = models.EmailField(unique=True, null=True, blank=True)
    wallet_address = models.CharField(max_length=100, unique=True, null=True, blank=True)
    USERNAME_FIELD = 'username'

    # def __str__(self):
    #     return self.email if self.role == self.RoleChoices.OWNER else self.wallet_address


class Cafe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cafes')
    name = models.CharField(max_length=255)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    quote = models.TextField(blank=True, null=True, help_text="A quote or description of the cafe")
    address = models.TextField()

    geo_location = models.CharField(max_length=100, help_text="Format: 'latitude,longitude'")

    created_at = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return self.name


class MenuItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=255)
    image_url = models.URLField(max_length=500, blank=True, null=True)

    ingredients = models.JSONField(default=list, help_text="List of ingredients as strings")

    price_ton = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return f"{self.name} - {self.cafe.name}"


class Order(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = 'PENDING', _('Pending Payment')
        PAID = 'PAID', _('Paid')
        PREPARING = 'PREPARING', _('Preparing')
        READY = 'READY', _('Ready')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    total_ton = models.DecimalField(max_digits=10, decimal_places=4, default=0.0000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.status}"


class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem,
                                  on_delete=models.PROTECT)  # PROTECT جلوگیری می‌کند از حذف آیتم منویی که قبلا سفارش داده شده
    quantity = models.PositiveIntegerField(default=1)

    def get_cost(self):
        return self.menu_item.price_ton * self.quantity


class TonPayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment_details')
    transaction_hash = models.CharField(max_length=150, unique=True)

    amount_nano_ton = models.BigIntegerField()
    verified_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order {self.order.id}"
