<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="game">
    <div class="ui padded grid">
      <div class="sixteen wide column">
        <h2> Aktueller Buchstabe: <b>{{currentLetter}}</b></h2>
      </div>

      <div class="sixteen wide column">
        <form v-on:submit="check" action="">
        <table class="ui celled table">
          <thead>
          <tr>
            <th>Stadt</th>
            <th>Land</th>
            <th>Fluss</th>
            <th>Punkte</th>
          </tr></thead>
          <tbody>
            <tr v-for="(entry, index) in entries">
              <td v-for="entity in ['city', 'country', 'river']">
                {{entry[entity].name}}
                <a v-if="entry[entity].correct" v-bind:href="entry[entity].link" target="_blank">
                  <i class="green checkmark icon"></i>
                </a>
                <div v-else>
                  <i class="red close icon"></i>
                  <a v-on:click="showExamples(entity, index)">Beispiel anzeigen</a>
                  <ul v-show="visible.entity === entity && visible.index === index">
                    <li v-for="example in entry[entity].examples">
                      <a v-bind:href="example.item.value" target="_blank">{{example.itemLabel.value}}</a>
                    </li>
                  </ul>
                </div>
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

      <div class="ui active inverted dimmer" v-if="loading">
        <div class="ui loader"></div>
      </div>
    </div>

  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "game",
  data() {
    const currentLetter = _.sample("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    return {
      entries: [
        {
          city: { name: "Berlin", correct: true, link: "https://www.wikidata.org/wiki/Q64" },
          country: { name: "Belgien", correct: true, link: "https://www.wikidata.org/wiki/Q31" },
          river: { name: "Bröl", correct: true, link: "https://www.wikidata.org/wiki/Q153109" },
          points: 30,
        },
      ],
      newEntry: {
        city: "",
        country: "",
        river: "",
      },
      currentLetter,
      pattern: `^${currentLetter}.*`,
      loading: false,
      visible: { entity: null, index: null },
    };
  },
  computed: {
    totalPoints() { return _.sumBy(this.entries, "points"); },
  },
  methods: {
    check: function check() {
      const self = this;
      this.baseUrl = "https://stadt-land-wikidata.herokuapp.com/";

      function selectNextLetter() {
        self.currentLetter = _.sample("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        self.pattern = `^[${self.currentLetter}].*`;
        self.newEntry = {
          city: "",
          country: "",
          river: "",
        };
        self.loading = false;
      }

      function successHandler(responses) {
        const responsesByEntity = _.chain(responses).map("body.data").keyBy("entity").value();

        function pushResults() {
          self.entries.push({
            city: responsesByEntity.city,
            country: responsesByEntity.country,
            river: responsesByEntity.river,
            points: _.sumBy(responses, response => (response.body.data.correct ? 1 : 0)) * 10,
          });
          selectNextLetter();
        }

        function add(response) {
          responsesByEntity[response.body.data.entity].examples = response.body.data.examples;
        }

        function pushit(exampleResponses) {
          _.forEach(exampleResponses, add);
          pushResults();
        }

        const incorrectResponses = responses.filter(r => !r.body.data.correct);

        if (incorrectResponses.length) {
          const examplePromises = incorrectResponses.map(response =>
            self.$http.get(`${self.baseUrl}${response.body.data.entity}_examples?letter=${self.currentLetter}`),
          );
          Promise.all(examplePromises).then(pushit);
        } else {
          pushResults();
        }
      }

      const promises = [
        this.$http.get(`${self.baseUrl}city?name=${this.newEntry.city}`),
        this.$http.get(`${self.baseUrl}country?name=${this.newEntry.country}`),
        this.$http.get(`${self.baseUrl}river?name=${this.newEntry.river}`),
      ];


      this.loading = true;
      Promise.all(promises).then(successHandler);
    },
    showExamples: function showExamples(entity, index) {
      const settings = { entity, index };
      this.visible = _.isEqual(this.visible, settings) ? {} : settings;
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
