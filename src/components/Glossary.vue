<template>
  <div class="container-fluid bg-light">
    <div class="row">
      <div class="col"></div>
      <div class="col">
        <br /><br />
        <div class="h2">Glossary of Terms</div>
        <br /><br />
      </div>
      <div class="col"></div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Term</th>
              <th scope="col">Spotify Definition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Popularity</td>
              <td>
                The value will be between 0 and 100, with 100 being the most
                popular. The popularity of a track is a value between 0 and 100,
                with 100 being the most popular. The popularity is calculated by
                algorithm and is based, in the most part, on the total number of
                plays the track has had and how recent those plays are.
                Generally speaking, songs that are being played a lot now will
                have a higher popularity than songs that were played a lot in
                the past. Artist and album popularity is derived mathematically
                from track popularity.
              </td>
            </tr>
            <tr>
              <td>Key</td>
              <td>
                The estimated overall key of the track. Integers map to pitches
                using standard Pitch Class notation . E.g. 0 = C, 1 = C♯/D♭, 2 =
                D, and so on. Includes the modality (major or minor) of a track,
                the type of scale from which its melodic content is derived.
              </td>
            </tr>
            <tr>
              <td>Tempo</td>
              <td>
                In musical terminology, tempo is the speed or pace of a given
                piece and derives directly from the average beat duration. Given
                in beats per minute (BPM).
              </td>
            </tr>
            <tr>
              <td>Time Signature</td>
              <td>
                The time signature (meter) is a notational convention to specify
                how many beats are in each bar (or measure). Assumed to be in
                X/4 time.
              </td>
            </tr>
            <tr>
              <td>Acousticness</td>
              <td>
                A confidence measure from 0.0 to 1.0 of whether the track is
                acoustic. 1.0 represents high confidence the track is acoustic.
              </td>
            </tr>
            <tr>
              <td>Danceability</td>
              <td>
                Danceability describes how suitable a track is for dancing based
                on a combination of musical elements including tempo, rhythm
                stability, beat strength, and overall regularity. A value of 0.0
                is least danceable and 1.0 is most danceable.
              </td>
            </tr>
            <tr>
              <td>Energy</td>
              <td>
                Energy is a measure from 0.0 to 1.0 and represents a perceptual
                measure of intensity and activity. Typically, energetic tracks
                feel fast, loud, and noisy. For example, death metal has high
                energy, while a Bach prelude scores low on the scale. Perceptual
                features contributing to this attribute include dynamic range,
                perceived loudness, timbre, onset rate, and general entropy.
              </td>
            </tr>
            <tr>
              <td>Instrumentalness</td>
              <td>
                Predicts whether a track contains no vocals. “Ooh” and “aah”
                sounds are treated as instrumental in this context. Rap or
                spoken word tracks are clearly “vocal”. The closer the
                instrumentalness value is to 1.0, the greater likelihood the
                track contains no vocal content. Values above 0.5 are intended
                to represent instrumental tracks, but confidence is higher as
                the value approaches 1.0.
              </td>
            </tr>
            <tr>
              <td>Liveness</td>
              <td>
                Detects the presence of an audience in the recording. Higher
                liveness values represent an increased probability that the
                track was performed live. A value above 0.8 provides strong
                likelihood that the track is live.
              </td>
            </tr>
            <tr>
              <td>Loudness</td>
              <td>
                The overall loudness of a track in decibels (dB). Loudness
                values are averaged across the entire track and are useful for
                comparing relative loudness of tracks. Loudness is the quality
                of a sound that is the primary psychological correlate of
                physical strength (amplitude). Values typical range between -60
                and 0 db.
              </td>
            </tr>
            <tr>
              <td>Speechiness</td>
              <td>
                Speechiness detects the presence of spoken words in a track. The
                more exclusively speech-like the recording (e.g. talk show,
                audio book, poetry), the closer to 1.0 the attribute value.
                Values above 0.66 describe tracks that are probably made
                entirely of spoken words. Values between 0.33 and 0.66 describe
                tracks that may contain both music and speech, either in
                sections or layered, including such cases as rap music. Values
                below 0.33 most likely represent music and other non-speech-like
                tracks.
              </td>
            </tr>
            <tr>
              <td>Valence</td>
              <td>
                A measure from 0.0 to 1.0 describing the musical positiveness
                conveyed by a track. Tracks with high valence sound more
                positive (e.g. happy, cheerful, euphoric), while tracks with low
                valence sound more negative (e.g. sad, depressed, angry).
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Glossary"
};
</script>

<style scoped></style>
