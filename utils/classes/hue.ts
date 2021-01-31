import iro from "@jaames/iro";
import Sync from "./sync";

export default class HueVisualizer {
  sync: Sync;
  constructor({ volumeSmoothing = 100, hidpi = true }) {
    /** Initialize Sync class. */
    this.sync = new Sync({ volumeSmoothing });
    this.watch();
    this.hooks();
  }

  /**
   * @method watch - Watch for changes in state.
   */
  watch() {
    this.sync.watch("active", (val) => {
      /** Start and stop sketch according to the `active` property on our Sync class. */
      if (val === true) {
        console.log("START");
      } else {
        console.log("END");
      }
    });
  }

  setColor() {
    const h = Math.round(360 * this.sync.bar.confidence);
    const s = 100;
    const l = 50;
    const rgb = iro.Color.hsvToRgb(iro.Color.hslToHsv({ h, s, l }));
    fetch(
      `/api/color/1?red=${Math.round(rgb.r)}&green=${Math.round(
        rgb.g
      )}&blue=${Math.round(rgb.b)}&brightness=${Math.round(
        this.sync.beat.confidence * 100
      )}`
    );
  }

  /**
   * @method hooks - Attach hooks to interval change events.
   */
  hooks() {
    this.sync.on("bar", (bar) => {
      console.log("bar", bar.duration, bar.confidence);
      const h = Math.round(360 * bar.confidence);
      const s = 100;
      const l = 50;
      document.getElementById(
        "test"
      ).style.background = `hsl(${h},${s}%,${l}%)`;
      this.setColor();
    });
    this.sync.on("beat", (beat) => {
      //console.log("beat", beat.duration, beat.confidence);
      console.log("beat", beat.confidence);
      document.getElementById("test").style.width = `${Math.round(
        beat.confidence * 100
      )}%`;
      this.setColor();
    });
  }
}
