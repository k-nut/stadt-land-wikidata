<template>
  <div class="hello">
    <div class="ui padded grid">
      <div class="sixteen wide column">
        <h2> Aktueller Buchstabe: <b>{{currentLetter}}</b></h2>
      </div>

      <div class="sixteen wide column">
        <form v-on:submit="check">
        <table class="ui celled table">
          <thead>
          <tr>
            <th>Stadt</th>
            <th>Land</th>
            <th>Fluss</th>
            <th>Punkte</th>
          </tr></thead>
          <tbody>
          <tr v-for="entry in entries">
            <td>
              {{entry.city.name}}
              <a v-if="entry.city.correct" v-bind:href="entry.city.link" target="_blank">
                <i class="green checkmark icon"></i>
              </a>
              <i v-else class="red close icon"></i>
            </td>
            <td>
              {{entry.country.name}}
              <a v-if="entry.country.correct" v-bind:href="entry.country.link" target="_blank">
                <i class="green checkmark icon"></i>
              </a>
              <i v-else class="red close icon"></i>
            </td>
            <td>
              {{entry.river.name}}
              <a v-if="entry.river.correct" v-bind:href="entry.river.link" target="_blank">
                <i class="green checkmark icon"></i>
              </a>
              <i v-else class="red close icon"></i>
            </td>
            <td>{{entry.points}}</td>
          </tr>

          <tr>
            <td>
              <div class="ui input">
                <input type="text" v-model="newEntry.city" placeholder="Stadt" v-bind:pattern="pattern"/>
              </div>
            </td>
            <td>
              <div class="ui input">
                <input type="text" v-model="newEntry.country" placeholder="Land" v-bind:pattern="pattern"/>
              </div>
            </td>
            <td>
              <div class="ui input">
                <input type="text" v-model="newEntry.river" placeholder="Fluss" v-bind:pattern="pattern"/>
              </div>
            </td>
            <td>
              <button type="submit" class="ui green labeled icon button">
                <i class="checkmark icon"></i>
                Check
              </button>
            </td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <th colspan="3"> </th>
            <th>{{totalPoints}}</th>
          </tr>
          </tfoot>
        </table>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "hello",
  data() {
    const currentLetter = _.sample("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    return {
      entries: [
        {
          city: { name: "Berlin", correct: true, link: "https://www.wikidata.org/wiki/Q64" },
          country: { name: "Belgien", correct: true, link: "https://www.wikidata.org/wiki/Q31" },
          river: { name: "Bröl", correct: true, link: "https://www.wikidata.org/wiki/Q153109" },
          points: 50,
        },
      ],
      newEntry: {
        city: "",
        country: "",
        river: "",
      },
      currentLetter,
      pattern: `^${currentLetter}.*`,

    };
  },
  computed: {
    totalPoints: () => _.sumBy(this.entries, "points"),
  },
  methods: {
    check: function check() {
      const self = this;

      function selectNextLetter() {
        self.currentLetter = _.sample("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        self.pattern = `^[${self.currentLetter}].*`;
        this.newEntry = {
          city: "",
          country: "",
          river: "",
        };
      }

      function successHandler(responses) {
        const cityResponse = responses[0].body.data;
        const countryResponse = responses[1].body.data;
        const riverResponse = responses[2].body.data;

        cityResponse.name = self.newEntry.city;
        riverResponse.name = self.newEntry.river;
        countryResponse.name = self.newEntry.country;
        self.entries.push({
          city: cityResponse,
          country: countryResponse,
          river: riverResponse,
          points: _.sumBy(responses, response => (response.body.data.correct ? 1 : 0)) * 10,
        });
        selectNextLetter();
      }

      const promises = [
        this.$http.get(`https://stadt-land-wikidata.herokuapp.com/city?name=${this.newEntry.city}`),
        this.$http.get(`https://stadt-land-wikidata.herokuapp.com/country?name=${this.newEntry.country}`),
        this.$http.get(`https://stadt-land-wikidata.herokuapp.com/river?name=${this.newEntry.river}`),
      ];

      Promise.all(promises).then(successHandler);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input:invalid{
  border-color: darkred;
}

</style>
