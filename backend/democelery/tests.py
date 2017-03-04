from django.test import TestCase

# Create your tests here.
from tasks import add
add.delay(4, 4)
