# Generated manually for BusinessOwnerProfile payment fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='businessownerprofile',
            name='phone_number',
            field=models.CharField(blank=True, help_text='Business contact number (e.g. for payment).', max_length=20),
        ),
        migrations.AddField(
            model_name='businessownerprofile',
            name='bank_account_number',
            field=models.CharField(blank=True, help_text='Bank account number for transfers.', max_length=50),
        ),
        migrations.AddField(
            model_name='businessownerprofile',
            name='bank_name',
            field=models.CharField(blank=True, help_text='Name of the bank.', max_length=100),
        ),
        migrations.AddField(
            model_name='businessownerprofile',
            name='ifsc_code',
            field=models.CharField(blank=True, help_text='IFSC code of the branch.', max_length=20),
        ),
    ]
