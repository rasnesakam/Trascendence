# Generated by Django 4.2.7 on 2024-01-04 12:46

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import trascendence.api.models.SerializableModel
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_friends_friendinvitation_blacklist'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tournaments',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, max_length=36, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('tournament_name', models.CharField(max_length=50)),
                ('created_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='%(class)s_created_user', to='api.usermodel')),
            ],
            bases=(models.Model, trascendence.api.models.SerializableModel.SerializableModel),
        ),
        migrations.CreateModel(
            name='TournamentPlayers',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, max_length=36, primary_key=True, serialize=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='%(class)s_user', to='api.usermodel')),
            ],
            bases=(models.Model, trascendence.api.models.SerializableModel.SerializableModel),
        ),
        migrations.CreateModel(
            name='TournamentInvitations',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, max_length=36, primary_key=True, serialize=False)),
                ('message', models.CharField(max_length=400)),
                ('target_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='%(class)s_target_user', to='api.usermodel')),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='%(class)s_tournament_id', to='api.tournaments')),
            ],
            bases=(models.Model, trascendence.api.models.SerializableModel.SerializableModel),
        ),
        migrations.CreateModel(
            name='Matches',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, max_length=36, primary_key=True, serialize=False)),
                ('winner', models.CharField(choices=[('h', 'home'), ('a', 'away'), ('u', 'unknown')], default='u', max_length=1)),
                ('away', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='%(class)s_away', to='api.usermodel')),
                ('home', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='%(class)s_home', to='api.usermodel')),
                ('tournament', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(class)s_tournament_id', to='api.tournaments')),
            ],
            bases=(models.Model, trascendence.api.models.SerializableModel.SerializableModel),
        ),
    ]