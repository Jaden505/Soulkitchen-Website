from django import forms

class UserInfo(forms.Form):
    email = forms.EmailField(label='Email', max_length=100)
    phone = forms.RegexField(regex=r'^\+?1?\d{9,15}$')
    address = forms.CharField(label='Adres', max_length=100)
    city = forms.CharField(label='Stad', max_length=100)
    zip_code = forms.CharField(label='Post code', max_length=100)

