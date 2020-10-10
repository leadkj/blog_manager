<template>
  <div
      style="height: 100%;
    background: #002833;"
  >
    <div id="terminal-container" ref="terminal"></div>
  </div>
</template>

<script>

import {Terminal} from "xterm";
import {FitAddon} from "xterm-addon-fit";
import {AttachAddon} from 'xterm-addon-attach'
import "xterm/css/xterm.css";
import "xterm/lib/xterm.js";

export default {
  name: "ConsoleCpn",
  data() {
    return {
      websocket: '',
      rows: 40,
      cols: 100,
      ipaddr:''
    }
  },
  methods: {
    initTerm() {
      let that = this;
      let term = new Terminal({
        rendererType: "canvas",
        rows: parseInt(that.rows), //行数
        cols: parseInt(that.cols), // 不指定行数，自动回车后光标从下一行开始
        cursorStyle: 'underline',
        cursorBlink: true,
        convertEol: true,
        disableStdin: false,
        theme: {
          foreground: 'white',
          background: '#000000',
          cursor: 'help',
        }

      })
      term.open(document.getElementById('terminal-container'))
      var fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddon.fit();
      window.addEventListener("resize", resizeScreen);
      this.websocket = new WebSocket('ws://127.0.0.1/ws/get_console_output/'+this.ipaddr+'/')
      this.websocket.onopen = () => {
        const data = {"Op": 'stdin', 'Data': ''}
        this.websocket.send(JSON.stringify(data))
      }
      this.websocket.onmessage = (res) => {
        // console.log(JSON.parse(res.data).message)
        term.write(JSON.parse(res.data).message)
      }

      function runFakeTerminal() {
        if (term._initialized) {
          return;
        }
        term._initialized = true


        term.onData(function (key) {
          let order = {
            Data: key,
            Op: "stdin"
          };
          that.websocket.send(JSON.stringify(order));
          that.websocket.onmessage = res => {
            console.log(res);
            term.write(JSON.parse(res.data).message)
          }

        });


      }

      runFakeTerminal()
      function resizeScreen() {
      // 不传size

      try {
        fitAddon.fit();
        // 窗口大小改变时触发xterm的resize方法，向后端发送行列数，格式由后端决定
        // 这里不使用size默认参数，因为改变窗口大小只会改变size中的列数而不能改变行数，所以这里不使用size.clos,而直接使用获取我们根据窗口大小计算出来的行列数
        term.onResize(() => {
          data={ Op: "resize", Cols: term.cols, Rows: term.rows }
          that.websocket.send(JSON.stringify(data));
        });
      } catch (e) {
        console.log("e", e.message);
      }
    }
    },

  },
  created() {
    this.ipaddr = this.$route.path.split("/").pop()
  },
  mounted() {
    this.initTerm()
  },

}
</script>

<style scoped>

</style>