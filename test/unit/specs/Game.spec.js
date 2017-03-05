import Vue from "vue";
import VueResource from "vue-resource";
import Game from "src/components/Game";

Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
  const regex = /\/(\w+)\?/;
  const entity = regex.exec(request.url)[1];
  next(request.respondWith({ data: { correct: true, entity, name: entity } }, {
    status: 200,
    statusText: "ok",
  }));
});

describe("Game.vue", () => {
  it("should render correct contents", (done) => {
    const vm = new Vue(Game).$mount();

    function assertions() {
      // TODO: those assertions are not actually working. Find out why
      console.log(vm.entries.length);
      expect(vm.$el.querySelectorAll("tr").length).to.equal(5);
      expect(vm.entries.length).to.equal(2);
      expect(vm.totalPoints).to.equal(60);
      // done();
    }

    vm.currentLetter = "S";
    Vue.nextTick().then(() => {
      expect(vm.$el.querySelector(".game h2").textContent)
        .to.contain("Aktueller Buchstabe: S");
      Vue.nextTick().then(assertions);
      done();
    });

    expect(vm.$el.querySelector(".game thead").textContent)
      .to.contain("Stadt");
    expect(vm.totalPoints).to.equal(30);
    vm.newEntry.city = "Stuttgart";
    vm.newEntry.country = "Schweden";
    vm.newEntry.river = "Spree";
    expect(vm.$el.querySelectorAll("tr").length).to.equal(4);
    vm.check();
    Vue.nextTick().then(assertions).catch(done);
  });
});
