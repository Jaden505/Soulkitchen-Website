from django import forms

class UserInfo(forms.Form):
    email = forms.EmailField(label='Email')
    address_ = forms.CharField(label='Adres')
    city = forms.CharField(label='Stad')
    zip_code = forms.CharField(label='Post code')
    confirmation_mail = forms.BooleanField(required=False, label='Bevestegings mail')
