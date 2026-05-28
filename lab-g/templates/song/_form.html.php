<?php
/** @var $song ?\App\Model\Song */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="song[title]" value="<?= $song ? $song->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="artist">Artist</label>
    <input type="text" id="artist" name="song[artist]" value="<?= $song ? $song->getArtist() : '' ?>">
</div>

<div class="form-group">
    <label for="year">Year</label>
    <input type="number" id="year" name="song[year]" value="<?= $song ? $song->getYear() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
