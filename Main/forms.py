from django import forms

class UserInfo(forms.Form):
    email = forms.EmailField()
    address_ = forms.CharField(label='Address')
    city = forms.CharField()
    zip_code = forms.CharField(label='Zip')
    confirmation_mail = forms.BooleanField(required=False)
