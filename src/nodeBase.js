import store from "./store"

export default {
  data: function() {
    return {
      store: store.store,
      default_child_idx: 0,
    }
  },
  props: {
    data: Object,
    parent: Object,  // vue component
    indent: Number,  // amount of indentation
  },
  methods: {
    focus: function () {
      this.$refs.elmt.focus();
      this.store.selection = this;
    },
    onKey: function (evt) {
      this.get_commands().forEach(function (c) {
        if (evt.key === c[0] && c[3]()){
          c[2](evt);
          evt.stopPropagation();
        }
      });
    },
    get_parents: function(){
      let parents = [];
      let elmt = this;
      while(elmt.parent){
        parents.push(elmt.parent);
        elmt = elmt.parent;
      }
      return parents.reverse();
    },
    has_parent: function(){
      return !!this.parent;
    },
    select_parent: function(evt){
      if (this.parent){
        this.parent.focus();
      } else {
        console.log("No Parent")
      }
    },
    has_child: function(){
      return this.get_children().length > 0;
    },
    select_child: function(evt){
      if (this.get_children().length){
        if (this.get_children().length>this.data.default_child_idx){
          this.get_children()[this.data.default_child_idx].focus();
        }else{
          this.data.default_child_idx = 0;
          this.get_children()[0].focus();
        }
      }else{
        console.log("No Child")
      }
    },
    has_right_sibling: function(){
      if (this.parent) {
        let idx = this.parent.get_children().indexOf(this) + 1;
        if (idx < this.parent.get_children().length) {
          return true;
        }
      }
      return false;
    },
    select_right_sibling: function(evt){
      if (this.parent){
        let idx = this.parent.get_children().indexOf(this)+1;
        if (idx < this.parent.get_children().length){
          this.parent.get_children()[idx].focus();
          this.parent.data.default_child_idx = idx;
        }else{
          console.log("No Right Sibling");
        }
      }else{
        console.log("No Parent");
      }
    },
    has_left_sibling: function(){
      if (this.parent) {
        let idx = this.parent.get_children().indexOf(this) - 1;
        if (idx >= 0) {
          return true;
        }
      }
      return false;
    },
    select_left_sibling: function(evt){
      if (this.parent){
        let idx = this.parent.get_children().indexOf(this)-1;
        if (idx >= 0){
          this.parent.get_children()[idx].focus();
          this.parent.data.default_child_idx = idx;
        }else{
          console.log("No Left Sibling");
        }
      }else{
        console.log("No Parent");
      }
    },
    get_base_commands: function () {
      return [
        ["ArrowUp", "Select parent", this.select_parent, this.has_parent],
        ["ArrowDown", "Select child", this.select_child, this.has_child],
        ["ArrowRight", "Select right", this.select_right_sibling, this.has_right_sibling],
        ["ArrowLeft", "Select left", this.select_left_sibling, this.has_left_sibling],
        ["Delete", "delete node", this.delete_this_node, this.is_deletable],
        ["Backspace", "delete node", this.delete_bs_this_node, this.is_deletable],
      ];
    },
    delete_this_node: function(){
      this.parent.replace_child(this, null);
    },
    delete_bs_this_node: function(){
      this.parent.replace_child(this, null, false);
    },
    is_deletable: function () {
      return this.has_parent() && !this.is_meta_node;
    }
  },
  computed: {
    thisNode: function () {
      return this;
    },
    is_meta_node: function () {
      return false;
    }
  },
  beforeCreate: function () {
    this.$options.components.nodecomp = require('./nodecomp.vue').default;
  }
}
