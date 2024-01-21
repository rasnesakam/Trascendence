# Generated by Django 4.2.7 on 2024-01-15 13:59

from django.db import migrations, models
import trascendence.api.models.shared_functions


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_friendinvitation_invite_code_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tournaments',
            name='tournament_code',
            field=models.CharField(default=trascendence.api.models.shared_functions.id_generator, max_length=6),
        ),
    ]