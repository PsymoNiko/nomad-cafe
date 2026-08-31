from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import User, Cafe, MenuItem, Order, OrderItem, TonPayment


# ==========================================
# 1. Custom User Admin
# ==========================================
@admin.register(User)
class CustomUserAdmin(DefaultUserAdmin):
    """
    سفارشی‌سازی ادمین کاربر برای پشتیبانی از کیف پول و نقش‌ها
    """
    list_display = ('username', 'email', 'wallet_address', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'wallet_address')
    ordering = ('-date_joined',)

    # اضافه کردن فیلدهای سفارشی به فرم ویرایش کاربر
    fieldsets = DefaultUserAdmin.fieldsets + (
        (_('Web3 & Role Info'), {'fields': ('role', 'wallet_address')}),
    )

    # اضافه کردن فیلدهای سفارشی به فرم ساخت کاربر جدید
    add_fieldsets = DefaultUserAdmin.add_fieldsets + (
        (_('Web3 & Role Info'), {'fields': ('role', 'wallet_address')}),
    )


# ==========================================
# 2. Inlines (برای نمایش تودرتوی داده‌ها)
# ==========================================
class MenuItemInline(admin.TabularInline):
    model = MenuItem
    extra = 1  # تعداد ردیف‌های خالی پیش‌فرض
    fields = ('name', 'price_ton', 'ingredients_preview')
    readonly_fields = ('ingredients_preview',)

    def ingredients_preview(self, obj):
        return ", ".join(obj.ingredients) if obj.ingredients else "-"

    ingredients_preview.short_description = "Ingredients"


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0  # چون سفارش معمولاً از سمت کلاینت ثبت می‌شود، ردیف خالی نمی‌خواهیم
    readonly_fields = ('get_cost_display',)

    def get_cost_display(self, obj):
        return f"{obj.get_cost()} TON"

    get_cost_display.short_description = "Total Cost"


class TonPaymentInline(admin.StackedInline):
    model = TonPayment
    extra = 0
    readonly_fields = ('transaction_hash', 'amount_nano_ton', 'verified_at')
    can_delete = False  # اطلاعات پرداخت بلاکچین نباید به صورت دستی حذف شوند


# ==========================================
# 3. Model Admins
# ==========================================

@admin.register(Cafe)
class CafeAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner_link', 'short_address', 'menu_items_count', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'owner__username', 'owner__wallet_address', 'address')
    list_select_related = ('owner',)  # بهینه‌سازی کوئری پایگاه داده
    inlines = [MenuItemInline]  # نمایش منو در همان صفحه کافه

    def owner_link(self, obj):
        # ساخت لینک قابل کلیک به پروفایل صاحب کافه
        return format_html('<a href="/admin/core/user/{}/change/">{}</a>', obj.owner.id, obj.owner)

    owner_link.short_description = "Owner"

    def short_address(self, obj):
        return obj.address[:30] + '...' if len(obj.address) > 30 else obj.address

    short_address.short_description = "Address"

    def menu_items_count(self, obj):
        return obj.menu_items.count()

    menu_items_count.short_description = "Menu Items"


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'cafe', 'price_ton', 'image_preview')
    list_filter = ('cafe',)
    search_fields = ('name', 'cafe__name')
    list_select_related = ('cafe',)

    def image_preview(self, obj):
        if obj.image_url:
            return format_html('<a href="{0}" target="_blank">View Image</a>', obj.image_url)
        return "-"

    image_preview.short_description = "Image"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('short_id', 'customer', 'cafe', 'status_colored', 'total_ton', 'created_at')
    list_filter = ('status', 'cafe', 'created_at')
    search_fields = ('id', 'customer__wallet_address', 'customer__username', 'cafe__name')
    list_select_related = ('customer', 'cafe')
    readonly_fields = ('total_ton', 'created_at')
    inlines = [OrderItemInline, TonPaymentInline]  # نمایش آیتم‌های سفارش و وضعیت پرداخت در صفحه سفارش

    actions = ['mark_as_preparing', 'mark_as_ready']

    @admin.action(description='Mark selected orders as PREPARING')
    def mark_as_preparing(self, request, queryset):
        updated = queryset.update(status=Order.StatusChoices.PREPARING)
        self.message_user(request, f"{updated} orders marked as Preparing.")

    @admin.action(description='Mark selected orders as READY')
    def mark_as_ready(self, request, queryset):
        updated = queryset.update(status=Order.StatusChoices.READY)
        self.message_user(request, f"{updated} orders marked as Ready.")

    def short_id(self, obj):
        return str(obj.id)[:8] + "..."

    short_id.short_description = "Order ID"

    def status_colored(self, obj):
        """رنگ‌بندی وضعیت سفارش برای خوانایی بهتر در پنل"""
        colors = {
            'PENDING': 'orange',
            'PAID': 'blue',
            'PREPARING': 'purple',
            'READY': 'green'
        }
        color = colors.get(obj.status, 'black')
        return format_html('<span style="color: {}; font-weight: bold;">{}</span>', color, obj.get_status_display())

    status_colored.short_description = "Status"


@admin.register(TonPayment)
class TonPaymentAdmin(admin.ModelAdmin):
    list_display = ('order_link', 'transaction_hash_short', 'amount_in_ton', 'verified_at')
    search_fields = ('transaction_hash', 'order__id')
    list_select_related = ('order',)
    readonly_fields = ('order', 'transaction_hash', 'amount_nano_ton', 'verified_at')

    def order_link(self, obj):
        return format_html('<a href="/admin/core/order/{}/change/">Order {}</a>', obj.order.id, str(obj.order.id)[:8])

    order_link.short_description = "Order"

    def transaction_hash_short(self, obj):
        return f"{obj.transaction_hash[:10]}...{obj.transaction_hash[-10:]}"

    transaction_hash_short.short_description = "Tx Hash"

    def amount_in_ton(self, obj):
        ton_amount = obj.amount_nano_ton / 1_000_000_000
        return f"{ton_amount:.4f} TON"

    amount_in_ton.short_description = "Amount (TON)"
