figlet.defaults({ fontPath: "https://unpkg.com/figlet@1.4.0/fonts/" });
figlet.preloadFonts(["Standard", "Slant"], ready);

if (localStorage.getItem("num") === null) {
  localStorage.setItem("num", "0");
}

if (localStorage.getItem("imgn") === null) {
  localStorage.setItem("imgn", "0");
}

var ver = "v1.0";
let dt = new Date();
let lis, cnt;

function ready() {
  $("#term").terminal(
    {
      help: function () {
        let hlpmsg = `A GNU bash replica to help you manage notes, version 1.0-release. \nThese shell commands are defined internally.  Type 'help' to see this list.\nUse 'info bash' to find out more about the shell in general.\n`;
        let hlpfrmt = `${Prism.highlight(
          hlpmsg,
          Prism.languages.bash,
          "bash"
        )}`;
        this.echo($("<div></div>").html(hlpfrmt).contents());
        this.echo();
        this.echo(
          $(
            "<center><font color='#ffff00'>nmd</font> [list] [create] [remove] : helps you add, remove or list notes<br><font color='pink'>img</font> [list] [create] [remove] : helps you add, remove or list images</center>"
          )
        );
      },

      nmd: function (keywrd) {
        if (keywrd.toLocaleLowerCase() === "list") {
          lis = list();
          lis != [] ? lis.forEach(this.echo) : this.echo("Nothing to show");
        } else if (keywrd.toLocaleLowerCase() === "create") {
          this.read("Title : ").then((title) => {
            this.read("Content : ").then((content) => {
              dt = new Date();
              let cnt = Number(localStorage.getItem("num"));
              let note = JSON.stringify({
                T: title,
                C: content,
                TimeStamp: dt.toLocaleString(),
              });
              localStorage.setItem(String(cnt), note);
              localStorage.setItem("num", String(cnt + 1));
            });
          });
        } else if (keywrd.toLocaleLowerCase() === "remove") {
          lis = list();
          if (lis != []) {
            this.echo("Available option : ");
            list().forEach(this.echo);
            this.read("Enter index for the Note to remove : ").then((indx) => {
              indx = (indx ? Number(indx) : undefined);
              cnt = Number(localStorage.getItem("num"));
              if (0 < indx && indx <= cnt) {
                localStorage.removeItem(String(indx - 1));
                localStorage.setItem("num", String(cnt - 1));
                this.echo('Note removed')
              }
            });
          } else {
            this.echo("Nothing to remove");
          }
        } else {
          this.echo(
            `[[;red;]bash]: nmd: [[;orange;]${keywrd}]: invalid option`
          );
        }
      },
      img: function (keywrd) {
        if (keywrd.toLocaleLowerCase() === "list") {
          let chk = img(this);
          chk ? undefined : this.echo("Nothing to show");
        } else if (keywrd.toLocaleLowerCase() === "create") {
          this.echo(
            $(`<center><label for="file" class="img-upload">Image Upload</label>
            <input type="file" accept="image/*" id="file" required></center>
            <script>
            img_();
            </script>`)
          );
        } else if (keywrd.toLocaleLowerCase() === "remove") {
          this.echo("Available option : ");
          let chk = img(this);
          if (chk) {
            this.read("Enter index for the Note to remove : ").then((indx) => {
              indx = (indx ? Number(indx) : undefined);
              cnt = Number(localStorage.getItem("imgn"));
              console.log(indx)
              console.log(chk)
              console.log((0 < indx && indx <= cnt))
              if (0 < indx && indx <= cnt) {
                let cnt = Number(localStorage.getItem("imgn"));
                localStorage.removeItem("img" + String(Number(indx) - 1));
                localStorage.setItem("imgn", String(cnt - 1));
              }
            });
          } else {
            this.echo("Nothing to remove");
          }
        } else {
          this.echo(
            `[[;red;]bash]: nmd: [[;orange;]${keywrd}]: invalid option`
          );
        }
      },
    },

    {
      greetings: function () {
        return (
          render(`#Notes for <DEV>`, "Standard", this.cols()) +
          `\nWelcome to the first CLI based Note Manager right at your browser. [[;rgba(255,255,255,0.99);]Version ${ver}]\nType help to know more.`
        );
      },
      prompt: "root@nm-dev:~# ",
      height: innerHeight * 0.9,
      width: innerWidth * 0.7,
      clear: false,
      completion: true,
    }
  );
}

$.terminal.syntax("bash");
$.terminal.new_formatter(function (string) {
  if (/help/g.test(string)) {
    return string.replace(/help/g, "[[;blue;]help]");
  }
});
$.terminal.new_formatter(function (string) {
  if (/nmd/g.test(string)) {
    return string.replace(/nmd/g, "[[;yellow;]nmd]");
  }
});
$.terminal.new_formatter(function (string) {
  if (/img/g.test(string)) {
    return string.replace(/img/g, "[[;pink;]img]");
  }
});

function render(text, font, cols) {
  return figlet.textSync(text, {
    font: font || "Standard",
    width: !term ? 80 : cols,
    whitespaceBreak: true,
  });
}

function list() {
  let res = [];
  for (let i = 0; i < Number(localStorage.getItem("num")); i++) {
    try {
      let j = JSON.parse(localStorage.getItem(i));
      let T = j["T"];
      let C = j["C"];
      let time = j["TimeStamp"];
      let str = `Note-${
        i + 1
      } : {'Title' :  '${T}' ,\n'Content' : '${C}' ,\n'TimeStamp' : '${
        time ? time : "TimeStamp not found"
      }'}`;
      let el = `${Prism.highlight(
        str,
        Prism.languages.javascript,
        "javascript"
      )}`;
      let jobj = $("<div/>").html(el).contents();
      res.push(jobj);
    } catch {}
  }
  return res;
}

function img(term) {
  if (Number(localStorage.getItem("imgn")) > 0) {
    for (let i = 0; i < Number(localStorage.getItem("imgn")); i++) {
      try {
        let j = JSON.parse(localStorage.getItem("img" + i));
        let Image = j["Image"];
        let time = j["TimeStamp"];
        let el = $("<img class='image' src=" + Image + "></img>");
        term.echo(`Img-${i + 1} : {'Image' :`);
        term.echo(el);
        term.echo(`,\n'TimeStamp' : '${time ? time : "TimeStamp not found"}'}`);
      } catch {}
    }
    return true;
  } else {
    return false;
  }
}
