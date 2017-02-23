<template>
  <div class="hello">
    <div class="ui padded grid">
      <div class="sixteen wide column">
        <h2> Aktueller Buchstabe: <b>{{currentLetter}}</b></h2>
      </div>

      <div class="sixteen wide column">
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
            <td>{{entry.city}}</td>
            <td>{{entry.country}}</td>
            <td>{{entry.river}}</td>
            <td>{{entry.points}}</td>
          </tr>
          <tr>
            <td>
              <div class="ui input">
                <input type="text" v-model="newEntry.city" placeholder="Stadt"/>
              </div>
            </td>
            <td>
              <div class="ui input">
                <input type="text" v-model="newEntry.country" placeholder="Land"/>
              </div>
            </td>
            <td>
              <div class="ui input">
                <input type="text" v-model="newEntry.river" placeholder="Fluss"/>
              </div>
            </td>
            <td>
              <button class="ui green labeled icon button" v-on:click="check">
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
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "hello",
  data() {
    return {
      entries: [
        {
          city: "Berlin",
          country: "Belgien",
          river: "Bröl",
          points: 50,
        },
      ],
      newEntry: {
        city: "",
        country: "",
        river: "",
      },
      currentLetter: "A",
    };
  },
  computed: {
    totalPoints: () => _.sumBy(this.entries, "points"),
  },
  methods: {
    check: function check() {
      this.entries.push(_.clone(this.newEntry));
      this.newEntry = {
        city: "",
        country: "",
        river: "",
      };
      this.currentLetter = _.sample("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
