"""
DeenFlow Database Router
=========================
Routes:
  - All WRITE operations  → 'default' (Primary Postgres)
  - All READ  operations  → 'replica' (Read Replica, falls back to primary if not configured)

Design principles:
  - Schema migrations ONLY run on the primary.  Never on replicas.
  - Test-time behaviour: all reads/writes go to 'default' so Django's
    test runner can use its normal transaction isolation.
  - If DATABASE_REPLICA_URL is not set, 'replica' is not in DATABASES
    and every read also goes to 'default' — graceful fallback.
"""

import random
from django.conf import settings


class PrimaryReplicaRouter:

    # Names of all replica database aliases configured in DATABASES
    _REPLICA_ALIASES = ['replica']  # add 'replica_2', 'replica_3' etc. as you scale

    def _available_replicas(self) -> list[str]:
        """Return only the replicas actually defined in DATABASES."""
        return [
            alias for alias in self._REPLICA_ALIASES
            if alias in settings.DATABASES
        ]

    # ------------------------------------------------------------------
    # Reads
    # ------------------------------------------------------------------
    def db_for_read(self, model, **hints):
        """
        Route reads to a randomly chosen replica for load distribution.
        Falls back to 'default' if no replicas are configured.
        """
        replicas = self._available_replicas()
        if replicas:
            return random.choice(replicas)
        return 'default'

    # ------------------------------------------------------------------
    # Writes
    # ------------------------------------------------------------------
    def db_for_write(self, model, **hints):
        """All writes go to the primary."""
        return 'default'

    # ------------------------------------------------------------------
    # Relations
    # ------------------------------------------------------------------
    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations between objects on any combination of primary/replica.
        Needed when a write object has a FK to an object that was read from a replica.
        """
        db_set = {'default'} | set(self._available_replicas())
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None

    # ------------------------------------------------------------------
    # Migrations
    # ------------------------------------------------------------------
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Only migrate on the primary.
        Replicas receive changes via streaming replication, not direct DDL.
        """
        return db == 'default'
