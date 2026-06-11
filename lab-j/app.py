from flask import Flask, render_template, request, redirect, url_for, abort
from db import get_db, close_db, init_db
import os
import click

def create_app():
    app = Flask(
        __name__,
        instance_relative_config=True,
        static_folder=os.path.join(os.path.dirname(__file__), 'public/assets'),
        static_url_path='/assets'
    )
    os.makedirs(app.instance_path, exist_ok=True)

    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.path.join(app.instance_path, "data.db"),
    )

    @app.teardown_appcontext
    def teardown_db(exception):
        close_db(exception)

    @app.cli.command("init-db")
    def init_db_command():
        """Initialize the database."""
        init_db()
        click.echo("Initialized the database.")

    @app.route("/")
    def index():
        return redirect(url_for("song_list"))

    @app.route("/songs")
    def song_list():
        db = get_db()
        songs = db.execute(
            "SELECT id, title, artist, year FROM song"
        ).fetchall()
        return render_template("song/list.html", songs=songs)

    @app.route("/songs/<int:song_id>")
    def song_detail(song_id):
        db = get_db()
        song = db.execute(
            "SELECT id, title, artist, year FROM song WHERE id = ?",
            (song_id,),
        ).fetchone()
        if song is None:
            abort(404)
        return render_template("song/detail.html", song=song)

    @app.route("/songs/create", methods=["GET", "POST"])
    def song_create():
        if request.method == "POST":
            title = request.form.get("title")
            artist = request.form.get("artist")
            year = request.form.get("year")

            db = get_db()
            db.execute(
                "INSERT INTO song (title, artist, year) VALUES (?, ?, ?)",
                (title, artist, year),
            )
            db.commit()
            return redirect(url_for("song_list"))

        return render_template("song/create.html", action="create", song=None)

    @app.route("/songs/<int:song_id>/edit", methods=["GET", "POST"])
    def song_edit(song_id):
        db = get_db()
        song = db.execute(
            "SELECT id, title, artist, year FROM song WHERE id = ?",
            (song_id,),
        ).fetchone()
        if song is None:
            abort(404)

        if request.method == "POST":
            title = request.form.get("title")
            artist = request.form.get("artist")
            year = request.form.get("year")

            db.execute(
                "UPDATE song SET title = ?, artist = ?, year = ? WHERE id = ?",
                (title, artist, year, song_id),
            )
            db.commit()
            return redirect(url_for("song_detail", song_id=song_id))

        return render_template("song/edit.html", action="edit", song=song)

    @app.route("/songs/<int:song_id>/delete", methods=["POST"])
    def song_delete(song_id):
        db = get_db()
        song = db.execute(
            "SELECT id FROM song WHERE id = ?",
            (song_id,),
        ).fetchone()
        if song is None:
            abort(404)

        db.execute("DELETE FROM song WHERE id = ?", (song_id,))
        db.commit()
        return redirect(url_for("song_list"))


    return app


if __name__ == "__main__":
    app = create_app()
    app.run(port=57773, debug=True)
