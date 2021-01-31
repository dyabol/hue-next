import Sync from "./sync";
import Sketch from "./sketch";

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
        //this.sketch.start();
      } else {
        //this.sketch.stop();
      }
    });
  }

  /**
   * @method hooks - Attach hooks to interval change events.
   */
  hooks() {
    this.sync.on("bar", (beat) => {
      console.log("beat", beat);
    });
  }
}
