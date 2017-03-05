import Vue from "vue";
import Game from "src/components/Game";

describe("Game.vue", () => {
  it("should render correct contents", () => {
    const Constructor = Vue.extend(Game);
    const vm = new Constructor().$mount();
    vm.data.currentLetter = "A";
    expect(vm.$el.querySelector(".game h2").textContent)
      .to.contain("Aktueller Buchstabe: A");
  });
});
