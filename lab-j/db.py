import sqlite3
from flask import g, current_app
import os


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(
            current_app.config["DATABASE"],
            detect_types=sqlite3.PARSE_DECLTYPES,
        )
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """Initialize the database by running SQL migrations."""
    db = sqlite3.connect(
        os.path.join(current_app.instance_path, "data.db"),
    )
    
    sql_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "sql"
    )
    
    # Execute all SQL files in order
    for sql_file in sorted(os.listdir(sql_dir)):
        if sql_file.endswith(".sql"):
            with open(os.path.join(sql_dir, sql_file), "r") as f:
                db.executescript(f.read())
    
    db.commit()
    db.close()

