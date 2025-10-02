class Settings extends MC {
  constructor() {
    super();
    this.openSettings = super.state(false);
    this.svgGear = `<svg fill="#2c3668" width="64px" height="64px" viewBox="-102.4 -102.4 716.80 716.80" id="_x30_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" stroke="#2c3668"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.024"></g><g id="SVGRepo_iconCarrier"><path d="M496.851,212.213l-48.806-12.201c-4.106-14.108-9.722-27.572-16.666-40.205l25.89-43.151 c4.722-7.869,3.482-17.943-3.008-24.432l-34.485-34.485c-6.489-6.49-16.563-7.729-24.432-3.008l-43.151,25.89 c-12.633-6.944-26.097-12.56-40.205-16.666l-12.201-48.805C297.561,6.246,289.562,0,280.384,0h-48.769 c-9.177,0-17.177,6.246-19.403,15.149l-12.201,48.805c-14.108,4.106-27.572,9.722-40.205,16.666l-43.151-25.89 c-7.87-4.722-17.943-3.482-24.432,3.008L57.738,92.223c-6.489,6.489-7.729,16.562-3.008,24.432l25.89,43.151 c-6.944,12.633-12.56,26.097-16.666,40.205l-48.806,12.201C6.246,214.438,0,222.438,0,231.615v48.769 c0,9.177,6.246,17.177,15.149,19.403l48.806,12.201c4.106,14.108,9.722,27.572,16.666,40.205l-25.89,43.151 c-4.722,7.869-3.482,17.943,3.008,24.432l34.485,34.485c6.489,6.49,16.563,7.729,24.432,3.008l43.151-25.89 c12.633,6.944,26.097,12.56,40.205,16.666l12.201,48.805c2.226,8.903,10.225,15.149,19.403,15.149h48.769 c9.177,0,17.177-6.246,19.403-15.149l12.201-48.805c14.108-4.106,27.572-9.722,40.205-16.666l43.151,25.89 c7.87,4.722,17.943,3.482,24.432-3.008l34.485-34.485c6.489-6.489,7.729-16.562,3.008-24.432l-25.89-43.151 c6.944-12.633,12.56-26.097,16.666-40.205l48.806-12.201c8.903-2.226,15.149-10.226,15.149-19.403v-48.769 C512,222.438,505.754,214.438,496.851,212.213z M256,336c-44.112,0-80-35.888-80-80s35.888-80,80-80s80,35.888,80,80 S300.112,336,256,336z"></path></g></svg>`;

    const [sidebarHide] = MC.getState("sidebarHide_mcUniqueState");
    this.sidebarHide = sidebarHide;
  }

  setOpenDialog(value) {
    this.openSettings.set(value);
  }

  render(state, { activatedBlackMiror }) {
    const [openDialog] = state.local;

    if (!openDialog) {
      return $("<div>")
        .addClass("settings-icon")
        .append(this.svgGear)
        .on("click", () => {
          activatedBlackMiror(true);
          this.setOpenDialog(true);
        });
    }

    const sidebarInput = $("<input>")
      .attr("type", "checkbox")
      .attr("id", "hide-sidebar")
      .attr("checked", this.sidebarHide.get())
      .addClass("w-4 h-4 cursor-pointer");

    return $("<div>")
      .addClass(
        "fixed inset-0 flex items-center justify-center z-50 bg-black/60"
      )
      .append(
        $("<div>")
          .addClass(
            "bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg p-6 relative"
          )
          .append(
            $("<h2>")
              .addClass(
                "text-xl font-bold mb-4 text-gray-900 dark:text-gray-100"
              )
              .text("Настройки"),
            $("<div>")
              .addClass("space-y-4 text-gray-700 dark:text-gray-300")
              .append(
                $("<div>")
                  .addClass("flex items-center gap-2")
                  .append(
                    sidebarInput,
                    $("<label>")
                      .attr("for", "hide-sidebar")
                      .addClass("cursor-pointer select-none")
                      .text("Скрывать боковую панель")
                  ),
                $("<div>")
                  .addClass("flex justify-end")
                  .append(
                    $("<button>")
                      .addClass(
                        "px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition"
                      )
                      .text("Применить")
                      .on("click", () => {
                        const sidebarHideVal = $(sidebarInput).prop("checked");
                        this.sidebarHide.set(sidebarHideVal);

                        activatedBlackMiror(false);
                        this.setOpenDialog(false);
                      })
                  )
              ),
            $("<button>")
              .addClass(
                "absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              )
              .html("✕")
              .on("click", () => {
                activatedBlackMiror(false);
                this.setOpenDialog(false);
              })
          )
      );
  }
}
