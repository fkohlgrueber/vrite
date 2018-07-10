<template>
  <div id="app" :class="{dragging: drag_start!==null}">
    <span ref="sizeHint" style="visibility: hidden; position: fixed">1</span>
    <div class="code"><div class="codecontent" ref="code"><Module :data="store.data" :avail_width="avail_width"></Module></div></div>
    <div class="separator" @mousedown.stop="handleMouseDown"></div>
    <div class="sidebar" :style="{width: sidebar_width+'px', minWidth: sidebar_width+'px'}" @mousedown.stop.prevent @click.stop.prevent>
      <div><span v-for="p in sel_parents" style="font-size: 10pt; cursor: pointer" @click.stop="p.focus()">{{p.data.type}} -> </span><span style="font-size: 10pt; color: transparent;" v-if="sel_parents.length===0 && sel.length"> -> </span></div>
      {{sel}}
      <div><br></div>
      <div v-for="c in sel_commands" :class="{unavailable: !c[3](), available: c[3]()}" style="font-size: 12pt; " @click.stop="function(){if(c[3]()){c[2]()}}">{{c[0]}}: {{c[1]}}</div>
    </div>
  </div>
</template>

<script>
import store from "./store";
import Module from "./Module";
export default {
  name: 'app',
  components: {Module},
  data () {
    return {
      store: store.store,
      sidebar_width: 300,
      drag_start: null,
      avail_width: 1000,
    }
  },
  methods: {
    clear_sel: function () {
      this.store.selection = null;
    },
    bindMouseEvents() {
      document.addEventListener('mouseup', this.handleMouseUp);
      document.addEventListener('mousemove', this.handleMouseMove);
    },
    removeMouseEvents() {
      document.removeEventListener('mouseup', this.handleMouseUp);
      document.removeEventListener('mousemove', this.handleMouseMove);
    },
    handleMouseDown(evt) {
      this.drag_start = evt.pageX;
      this.bindMouseEvents();
    },
    handleMouseUp(evt) {
      this.drag_start = null;
      this.removeMouseEvents();
    },
    handleMouseMove(evt) {
      this.sidebar_width += -(evt.pageX - this.drag_start);
      this.drag_start = evt.pageX;
      this.$nextTick(this.getWindowWidth);
    },
    getWindowWidth: function(){
      this.avail_width = Math.floor(this.$refs.code.offsetWidth / this.$refs.sizeHint.offsetWidth);
    },
  },
  computed: {
    sel: function () {
      if (this.store.selection !== null){
        return this.store.selection.data.type;
      }else {
        return ""
      }
    },
    sel_parents: function () {
      if (this.store.selection !== null){
        return this.store.selection.get_parents();
      }else {
        return []
      }
    },
    sel_commands: function () {
      if (this.store.selection !== null){
        return this.store.selection.get_commands();
      }else {
        return []
      }
    }
  },
  mounted: function () {
    window.onclick = this.clear_sel;
    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth);

      //Init
      this.getWindowWidth();
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth);
  }
}
</script>

<style>
* {
  font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
  font-size: 15pt;
}

body { margin:0; /* This is used to reset any browser-default margins */ }

  #app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
    height: 100vh;
}

  .codecontent {
    min-height: 80vh;
  }
  .code{
    padding: 10px;
    flex-grow: 1;
    white-space: nowrap;
    overflow-x: auto;
  }

  .separator {
    background-color: lightgray;
    width: 5px;
    min-width: 5px;
    height: 100%;
    cursor: ew-resize;
  }

  .sidebar {
    padding: 10px;
    //border-left: 2px solid grey;
    //width: 30%;
    //min-width: 30%;
    white-space: nowrap;
    overflow-x: auto;
  }

  .dragging {
    cursor: ew-resize;
  }

.astnode:focus {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
}

.astnode:hover:focus {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.astnode:hover {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
}

.reserved {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

input {
  padding: 0;
  border: none;
  background-color: transparent;
}

.unavailable {
  color: lightgrey;
}
.available {
  cursor: pointer;
}

</style>
