from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    name_sw = models.CharField(max_length=100, blank=True)  # Swahili
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, default='🛒')
    
    def __str__(self):
        return self.name
    class Meta:
        verbose_name_plural = 'categories'

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    name_sw = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    description_sw = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    unit = models.CharField(max_length=20, default='piece')
    image_url = models.URLField(blank=True)
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
